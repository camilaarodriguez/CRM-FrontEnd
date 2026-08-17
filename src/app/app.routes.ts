import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Entrar · CRM Angular',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
  },

  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      // tudo aqui dentro é renderizado no outlet do MainLayout, já protegido pelo guard
      { path: '', redirectTo: 'clientes', pathMatch: 'full' },
      {
        path: 'clientes',
        loadChildren: () =>
          import('./pages/clientes/clientes.routes').then((m) => m.CLIENTES_ROUTES)
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
