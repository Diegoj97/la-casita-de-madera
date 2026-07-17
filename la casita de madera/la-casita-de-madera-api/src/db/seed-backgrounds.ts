import { bulkInsert } from '../models/backgroundImage.js';
import pool from './config.js';

const BACKGROUNDS = [
  { filename: 'bg-1.jpg', url: 'https://res.cloudinary.com/llj5v8cv/image/upload/v1784298972/la-casita-de-madera/backgrounds/bg-1.jpg', label: 'Campo 1' },
  { filename: 'bg-2.jpg', url: 'https://res.cloudinary.com/llj5v8cv/image/upload/v1784298973/la-casita-de-madera/backgrounds/bg-2.jpg', label: 'Campo 2' },
  { filename: 'bg-3.jpg', url: 'https://res.cloudinary.com/llj5v8cv/image/upload/v1784298974/la-casita-de-madera/backgrounds/bg-3.jpg', label: 'Campo 3' },
  { filename: 'bg-4.jpg', url: 'https://res.cloudinary.com/llj5v8cv/image/upload/v1784298974/la-casita-de-madera/backgrounds/bg-4.jpg', label: 'Campo 4' },
  { filename: 'bg-5.jpg', url: 'https://res.cloudinary.com/llj5v8cv/image/upload/v1784298975/la-casita-de-madera/backgrounds/bg-5.jpg', label: 'Campo 5' },
  { filename: 'bg-6.jpg', url: 'https://res.cloudinary.com/llj5v8cv/image/upload/v1784298976/la-casita-de-madera/backgrounds/bg-6.jpg', label: 'Campo 6' },
];

async function seed() {
  console.log('Seeding background images...');
  await bulkInsert(BACKGROUNDS);
  console.log('Background images seeded.');
  await pool.end();
}

seed();
