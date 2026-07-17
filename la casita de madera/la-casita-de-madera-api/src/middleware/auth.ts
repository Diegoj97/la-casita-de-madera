import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está configurado. Define la variable de entorno JWT_SECRET.');
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.split(' ')[1];
  }
  return null;
}

// Permite lecturas públicas (GET) sin autenticación.
// Las rutas de escritura y las rutas admin se protegen con requireAdmin.
export const requireAuth = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};

// Exige un token JWT válido Y rol de administrador.
export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) {
    return next(new AppError(401, 'No autorizado'));
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { role?: string };
    if (payload.role !== 'admin') {
      return next(new AppError(403, 'Acceso prohibido'));
    }
    next();
  } catch {
    next(new AppError(401, 'Token inválido o expirado'));
  }
};