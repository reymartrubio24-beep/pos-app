import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize(['owner']), userController.getUsers);
router.post('/', authenticate, authorize(['owner']), userController.createUser);
router.delete('/:id', authenticate, authorize(['owner']), userController.deleteUser);

export default router;
