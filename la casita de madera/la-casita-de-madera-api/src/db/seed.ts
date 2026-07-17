import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  const seedPath = path.join(__dirname, 'seed.sql');
  const sql = fs.readFileSync(seedPath, 'utf-8');
  console.log('Running seed...');
  await pool.query(sql);
  console.log('Seed completed.');
  await pool.end();
}

seed();
