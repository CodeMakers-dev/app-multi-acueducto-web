import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/client/client').then(m => m.Client)
  },
  {
    path: 'create-client',
    loadComponent: () => import('./pages/create-client/create-client').then(m => m.CreateClient)
  },
] as Routes;
