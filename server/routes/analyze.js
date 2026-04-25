import express from 'express';
import { analyze } from '../controllers/analyzeController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { analyzeLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', analyzeLimiter, optionalAuth, analyze);

export default router;
