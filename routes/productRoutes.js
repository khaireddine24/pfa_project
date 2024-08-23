// routes/productRoutes.js
import express from 'express';
import { addProduct, getProducts, getProductById, addYear } from '../controllers/productController.js';

const router = express.Router();

router.post('/', addProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id/years', addYear);

export default router;
