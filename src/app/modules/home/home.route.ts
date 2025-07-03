import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  }
] as Routes;
