import { Routes } from '@angular/router';

export default [
  {
    path: '',
    redirectTo: 'inventory',
    pathMatch: 'full'
  },
  {
    path: 'inventory',
    loadComponent: () => import('./pages/inventory/inventory')
      .then(m => m.Inventory)
  }
] as Routes;
