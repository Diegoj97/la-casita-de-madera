import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ...(process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true'
          ? { ssl: { rejectUnauthorized: false } }
          : {}),
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME || 'la_casita_de_madera',
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || '',
        ...(process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true'
          ? { ssl: { rejectUnauthorized: false } }
          : {}),
      },
);

export async function query(sql: string, params?: any[]) {
  let text = sql;
  const values: any[] = [];

  if (params && params.length > 0) {
    let idx = 0;
    text = sql.replace(/\?/g, () => {
      idx++;
      values.push(params[idx - 1]);
      return `$${idx}`;
    });
  }

  return pool.query(text, values.length > 0 ? values : undefined);
}

export default pool;
