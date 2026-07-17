import { query } from '../db/config.js';
import { sanitizeContent } from '../utils/sanitize.js';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author: string;
  image_url: string | null;
  tags: string[];
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBlogPostInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  image_url?: string;
  tags?: string[];
  published?: boolean;
}

export interface UpdateBlogPostInput {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  author?: string;
  image_url?: string;
  tags?: string[];
  published?: boolean;
}

const ALLOWED_COLUMNS = new Set([
  'title', 'slug', 'content', 'excerpt', 'author', 'image_url', 'tags', 'published',
]);

function mapRow(row: any): BlogPost {
  return {
    ...row,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
    published: Boolean(row.published),
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  };
}

export async function findAllPublished(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const { rows } = await query(
    `SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset],
  );
  const { rows: countRows } = await query(
    `SELECT COUNT(*) as count FROM blog_posts WHERE published = 1`,
  );

  return {
    posts: rows.map(mapRow),
    total: Number(countRows[0].count),
    page,
    limit,
    totalPages: Math.ceil(Number(countRows[0].count) / limit),
  };
}

export async function findAll() {
  const { rows } = await query(`SELECT * FROM blog_posts ORDER BY created_at DESC`);
  return rows.map(mapRow);
}

export async function findById(id: number) {
  const { rows } = await query(`SELECT * FROM blog_posts WHERE id = ?`, [id]);
  return rows.length ? mapRow(rows[0]) : null;
}

export async function findBySlug(slug: string) {
  const { rows } = await query(`SELECT * FROM blog_posts WHERE slug = ?`, [slug]);
  return rows.length ? mapRow(rows[0]) : null;
}

export async function create(input: CreateBlogPostInput) {
  const tagsStr = JSON.stringify(input.tags ?? []);
  const publishedInt = input.published ? 1 : 0;
  const safeContent = sanitizeContent(input.content);

  const { rows } = await query(
    `INSERT INTO blog_posts (title, slug, content, excerpt, author, image_url, tags, published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING *`,
    [
      input.title,
      input.slug,
      safeContent,
      input.excerpt ?? null,
      input.author,
      input.image_url ?? null,
      tagsStr,
      publishedInt,
    ],
  );

  return mapRow(rows[0]);
}

export async function update(id: number, input: UpdateBlogPostInput) {
  const fields: string[] = [];
  const values: any[] = [];

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue;
    if (!ALLOWED_COLUMNS.has(key)) {
      throw new Error(`Columna no permitida: ${key}`);
    }
    fields.push(`${key} = ?`);
    if (key === 'tags') {
      values.push(JSON.stringify(value));
    } else if (key === 'content') {
      values.push(sanitizeContent(value as string));
    } else if (key === 'published') {
      values.push(value ? 1 : 0);
    } else {
      values.push(value);
    }
  }

  if (fields.length === 0) return findById(id);

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const { rows } = await query(
    `UPDATE blog_posts SET ${fields.join(', ')} WHERE id = ? RETURNING *`,
    values,
  );

  return rows.length ? mapRow(rows[0]) : null;
}

export async function remove(id: number) {
  const result = await query(`DELETE FROM blog_posts WHERE id = ?`, [id]);
  return (result.rowCount ?? 0) > 0;
}
