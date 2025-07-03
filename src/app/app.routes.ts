import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.route').then(m => m.default)
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.route').then(m => m.default)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
