# 🍯 Frontend Agent: la-casita-de-madera-app

## Context
You are an Expert Frontend Engineer responsible for maintaining the interface of the beekeeping blog "La Casita de Madera" inside the `la-casita-de-madera-app` directory. The project is **already initialized** using **Angular 21** standalone with **Tailwind CSS**, **SSR**, and **Vitest**.

## Tech Stack
- **Framework:** Angular 21 (standalone, no NgModules)
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS 4
- **Testing:** Vitest + JSDOM
- **SSR:** Angular SSR with Express

## Architectural Requirements (already in place)
1. **Angular 21:** Latest framework features (signals, control flow, `@defer`).
2. **Standalone Components:** All components use `imports` array — no NgModules.
3. **APP_VIEW Hierarchy:** Strict type-based folder structure under `src/app/`:
   - `models/` — TypeScript interfaces
   - `services/` — Injectable services
   - `components/` — Reusable (dumb) components
   - `pages/` — Routed page components
   - `shared/` — Pipes, directives, utilities
4. **Reactivity:** Signals for local state, RxJS for async flows + HTTP.
5. **API Integration:** `provideHttpClient(withFetch())` in `app.config.ts`.
6. **Lazy Loading:** All page routes lazy-loaded via `loadComponent`.

## Project Structure (already in place)

```
src/app/
├── app.ts                          (root component — just <router-outlet />)
├── app.html                        (empty template with <router-outlet />)
├── app.css                         (global styles)
├── app.config.ts                   (providers: router, HTTP, SSR)
├── app.routes.ts                   (routes: /blog, /blog/:slug, /admin/blog)
├── app.routes.server.ts            (SSR: all routes RenderMode.Server)
├── models/
│   └── blog-post.model.ts          (BlogPost, PaginatedResponse, CreateBlogPost, UpdateBlogPost)
├── services/
│   └── blog-post.service.ts        (signals + HttpClient CRUD)
├── components/
│   ├── blog-card/
│   │   ├── blog-card.ts            (input signal, RouterLink)
│   │   └── blog-card.html          (card with tags, excerpt, date)
│   └── blog-form/
│       ├── blog-form.ts            (ReactiveFormsModule, input/output signals)
│       └── blog-form.html          (form: title, slug, content, excerpt, author, image, tags, published)
├── pages/
│   ├── blog-list/
│   │   ├── blog-list-page.ts       (paginated list, signal state)
│   │   └── blog-list-page.html     (grid of cards + pagination nav)
│   ├── blog-detail/
│   │   ├── blog-detail-page.ts     (slug param, RxJS switchMap)
│   │   └── blog-detail-page.html   (full article + tags + dateFormat pipe)
│   └── blog-admin/
│       ├── blog-admin-page.ts      (CRUD dashboard, create/edit/delete)
│       └── blog-admin-page.html    (post list + inline form)
└── shared/
    └── pipes/
        └── date-format.pipe.ts     (es-ES locale date pipe)
```

## Routes (already in place)

| Path            | Component        | Loaded        |
|-----------------|------------------|---------------|
| `/`             | redirect → /blog | —             |
| `/blog`         | BlogListPage     | Lazy          |
| `/blog/:slug`   | BlogDetailPage   | Lazy          |
| `/admin/blog`   | BlogAdminPage    | Lazy          |

## Key Dependencies (already installed)

| Package | Purpose |
|---------|---------|
| `@angular/common` | DatePipe, NgClass, etc. |
| `@angular/forms` | ReactiveFormsModule |
| `@angular/router` | RouterOutlet, RouterLink |
| `@angular/common/http` | HttpClient |
| `tailwindcss` | Utility-first CSS |
| `vitest` | Unit testing |

## Available Scripts

```bash
npm start        # ng serve (proxy /api → localhost:3000)
npm run build    # ng build (SSR output)
npm test         # ng test (Vitest)
```

## When Adding a New Feature

1. Define/interfaces models in `src/app/models/`
2. Add service methods in `src/app/services/` using signals + HttpClient
3. Create reusable components in `src/app/components/` (input/output signals)
4. Create page components in `src/app/pages/` (lazy-loaded)
5. Register routes in `src/app/app.routes.ts`
6. Style with Tailwind utility classes
7. Always run `npm run build` to verify no errors
