import { Router } from 'express';
import * as productModel from '../models/product.js';
import { AppError } from '../middleware/errorHandler.js';
import { requireAdmin } from '../middleware/auth.js';
import { validateCreateProduct, validateUpdateProduct } from '../middleware/validation.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const products = await productModel.findAllAvailable();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/all', async (_req, res, next) => {
  try {
    const products = await productModel.findAll();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/slug/:slug', async (req, res, next) => {
  try {
    const product = await productModel.findBySlug(req.params.slug);
    if (!product) throw new AppError(404, 'Product not found');
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError(400, 'Invalid product ID');
    const product = await productModel.findById(id);
    if (!product) throw new AppError(404, 'Product not found');
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAdmin, validateCreateProduct, async (req, res, next) => {
  try {
    const product = await productModel.create(req.body);
    res.status(201).json(product);
  } catch (err: any) {
    if (err?.code === '23505') {
      next(new AppError(409, 'A product with this slug already exists'));
      return;
    }
    next(err);
  }
});

router.put('/:id', requireAdmin, validateUpdateProduct, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError(400, 'Invalid product ID');
    const product = await productModel.update(id, req.body);
    if (!product) throw new AppError(404, 'Product not found');
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError(400, 'Invalid product ID');
    const deleted = await productModel.remove(id);
    if (!deleted) throw new AppError(404, 'Product not found');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
