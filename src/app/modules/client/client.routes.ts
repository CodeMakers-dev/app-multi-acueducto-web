import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/client/client').then(m => m.Client)
  }
] as Routes;