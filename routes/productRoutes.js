import express from 'express';
import {
  getProducts,
  getProduct,
  createProductHandler,
  updateProductHandler,
  updateStock,
  deleteProductHandler,
} from '../controllers/productController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes - Manager only
router.post('/', verifyToken, authorizeRoles('manager'), createProductHandler);
router.put('/:id', verifyToken, authorizeRoles('manager'), updateProductHandler);
router.patch('/:id/stock', verifyToken, authorizeRoles('manager'), updateStock);
router.delete('/:id', verifyToken, authorizeRoles('manager'), deleteProductHandler);

export default router;

