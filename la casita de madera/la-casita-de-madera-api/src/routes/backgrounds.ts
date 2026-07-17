import { Router } from 'express';
import multer from 'multer';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileTypeFromBuffer } from 'file-type';
import * as backgroundImageModel from '../models/backgroundImage.js';
import { AppError } from '../middleware/errorHandler.js';
import { requireAdmin } from '../middleware/auth.js';
import { uploadImage, isConfigured } from '../services/cloudinary.js';

const BACKGROUND_DIR = join(process.cwd(), 'backgrounds');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, BACKGROUND_DIR),
  filename: (_req, file, cb) => {
    const unique = `${randomUUID()}${extname(file.originalname).toLowerCase()}`;
    cb(null, unique);
  },
});

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      cb(new AppError(400, 'Solo se permiten imágenes (jpg, png, webp, gif)'));
      return;
    }
    cb(null, true);
  },
});

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const images = await backgroundImageModel.findAll();
    res.json(images);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError(400, 'No se ha enviado ninguna imagen');

    const buf = await readFile(req.file.path);
    const ft = await fileTypeFromBuffer(buf);
    if (!ft || !ALLOWED.has(ft.mime)) {
      throw new AppError(400, 'El contenido del archivo no es una imagen válida');
    }

    let url: string;
    let filename: string;

    if (isConfigured) {
      const cloudinaryUrl = await uploadImage(buf, req.file.originalname);
      url = cloudinaryUrl ?? `/backgrounds/${req.file.filename}`;
      filename = cloudinaryUrl ?? req.file.filename;
    } else {
      url = `/backgrounds/${req.file.filename}`;
      filename = req.file.filename;
    }

    const image = await backgroundImageModel.create({
      filename,
      url,
      label: req.file.originalname,
    });
    res.status(201).json(image);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError(400, 'Invalid background ID');
    const deleted = await backgroundImageModel.remove(id);
    if (!deleted) throw new AppError(404, 'Background image not found');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
