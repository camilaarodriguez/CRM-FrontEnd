import { Routes } from '@angular/router';

/** Rotas filhas da central de conversas. */
export const CONVERSAS_ROUTES: Routes = [
  {
    path: '',
    title: 'Conversas · CRM',
    loadComponent: () =>
      import('./conversa-list/conversa-list.component').then((m) => m.ConversaListComponent)
  },
  {
    path: ':id',
    title: 'Atendimento · CRM',
    loadComponent: () =>
      import('./conversa-chat/conversa-chat.component').then((m) => m.ConversaChatComponent)
  }
];
