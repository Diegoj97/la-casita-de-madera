import { query } from '../db/config.js';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  excerpt: string | null;
  price: number | null;
  image_url: string | null;
  images: string[];
  tags: string[];
  available: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description: string;
  excerpt?: string;
  price?: number;
  image_url?: string;
  images?: string[];
  tags?: string[];
  available?: boolean;
}

export interface UpdateProductInput {
  name?: string;
  slug?: string;
  description?: string;
  excerpt?: string;
  price?: number;
  image_url?: string;
  images?: string[];
  tags?: string[];
  available?: boolean;
}

const ALLOWED_COLUMNS = new Set([
  'name', 'slug', 'description', 'excerpt', 'price', 'image_url', 'images', 'tags', 'available',
]);

function mapRow(row: any): Product {
  return {
    ...row,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
    images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images ?? [],
    available: Boolean(row.available),
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  };
}

export async function findAllAvailable() {
  const { rows } = await query(`SELECT * FROM products WHERE available = 1 ORDER BY created_at DESC`);
  return rows.map(mapRow);
}

export async function findAll() {
  const { rows } = await query(`SELECT * FROM products ORDER BY created_at DESC`);
  return rows.map(mapRow);
}

export async function findById(id: number) {
  const { rows } = await query(`SELECT * FROM products WHERE id = ?`, [id]);
  return rows.length ? mapRow(rows[0]) : null;
}

export async function findBySlug(slug: string) {
  const { rows } = await query(`SELECT * FROM products WHERE slug = ?`, [slug]);
  return rows.length ? mapRow(rows[0]) : null;
}

export async function create(input: CreateProductInput) {
  const tagsStr = JSON.stringify(input.tags ?? []);
  const imagesStr = JSON.stringify(input.images ?? []);
  const availableInt = input.available === false ? 0 : 1;
  const imageUrl = input.image_url ?? (input.images?.[0] ?? null);

  const { rows } = await query(
    `INSERT INTO products (name, slug, description, excerpt, price, image_url, images, tags, available)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING *`,
    [
      input.name,
      input.slug,
      input.description,
      input.excerpt ?? null,
      input.price ?? null,
      imageUrl,
      imagesStr,
      tagsStr,
      availableInt,
    ],
  );

  return mapRow(rows[0]);
}

export async function update(id: number, input: UpdateProductInput) {
  const fields: string[] = [];
  const values: any[] = [];

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue;
    if (!ALLOWED_COLUMNS.has(key)) {
      throw new Error(`Columna no permitida: ${key}`);
    }
    fields.push(`${key} = ?`);
    if (key === 'tags' || key === 'images') {
      values.push(JSON.stringify(value));
    } else if (key === 'available') {
      values.push(value ? 1 : 0);
    } else {
      values.push(value);
    }
  }

  if (input.images !== undefined && !fields.some((f) => f.startsWith('image_url'))) {
    fields.push(`image_url = ?`);
    values.push(input.images?.[0] ?? null);
  }

  if (fields.length === 0) return findById(id);

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const { rows } = await query(
    `UPDATE products SET ${fields.join(', ')} WHERE id = ? RETURNING *`,
    values,
  );

  return rows.length ? mapRow(rows[0]) : null;
}

export async function remove(id: number) {
  const result = await query(`DELETE FROM products WHERE id = ?`, [id]);
  return (result.rowCount ?? 0) > 0;
}
