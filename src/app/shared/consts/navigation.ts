import { Navigation } from '@app-shared/interfaces';

export const NAVIGATIONS: Navigation[] = [
  {
    title: 'Home',
    path: '',
    auth: false,
    hideAfterAuth: false,
  },
  {
    title: 'Quote',
    path: 'quote',
    auth: false,
    hideAfterAuth: false,
  },
  {
    title: 'Auth',
    path: 'auth',
    auth: false,
    hideAfterAuth: true,
  },
  {
    title: 'Settings',
    path: 'settings',
    auth: true,
    hideAfterAuth: false,
  },
];
