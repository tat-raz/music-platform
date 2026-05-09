import prisma from '../prisma';

export const increaseUserRisk = async (userId: string, points: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      riskScore: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const newRiskScore = Math.min(user.riskScore + points, 100);

  return prisma.user.update({
    where: { id: userId },
    data: {
      riskScore: newRiskScore,
    },
    select: {
      id: true,
      riskScore: true,
    },
  });
};

export const getRiskLevel = (riskScore: number) => {
  if (riskScore >= 70) {
    return 'high';
  }

  if (riskScore >= 30) {
    return 'medium';
  }

  return 'low';
};

export const getSecurityMessage = (riskScore: number) => {
  if (riskScore >= 70) {
    return 'High risk detected. Access may be restricted.';
  }

  if (riskScore >= 30) {
    return 'Suspicious activity detected. Some actions may be limited.';
  }

  return 'Account activity looks normal.';
};

export const decreaseUserRisk = async (userId: string, points: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      riskScore: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const newRiskScore = Math.max(user.riskScore - points, 0);

  return prisma.user.update({
    where: { id: userId },
    data: {
      riskScore: newRiskScore,
    },
    select: {
      id: true,
      riskScore: true,
    },
  });
};

export const applyLoginFailedRiskRule = async (userId: string) => {
  const recentEvents = await prisma.event.findMany({
    where: {
      userId,
    },
    orderBy: {
      timestamp: 'desc',
    },
    take: 3,
    select: {
      type: true,
    },
  });

  const failedAttemptsCount = recentEvents.filter(
    (event) => event.type === 'login_failed'
  ).length;

  if (failedAttemptsCount === 3) {
    await increaseUserRisk(userId, 20);

    return {
      applied: true,
      points: 20,
      reason: 'three_failed_login_attempts',
    };
  }

  return {
    applied: false,
    points: 0,
    reason: null,
  };
};