import { query } from '../db/config.js';

export async function get(key: string): Promise<string | null> {
  const { rows } = await query(`SELECT value FROM site_settings WHERE key = ?`, [key]);
  return rows.length ? rows[0].value : null;
}

export async function getAll(): Promise<Record<string, string>> {
  const { rows } = await query(`SELECT key, value FROM site_settings`);
  const result: Record<string, string> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return result;
}

export async function set(key: string, value: string): Promise<void> {
  await query(
    `INSERT INTO site_settings (key, value, updated_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT (key)
     DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
    [key, value],
  );
}
