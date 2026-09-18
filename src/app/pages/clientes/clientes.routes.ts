import { Routes } from '@angular/router';

/** Rotas filhas da área de clientes, carregadas sob demanda. */
export const CLIENTES_ROUTES: Routes = [
  {
    path: '',
    title: 'Clientes · CRM',
    loadComponent: () =>
      import('./cliente-list/cliente-list.component').then((m) => m.ClienteListComponent)
  },
  {
    path: 'novo',
    title: 'Novo cliente · CRM',
    loadComponent: () =>
      import('./cliente-form/cliente-form.component').then((m) => m.ClienteFormComponent)
  },
  {
    path: 'editar/:id',
    title: 'Editar cliente · CRM',
    loadComponent: () =>
      import('./cliente-form/cliente-form.component').then((m) => m.ClienteFormComponent)
  }
];
