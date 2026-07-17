import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home-page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'blog',
    loadComponent: () =>
      import('./pages/blog-list/blog-list-page').then((m) => m.BlogListPage),
  },
  {
    path: 'blog/:slug',
    loadComponent: () =>
      import('./pages/blog-detail/blog-detail-page').then((m) => m.BlogDetailPage),
  },
  {
    path: 'admin/blog',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/blog-admin/blog-admin-page').then((m) => m.BlogAdminPage),
  },
  {
    path: 'producto/:slug',
    loadComponent: () =>
      import('./pages/product-detail/product-detail-page').then((m) => m.ProductDetailPage),
  },
  {
    path: 'quienes-somos',
    loadComponent: () =>
      import('./pages/about/about-page').then((m) => m.AboutPage),
  },
];