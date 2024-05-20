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
    loadChildren: () => [
      {
        path: 'id/:id',
        loadComponent: () =>
          import('./shared/ui/product-preview/product-preview.component'),
      },
    ],
  },
  {
    path: 'product/brand/:brand',
    title: 'Product by brands',
    loadComponent: () =>
      import('./features/product-brand/product-brand.component'),
  },
  {
    path: 'product/id/:id',
    title: 'Single product',
    loadComponent: () =>
      import('./shared/ui/product-preview/product-preview.component'),
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
