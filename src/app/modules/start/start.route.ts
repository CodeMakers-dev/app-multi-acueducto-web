import { Routes } from '@angular/router';

export default [
  {
    path: 'start',
    loadComponent: () => import('./pages/start/start').then(m => m.Start)
  }
] as Routes;