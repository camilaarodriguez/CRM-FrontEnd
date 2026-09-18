/** Espelha com.crmapi.sistemacrm.exception.ErrorResponseDTO */
export interface ErrorResponse {
  timestamp: string;
  status: number;
  erro: string;
  mensagem: string;
  caminho: string;
  detalhes: string[];
}
