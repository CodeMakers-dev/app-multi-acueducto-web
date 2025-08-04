
import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>   import('./pages/client-module/client').then(m => m.Client),
  },
  {
    path: 'create-client',
    loadComponent: () => import('./pages/create-client/create-client').then(m => m.CreateClient)
  },
  {
    path: 'update-client/:id',
    loadComponent: () => import('./pages/update-client/update-client').then(m => m.UpdateClient)
  },
] as Routes;
