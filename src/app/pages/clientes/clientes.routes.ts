import { Routes } from '@angular/router';

/** Rotas da área de clientes, carregadas sob demanda a partir da rota pai. */
export const CLIENTES_ROUTES: Routes = [
  {
    path: 'novo',
    title: 'Novo cliente',
    loadComponent: () =>
      import('./cliente-form/cliente-form.component').then((m) => m.ClienteFormComponent)
  },
  {
    path: 'editar/:id',
    title: 'Editar cliente',
    loadComponent: () =>
      import('./cliente-form/cliente-form.component').then((m) => m.ClienteFormComponent)
  }
];
