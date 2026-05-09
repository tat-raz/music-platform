import bcrypt from 'bcryptjs';
import prisma from '../prisma';
import { generateToken } from '../utils/jwt';
import { createEvent } from './event.service';
import {
  decreaseUserRisk,
  getRiskLevel,
  getSecurityMessage,
  increaseUserRisk,
  applyLoginFailedRiskRule,
} from './risk.service';

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export const registerUser = async ({ name, email, password }: RegisterInput) => {
  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim().toLowerCase();
  const trimmedPassword = password?.trim();

  if (!trimmedName || !trimmedEmail || !trimmedPassword) {
    const error = new Error('All fields are required');
    (error as any).statusCode = 400;
    throw error;
  }

  if (trimmedPassword.length < 6) {
    const error = new Error('Password must be at least 6 characters long');
    (error as any).statusCode = 400;
    throw error;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: trimmedEmail },
  });

  if (existingUser) {
    const error = new Error('Email already in use');
    (error as any).statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

  const newUser = await prisma.user.create({
    data: {
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      riskScore: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  await createEvent({
    userId: newUser.id,
    type: 'register_success',
    metadata: JSON.stringify({
        email: newUser.email,
    }),
  });

  return newUser;
};

export const loginUser = async ({ email, password }: LoginInput) => {
  const trimmedEmail = email?.trim().toLowerCase();
  const trimmedPassword = password?.trim();

  if (!trimmedEmail || !trimmedPassword) {
    const error = new Error('Email and password are required');
    (error as any).statusCode = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { email: trimmedEmail },
  });

  if (!user) {
    const error = new Error('Invalid email or password');
    (error as any).statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(trimmedPassword, user.password);

  if (!isPasswordValid) {
    await createEvent({
      userId: user.id,
      type: 'login_failed',
      metadata: JSON.stringify({
        reason: 'invalid_password',
        email: user.email,
      }),
    });

    await increaseUserRisk(user.id, 10);

    const ruleResult = await applyLoginFailedRiskRule(user.id);

    if (ruleResult.applied) {
      await createEvent({
        userId: user.id,
        type: 'risk_rule_applied',
        metadata: JSON.stringify({
          reason: ruleResult.reason,
          points: ruleResult.points,
        }),
      });
    }

    const error = new Error('Invalid email or password');
    (error as any).statusCode = 401;
    throw error;
  }

  if (user.riskScore >= 70) {
    await createEvent({
      userId: user.id,
      type: 'login_blocked',
      metadata: JSON.stringify({
        reason: 'high_risk_score',
        riskScore: user.riskScore,
        email: user.email,
      }),
    });

    const error = new Error('Login blocked due to high risk score');
    (error as any).statusCode = 403;
    throw error;
  }

  const updatedRisk = await decreaseUserRisk(user.id, 5);

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  await createEvent({
    userId: user.id,
    type: 'login_success',
    metadata: JSON.stringify({
        email: user.email,
    }),
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      riskScore: updatedRisk.riskScore,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    riskLevel: getRiskLevel(updatedRisk.riskScore),
    securityMessage: getSecurityMessage(updatedRisk.riskScore),
  };
};

export const getUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: {id: userId},
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      riskScore: true,
      createdAt: true,
    },
  });
};