import express from 'express';
import { getHistory, getAnalysis, deleteAnalysis } from '../controllers/historyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getHistory);
router.get('/:id', getAnalysis);
router.delete('/:id', deleteAnalysis);

export default router;
