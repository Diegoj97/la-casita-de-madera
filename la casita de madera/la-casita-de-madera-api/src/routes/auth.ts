import { Router } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está configurado. Define la variable de entorno JWT_SECRET.');
}

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
if (!ADMIN_USER || !ADMIN_PASS) {
  throw new Error('ADMIN_USER y ADMIN_PASS deben estar configurados como variables de entorno.');
}

// Limitar intentos de login para evitar fuerza bruta.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Inténtalo de nuevo más tarde.' },
});

router.post('/login', loginLimiter, (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new AppError(400, 'Credenciales inválidas');
    }
    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      throw new AppError(401, 'Credenciales incorrectas');
    }
    const token = jwt.sign({ role: 'admin', username: ADMIN_USER }, JWT_SECRET, {
      expiresIn: '2h',
    });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

export default router;