import { StatusConversa } from './enums/status-conversa.enum';

/** Espelha ConversaResponseDTO */
export interface Conversa {
  id: number;
  clienteId: number;
  clienteNome: string;
  vendedorId: number | null;
  vendedorNome: string | null;
  status: StatusConversa;
  naoLidas: number;
  ultimaMensagemEm: string | null;
  janelaExpiraEm: string | null;
  criadoEm: string;
  atualizadoEm: string | null;
}

/** Filtros de GET /api/conversas */
export interface ConversaFiltro {
  vendedorId?: number | null;
}
