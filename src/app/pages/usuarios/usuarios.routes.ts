import { Routes } from '@angular/router';

/** Rotas filhas da gestão de equipe. */
export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    title: 'Equipe · CRM',
    loadComponent: () =>
      import('./usuario-list/usuario-list.component').then((m) => m.UsuarioListComponent)
  }
];
