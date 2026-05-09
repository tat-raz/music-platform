import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import {
  getEvents,
  getStats,
  getUserDetails,
  getUsers,
} from '../controllers/admin.controller';

const router = Router();

router.get('/users', authMiddleware, adminMiddleware, getUsers);
router.get('/events', authMiddleware, adminMiddleware, getEvents);
router.get('/stats', authMiddleware, adminMiddleware, getStats);
router.get('/users/:id', authMiddleware, adminMiddleware, getUserDetails);

export default router;