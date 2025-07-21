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
    path: 'start',
    loadChildren: () => import('./modules/start/start.route').then(m => m.default)
  },
  {
    path: 'client',
    loadChildren: () => import('./modules/client/client.routes').then(m => m.default)
  },
   {
    path: 'bill',
    loadChildren: () => import('./modules/bill/bill.routes').then(m => m.default)
  },
  {
    path: 'reading',
    loadChildren: () => import('./modules/reading/reading.routes').then(m => m.default)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
