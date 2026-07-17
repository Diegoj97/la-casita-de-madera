import { Router } from 'express';
import multer from 'multer';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileTypeFromBuffer } from 'file-type';
import { AppError } from '../middleware/errorHandler.js';
import { uploadImage, isConfigured } from '../services/cloudinary.js';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
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

router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError(400, 'No se ha enviado ninguna imagen');

    const buf = await readFile(req.file.path);
    const ft = await fileTypeFromBuffer(buf);
    if (!ft || !ALLOWED.has(ft.mime)) {
      throw new AppError(400, 'El contenido del archivo no es una imagen válida');
    }

    let url: string;
    if (isConfigured) {
      const cloudinaryUrl = await uploadImage(buf, req.file.originalname);
      url = cloudinaryUrl ?? `/uploads/${req.file.filename}`;
    } else {
      url = `/uploads/${req.file.filename}`;
    }

    res.status(201).json({ url });
  } catch (err) {
    next(err);
  }
});

export default router;
