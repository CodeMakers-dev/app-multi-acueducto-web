import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/employee/employee').then(m => m.Employee)
  },
 {
    path: 'create-employee',
    loadComponent: () => import('./pages/create-employee/create-employee').then(m => m.CreateEmployee)
  },

] as Routes;