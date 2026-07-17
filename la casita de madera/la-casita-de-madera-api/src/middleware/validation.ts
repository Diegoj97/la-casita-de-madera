import type { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';

export function validateCreatePost(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { title, slug, content, author } = req.body;
  const errors: string[] = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('title is required and must be a non-empty string');
  }
  if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
    errors.push('slug is required and must be a non-empty string');
  }
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    errors.push('content is required and must be a non-empty string');
  }
  if (!author || typeof author !== 'string' || author.trim().length === 0) {
    errors.push('author is required and must be a non-empty string');
  }

  if (errors.length > 0) {
    next(new AppError(400, errors.join('; ')));
    return;
  }

  next();
}

export function validateUpdatePost(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const body = req.body;
  const errors: string[] = [];

  if (Object.keys(body).length === 0) {
    errors.push('request body must contain at least one field to update');
  }

  for (const field of ['title', 'slug', 'content', 'author', 'excerpt']) {
    if (body[field] !== undefined && (typeof body[field] !== 'string' || body[field].trim().length === 0)) {
      errors.push(`${field} must be a non-empty string`);
    }
  }

  if (body.tags !== undefined && !Array.isArray(body.tags)) {
    errors.push('tags must be an array of strings');
  }
  if (body.published !== undefined && typeof body.published !== 'boolean') {
    errors.push('published must be a boolean');
  }

  if (errors.length > 0) {
    next(new AppError(400, errors.join('; ')));
    return;
  }

  next();
}

export function validateCreateProduct(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { name, slug, description } = req.body;
  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('name is required and must be a non-empty string');
  }
  if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
    errors.push('slug is required and must be a non-empty string');
  }
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('description is required and must be a non-empty string');
  }

  if (errors.length > 0) {
    next(new AppError(400, errors.join('; ')));
    return;
  }

  next();
}

export function validateUpdateProduct(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const body = req.body;
  const errors: string[] = [];

  if (Object.keys(body).length === 0) {
    errors.push('request body must contain at least one field to update');
  }

  for (const field of ['name', 'slug', 'description', 'excerpt']) {
    if (body[field] !== undefined && (typeof body[field] !== 'string' || body[field].trim().length === 0)) {
      errors.push(`${field} must be a non-empty string`);
    }
  }

  if (body.tags !== undefined && !Array.isArray(body.tags)) {
    errors.push('tags must be an array of strings');
  }
  if (body.price !== undefined && typeof body.price !== 'number') {
    errors.push('price must be a number');
  }
  if (body.available !== undefined && typeof body.available !== 'boolean') {
    errors.push('available must be a boolean');
  }

  if (errors.length > 0) {
    next(new AppError(400, errors.join('; ')));
    return;
  }

  next();
}
