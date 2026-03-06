import express from 'express';
import { buyStock, sellStock } from '../controllers/buySellController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
router.post('/buy', authMiddleware, buyStock);
router.post('/sell', authMiddleware, sellStock);

export default router;