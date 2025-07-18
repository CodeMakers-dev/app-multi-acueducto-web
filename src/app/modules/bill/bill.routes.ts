import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/bill/bill').then(m => m.Bill)
  },
  // {
  //   path: 'update-bill/:id',
  //   loadComponent: () => import('./pages/update-bill/update-bill').then(m => m.UpdateBill),
  //    RenderMode: RenderMode.Prerender,
  // },
  {
    path: 'customer-debt',
    loadComponent: () => import('./pages/customer-debt/customer-debt').then(m => m.CustomerDebt)
  },
  {
    path: 'credit-customer',
    loadComponent: () => import('./pages/credit-customer/credit-customer').then(m => m.CreditCustomer)
  },
  {
    path: 'create-debt',
    loadComponent: () => import('./pages/create-debt/create-debt').then(m => m.CreateDebt)
  },
  {
    path: 'create-credit/:id',
    loadComponent: () => import('./pages/create-credit/create-credit').then(m => m.CreateCredit)
  },
<<<<<<< HEAD
] as Routes;
=======
  {
    path: 'update-debt/:id',
    loadComponent: () => import('./pages/update-debt/update-debt').then(m => m.UpdateDebt)
  },
] as Routes;
>>>>>>> 2e9665dd6b0419140d14d4045e1c4a2436ad7830
