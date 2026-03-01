import express from 'express';
import * as salesController from '../controllers/salesController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/analytics', authenticate, authorize(['owner']), salesController.getAnalytics);
router.get('/audit-logs', authenticate, authorize(['owner']), salesController.getAuditLogs);

export default router;
