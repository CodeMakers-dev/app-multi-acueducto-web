import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/bill/bill').then(m => m.Bill)
  },
  {
    path: 'update-bill/:id',
    loadComponent: () => import('./pages/update-bill/update-bill').then(m => m.UpdateBill)
  }

] as Routes;