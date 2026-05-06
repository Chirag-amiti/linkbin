import express from 'express';

import { getMe, login, register } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authRateLimit } from '../middleware/rateLimiter.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { loginSchema, registerSchema } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', authRateLimit, validateRequest(registerSchema), register);
router.post('/login', authRateLimit, validateRequest(loginSchema), login);
router.get('/me', protect, getMe);

export default router;
