import { query } from '../db/config.js';

export interface BackgroundImage {
  id: number;
  filename: string;
  url: string;
  label: string;
  created_at: Date;
}

export async function findAll(): Promise<BackgroundImage[]> {
  const { rows } = await query(`SELECT * FROM background_images ORDER BY id ASC`);
  return rows;
}

export async function bulkInsert(images: { filename: string; url: string; label: string }[]) {
  for (const img of images) {
    const { rows } = await query(
      `SELECT COUNT(*) as count FROM background_images WHERE filename = ?`,
      [img.filename],
    );
    const count = Number(rows[0].count);
    if (count > 0) continue;
    await query(
      `INSERT INTO background_images (filename, url, label) VALUES (?, ?, ?)`,
      [img.filename, img.url, img.label],
    );
  }
}

export async function create(image: { filename: string; url: string; label?: string }): Promise<BackgroundImage> {
  const { rows } = await query(
    `INSERT INTO background_images (filename, url, label) VALUES (?, ?, ?) RETURNING *`,
    [image.filename, image.url, image.label ?? ''],
  );
  return rows[0];
}

export async function remove(id: number): Promise<boolean> {
  const result = await query(`DELETE FROM background_images WHERE id = ?`, [id]);
  return (result.rowCount ?? 0) > 0;
}
