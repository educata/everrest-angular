import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component'),
    title: 'Home',
  },
  {
    path: 'quote',
    loadComponent: () => import('./features/quote/quote.component'),
    title: 'Quote',
  },
  {
    path: '404',
    loadComponent: () => import('./features/notfound/notfound.component'),
    title: 'Not found',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404',
  },
];
