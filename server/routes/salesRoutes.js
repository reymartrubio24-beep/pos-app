import express from 'express';
import * as salesController from '../controllers/salesController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize(['cashier', 'owner']), salesController.createSale);
router.get('/', authenticate, authorize(['owner', 'cashier']), salesController.getSales);

export default router;
