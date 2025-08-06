
import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/enterprise/enterprise').then(m => m.Enterprise),
  },
  {
    path: 'update-enterprise/:id',
    loadComponent: () => import('./pages/update-enterprise/update-enterprise').then(m => m.UpdateEnterprise)
  },
] as Routes;