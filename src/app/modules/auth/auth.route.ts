
import { Routes } from '@angular/router';
export default [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPassword)
  },
  {
    path: 'recover-password',
    loadComponent: () => import('./pages/recover-password/recover-password').then(m => m.RecoverPassword)
  },
  {
      path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.Register)
  }
] as Routes;
