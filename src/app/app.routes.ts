import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Entrar · CRM',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
  },

  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [authGuard],
    // As rotas filhas de clientes, conversas e equipe entram aqui na parte 2.
    children: []
  },

  { path: '**', redirectTo: 'login' }
];
