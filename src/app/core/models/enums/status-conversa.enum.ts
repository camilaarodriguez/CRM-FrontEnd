/** Espelha com.crmapi.sistemacrm.model.enums.StatusConversa */
export enum StatusConversa {
  ABERTA = 'ABERTA',
  EM_ATENDIMENTO = 'EM_ATENDIMENTO',
  FECHADA = 'FECHADA'
}

export interface StatusConversaMeta {
  readonly valor: StatusConversa;
  readonly rotulo: string;
  readonly classeBadge: string;
}

export const STATUS_CONVERSA_META: Readonly<Record<StatusConversa, StatusConversaMeta>> = {
  [StatusConversa.ABERTA]: { valor: StatusConversa.ABERTA, rotulo: 'Aberta', classeBadge: 'badge-success' },
  [StatusConversa.EM_ATENDIMENTO]: {
    valor: StatusConversa.EM_ATENDIMENTO,
    rotulo: 'Em atendimento',
    classeBadge: 'badge-warning'
  },
  [StatusConversa.FECHADA]: {
    valor: StatusConversa.FECHADA,
    rotulo: 'Fechada',
    classeBadge: 'badge-secondary'
  }
};

export const STATUS_CONVERSA_OPCOES: readonly StatusConversaMeta[] = Object.values(STATUS_CONVERSA_META);
