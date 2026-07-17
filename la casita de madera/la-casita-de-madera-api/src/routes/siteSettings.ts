import { Router } from 'express';
import * as siteSettingModel from '../models/siteSetting.js';
import { AppError } from '../middleware/errorHandler.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Lectura p�blica de todos los settings (la home los necesita sin auth)
router.get('/', async (_req, res, next) => {
  try {
    const all = await siteSettingModel.getAll();
    res.json(all);
  } catch (err) {
    next(err);
  }
});

router.get('/:key', async (req, res, next) => {
  try {
    const key = String(req.params.key);
    const value = await siteSettingModel.get(key);
    if (value === null) throw new AppError(404, 'Setting not found');
    res.json({ key, value });
  } catch (err) {
    next(err);
  }
});

// Escritura: solo admin
router.put('/:key', requireAdmin, async (req, res, next) => {
  try {
    const key = String(req.params.key);
    const { value } = req.body;
    if (typeof value !== 'string') {
      throw new AppError(400, 'value must be a string');
    }
    await siteSettingModel.set(key, value);
    res.json({ key, value });
  } catch (err) {
    next(err);
  }
});

export default router;