import { Request, Response } from 'express';
import {
  getEventsForAdmin,
  getSecurityStats,
  getUsersForAdmin,
  getUserDetailsForAdmin
} from '../services/admin.service';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getUsersForAdmin();

    return res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch users',
    });
  }
};

export const getEvents = async (_req: Request, res: Response) => {
  try {
    const events = await getEventsForAdmin();

    return res.status(200).json({
      events,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch events',
    });
  }
};

export const getStats = async (_req: Request, res: Response) => {
  try {
    const stats = await getSecurityStats();

    return res.status(200).json({
      stats,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch security statistics',
    });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await getUserDetailsForAdmin(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch user details',
    });
  }
};