import './env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import blogPostsRouter from './routes/blogPosts.js';
import productsRouter from './routes/products.js';
import siteSettingsRouter from './routes/siteSettings.js';
import uploadsRouter from './routes/uploads.js';
import backgroundsRouter from './routes/backgrounds.js';
import authRouter from './routes/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requireAdmin } from './middleware/auth.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Orígenes permitidos (CORS y CSP)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:4200')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// Cabeceras de seguridad (CSP permite imgs del frontend y del propio API)
const cspOrigins = allowedOrigins.concat([`http://localhost:${PORT}`, `https://localhost:${PORT}`]);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", ...cspOrigins],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
      },
    },
  }),
)


app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origen no permitido por CORS'));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: '2mb' }));

const UPLOAD_DIR = join(process.cwd(), 'uploads');
if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));

const BACKGROUND_DIR = join(process.cwd(), 'backgrounds');
if (!existsSync(BACKGROUND_DIR)) mkdirSync(BACKGROUND_DIR, { recursive: true });
app.use('/backgrounds', express.static(BACKGROUND_DIR));

app.use('/api/auth', authRouter);

// Lectura pública (GET) sin autenticación.
app.use('/api/blog-posts', blogPostsRouter);
app.use('/api/products', productsRouter);

// Escritura y configuración: solo admin.
app.use('/api/settings', siteSettingsRouter);
// Las escrituras en settings requieren admin (aplicado por ruta en siteSettings.ts)
app.use('/api/uploads', requireAdmin, uploadsRouter);
app.use('/api/backgrounds', backgroundsRouter);


app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
