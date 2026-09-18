import { StatusFunil } from './enums/status-funil.enum';

/** Espelha ClienteResponseDTO */
export interface Cliente {
  id: number;
  nome: string;
  email: string | null;
  telefone: string;
  documento: string | null;
  empresa: string | null;
  observacoes: string | null;
  vendedorId: number;
  vendedorNome: string;
  statusFunil: StatusFunil;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string | null;
}

/** Espelha ClienteCreateDTO */
export interface ClienteCreate {
  nome: string;
  email?: string | null;
  telefone: string;
  documento?: string | null;
  empresa?: string | null;
  observacoes?: string | null;
  vendedorId: number;
  statusFunil?: StatusFunil;
}

/** Espelha ClienteUpdateDTO */
export interface ClienteUpdate {
  nome: string;
  email?: string | null;
  telefone: string;
  documento?: string | null;
  empresa?: string | null;
  observacoes?: string | null;
  vendedorId: number;
}

/** Espelha ClienteStatusFunilDTO */
export interface ClienteStatusFunil {
  statusFunil: StatusFunil;
}

/** Espelha ClienteReatribuirDTO */
export interface ClienteReatribuir {
  novoVendedorId: number;
  motivo?: string | null;
}

/** Filtros de GET /api/clientes */
export interface ClienteFiltro {
  busca?: string;
  status?: StatusFunil | null;
  vendedorId?: number | null;
  incluirInativos?: boolean;
}
