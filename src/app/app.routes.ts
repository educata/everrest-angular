import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('./features/home/home.component'),
  },
  {
    path: 'auth',
    title: 'Auth',
    loadComponent: () => import('./features/auth/auth.component'),
  },
  {
    path: 'products',
    title: 'Products',
    loadComponent: () => import('./features/products/products.component'),
  },
  {
    path: 'quote',
    title: 'Quote',
    loadComponent: () => import('./features/quote/quote.component'),
  },
  {
    path: 'qr',
    title: 'QR',
    loadComponent: () => import('./features/qr/qr.component'),
  },
  {
    path: '404',
    title: 'Not found',
    loadComponent: () => import('./features/notfound/notfound.component'),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404',
  },
];
