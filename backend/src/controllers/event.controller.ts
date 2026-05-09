import { Request, Response } from 'express';
import { createEvent } from '../services/event.service';
import { increaseUserRisk } from '../services/risk.service';


interface AuthRequest extends Request {
  user?: any;
  body: {
    type?: string;
    metadata?: any;
  };
}

export const createUserEvent = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { type, metadata } = req.body;

    if (!type) {
      return res.status(400).json({
        message: 'Event type is required',
      });
    }

    const event = await createEvent({
      userId,
      type,
      metadata: metadata ? JSON.stringify(metadata) : undefined,
    });

    if (type === 'cart_add_warning') {
        await increaseUserRisk(userId, 5);
    }

    if (type === 'cart_add_blocked') {
        await increaseUserRisk(userId, 10);
    }

    return res.status(201).json({
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to create event',
    });
  }
};