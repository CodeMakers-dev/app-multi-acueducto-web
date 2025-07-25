import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/counter/counter').then(m => m.Counter)
  },
  {
    path: 'actualizar-contador/:id',
    loadComponent: () => import('./pages/update-counter/update-counter').then(m => m.UpdateCounter)
  }
] as Routes;
