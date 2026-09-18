/** Espelha com.crmapi.sistemacrm.model.enums.StatusEntrega */
export enum StatusEntrega {
  ENVIADA = 'ENVIADA',
  ENTREGUE = 'ENTREGUE',
  LIDA = 'LIDA',
  FALHA = 'FALHA'
}

export const STATUS_ENTREGA_ICONE: Readonly<Record<StatusEntrega, string>> = {
  [StatusEntrega.ENVIADA]: 'fas fa-check',
  [StatusEntrega.ENTREGUE]: 'fas fa-check-double',
  [StatusEntrega.LIDA]: 'fas fa-check-double text-info',
  [StatusEntrega.FALHA]: 'fas fa-triangle-exclamation text-danger'
};
