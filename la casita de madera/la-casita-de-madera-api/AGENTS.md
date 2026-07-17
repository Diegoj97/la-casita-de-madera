# 🐝 Backend Agent: la-casita-de-madera-api

## Context
You are a Node.js Backend Architect responsible for maintaining the RESTful API for the beekeeping blog "La Casita de Madera". This directory (`la-casita-de-madera-api`) contains all server logic and database connections. The project is **already initialized** using **Express 5** + **TypeScript** + **SQLite**.

## Tech Stack
- **Runtime:** Node.js (ESM, `"type": "module"`)
- **Framework:** Express 5
- **Database:** SQLite via `better-sqlite3` (file at `data/database.sqlite`)
- **Language:** TypeScript 5.9, compiled with `tsc`, run in dev via `tsx`

## Project Structure (already in place)

```
la-casita-de-madera-api/
├── package.json
├── tsconfig.json
├── .gitignore
└── src/
    ├── index.ts                  (Express entry — port 3000, CORS enabled)
    ├── db/
    │   ├── config.ts             (better-sqlite3 Database instance)
    │   ├── migrate.ts            (CLI: runs all files in migrations/)
    │   ├── seed.ts               (CLI: runs seed.sql)
    │   ├── migrations/
    │   │   ├── 001_create_blog_posts.sql
    │   │   ├── 002_create_site_settings.sql
    │   │   ├── 003_create_background_images.sql
    │   │   └── 004_seed_beekeeping_settings.sql
    │   ├── seed.sql              (sample blog posts)
    │   └── seed-backgrounds.ts   (CLI: seeds background images)
    ├── routes/
    │   ├── blogPosts.ts          (full REST router for posts)
    │   ├── siteSettings.ts       (REST router for settings)
    │   ├── backgrounds.ts        (REST router for background images)
    │   ├── uploads.ts            (image upload router)
    │   └── auth.ts               (auth router)
    ├── models/
    │   ├── blogPost.ts           (prepared statement query functions)
    │   ├── siteSetting.ts        (key/value settings)
    │   └── backgroundImage.ts    (background images)
    └── middleware/
        ├── validation.ts         (validateCreatePost, validateUpdatePost)
        ├── errorHandler.ts       (AppError class + global handler)
        └── auth.ts               (requireAuth middleware)
```

## Database — `blog_posts` Table (SQLite)

| Column       | Type         | Constraints                |
|-------------|-------------|----------------------------|
| `id`         | `INTEGER`    | `PRIMARY KEY AUTOINCREMENT`|
| `title`      | `TEXT`       | `NOT NULL`                 |
| `slug`       | `TEXT`       | `NOT NULL UNIQUE`          |
| `content`    | `TEXT`       | `NOT NULL`                 |
| `excerpt`    | `TEXT`       | nullable                   |
| `author`     | `TEXT`       | `NOT NULL`                 |
| `image_url`  | `TEXT`       | nullable                   |
| `tags`       | `TEXT`       | default `'[]'` (JSON array)|
| `published`  | `INTEGER`    | default `0` (boolean)      |
| `created_at` | `DATETIME`   | default `CURRENT_TIMESTAMP`|
| `updated_at` | `DATETIME`   | auto-updated               |

## API Endpoints (already implemented)

| Method   | Endpoint                 | Description                         |
|----------|--------------------------|-------------------------------------|
| `GET`    | `/api/blog-posts`        | List published posts (paginated)    |
| `GET`    | `/api/blog-posts/all`    | List all posts (admin)              |
| `GET`    | `/api/blog-posts/:id`    | Get single post by ID               |
| `GET`    | `/api/blog-posts/slug/:slug` | Get single post by slug         |
| `POST`   | `/api/blog-posts`        | Create a new post                   |
| `PUT`    | `/api/blog-posts/:id`    | Update an existing post             |
| `DELETE` | `/api/blog-posts/:id`    | Delete a post                       |
| `GET`    | `/health`                | Health check                        |

## CORS & Security (already configured)
- CORS enabled for all origins in `src/index.ts`
- Request body validation in `src/middleware/validation.ts`
- Parameterized SQL queries prevent injection (all in `src/models/blogPost.ts`)
- Error handling via `AppError` class (400/404/409/500)

## Available Scripts

```bash
npm run dev       # tsx watch src/index.ts
npm run build     # tsc
npm run start     # node dist/index.js
npm run migrate   # tsx src/db/migrate.ts
npm run seed      # tsx src/db/seed.ts
```

## When Adding a New Feature

1. Create the migration SQL in `src/db/migrations/`
2. Add query functions to the appropriate file in `src/models/`
3. Add route handlers in `src/routes/`
4. Wire the router in `src/index.ts`
5. Add validation in `src/middleware/validation.ts` if needed
