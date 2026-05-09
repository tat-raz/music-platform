import { Router } from 'express';
import { createUserEvent } from '../controllers/event.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createUserEvent);

export default router;