import { Request, Response } from 'express';
import { loginUser, registerUser, getUserById } from '../services/auth.service';


interface AuthRequest extends Request {
  user?: any;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser({ name, email, password });

    return res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    const statusCode = (error as any).statusCode || 500;
    const message = (error as Error).message || 'Internal server error';

    return res.status(statusCode).json({
      message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser({ email, password });

    return res.status(200).json({
      message: 'Login successful',
      ...result,
    });
  } catch (error) {
    const statusCode = (error as any).statusCode || 500;
    const message = (error as Error).message || 'Internal server error';

    return res.status(statusCode).json({
      message,
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      user,
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
    });
  }
};