import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Entrar · CRM Angular',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
  },

  { path: '**', redirectTo: 'login' }
];
