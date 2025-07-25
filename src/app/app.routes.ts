import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./expense/expense.component').then(m => m.ExpenseComponent),
    title: 'Expense List'
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Oops'
  }
];

