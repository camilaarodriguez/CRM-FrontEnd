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
}

/** Rótulo e cor do badge MDB de cada etapa do funil. */
export const STATUS_FUNIL_META: Readonly<Record<StatusFunil, StatusFunilMeta>> = {
  [StatusFunil.NOVO]: { valor: StatusFunil.NOVO, rotulo: 'Novo', classeBadge: 'bg-secondary' },
  [StatusFunil.EM_CONTATO]: {
    valor: StatusFunil.EM_CONTATO,
    rotulo: 'Em contato',
    classeBadge: 'bg-info'
  },
  [StatusFunil.NEGOCIACAO]: {
    valor: StatusFunil.NEGOCIACAO,
    rotulo: 'Negociação',
    classeBadge: 'bg-warning'
  },
  [StatusFunil.FECHADO]: { valor: StatusFunil.FECHADO, rotulo: 'Fechado', classeBadge: 'bg-success' },
  [StatusFunil.PERDIDO]: { valor: StatusFunil.PERDIDO, rotulo: 'Perdido', classeBadge: 'bg-danger' }
};

export const STATUS_FUNIL_OPCOES: readonly StatusFunilMeta[] = Object.values(STATUS_FUNIL_META);
