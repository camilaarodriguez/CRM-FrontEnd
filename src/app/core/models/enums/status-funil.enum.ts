/** Espelha com.crmapi.sistemacrm.model.enums.StatusFunil */
export enum StatusFunil {
  NOVO = 'NOVO',
  EM_CONTATO = 'EM_CONTATO',
  NEGOCIACAO = 'NEGOCIACAO',
  FECHADO = 'FECHADO',
  PERDIDO = 'PERDIDO'
}

export interface StatusFunilMeta {
  readonly valor: StatusFunil;
  readonly rotulo: string;
  readonly classeBadge: string;
  readonly icone: string;
}

export const STATUS_FUNIL_META: Readonly<Record<StatusFunil, StatusFunilMeta>> = {
  [StatusFunil.NOVO]: {
    valor: StatusFunil.NOVO,
    rotulo: 'Novo',
    classeBadge: 'badge-secondary',
    icone: 'fas fa-star'
  },
  [StatusFunil.EM_CONTATO]: {
    valor: StatusFunil.EM_CONTATO,
    rotulo: 'Em contato',
    classeBadge: 'badge-info',
    icone: 'fas fa-comments'
  },
  [StatusFunil.NEGOCIACAO]: {
    valor: StatusFunil.NEGOCIACAO,
    rotulo: 'Negociação',
    classeBadge: 'badge-warning',
    icone: 'fas fa-handshake'
  },
  [StatusFunil.FECHADO]: {
    valor: StatusFunil.FECHADO,
    rotulo: 'Fechado',
    classeBadge: 'badge-success',
    icone: 'fas fa-circle-check'
  },
  [StatusFunil.PERDIDO]: {
    valor: StatusFunil.PERDIDO,
    rotulo: 'Perdido',
    classeBadge: 'badge-danger',
    icone: 'fas fa-circle-xmark'
  }
};

export const STATUS_FUNIL_OPCOES: readonly StatusFunilMeta[] = Object.values(STATUS_FUNIL_META);
