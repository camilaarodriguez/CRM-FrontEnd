import { Routes } from '@angular/router';
import { authGuard, visitanteGuard } from './core/guards/auth.guard';
import { distribuicaoGuard } from './core/guards/distribuicao.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Entrar · CRM',
    canActivate: [visitanteGuard],
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'cadastro',
    title: 'Criar conta · CRM',
    canActivate: [visitanteGuard],
    loadComponent: () => import('./pages/cadastro/cadastro.component').then((m) => m.CadastroComponent)
  },

  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'clientes' },
      {
        path: 'clientes',
        loadChildren: () => import('./pages/clientes/clientes.routes').then((m) => m.CLIENTES_ROUTES)
      },
      {
        path: 'conversas',
        loadChildren: () => import('./pages/conversas/conversas.routes').then((m) => m.CONVERSAS_ROUTES)
      },
      {
        path: 'equipe',
        canActivate: [distribuicaoGuard],
        loadChildren: () => import('./pages/usuarios/usuarios.routes').then((m) => m.USUARIOS_ROUTES)
      }
    ]
  },

  { path: '**', redirectTo: '' }
];
