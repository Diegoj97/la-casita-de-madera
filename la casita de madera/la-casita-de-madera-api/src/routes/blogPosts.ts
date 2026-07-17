import { Router } from 'express';
import * as blogPostModel from '../models/blogPost.js';
import { AppError } from '../middleware/errorHandler.js';
import { requireAdmin } from '../middleware/auth.js';
import { validateCreatePost, validateUpdatePost } from '../middleware/validation.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const result = await blogPostModel.findAllPublished(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/all', async (_req, res, next) => {
  try {
    const posts = await blogPostModel.findAll();
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get('/slug/:slug', async (req, res, next) => {
  try {
    const post = await blogPostModel.findBySlug(req.params.slug);
    if (!post) throw new AppError(404, 'Blog post not found');
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError(400, 'Invalid post ID');
    const post = await blogPostModel.findById(id);
    if (!post) throw new AppError(404, 'Blog post not found');
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAdmin, validateCreatePost, async (req, res, next) => {
  try {
    const post = await blogPostModel.create(req.body);
    res.status(201).json(post);
  } catch (err: any) {
    if (err?.code === '23505') {
      next(new AppError(409, 'A post with this slug already exists'));
      return;
    }
    next(err);
  }
});

router.put('/:id', requireAdmin, validateUpdatePost, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError(400, 'Invalid post ID');
    const post = await blogPostModel.update(id, req.body);
    if (!post) throw new AppError(404, 'Blog post not found');
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError(400, 'Invalid post ID');
    const deleted = await blogPostModel.remove(id);
    if (!deleted) throw new AppError(404, 'Blog post not found');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
