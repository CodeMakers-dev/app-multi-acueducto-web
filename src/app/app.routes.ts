import { Routes } from '@angular/router';
import { AppShellComponent } from '@components/Shell';

export const routes: Routes = [
   {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      {
        path: 'home',
        loadComponent: () => import('./modules/home/pages/home/home')
          .then(m => m.Home),
      },
      {
        path: 'client',
        loadChildren: () => import('./modules/client/client.routes')
          .then(m => m.default),
      },
      {
        path: 'start',
        loadChildren: () => import('./modules/start/start.route')
          .then(m => m.default),
      },
      {
        path: 'bill',
        loadChildren: () => import('./modules/bill/bill.routes')
          .then(m => m.default),
      },
      {
        path: 'reading',
        loadChildren: () => import('./modules/reading/reading.routes')
          .then(m => m.default),
      },
      {
        path: 'employee',
        loadChildren: () => import('./modules/employee/employee.routes')
          .then(m => m.default),
      },
    ],
  },

  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.route')
      .then(m => m.default),
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' }
];