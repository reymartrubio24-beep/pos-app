import express from 'express';
import * as productController from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../config/multer.js';

const router = express.Router();

router.get('/', productController.getProducts);
router.post('/', authenticate, authorize(['owner']), upload.single('image'), productController.createProduct);
router.put('/:id', authenticate, authorize(['owner']), upload.single('image'), productController.updateProduct);
router.post('/adjust', authenticate, authorize(['owner']), productController.adjustInventory);
router.get('/low-stock', authenticate, authorize(['owner']), productController.getLowStock);

export default router;
