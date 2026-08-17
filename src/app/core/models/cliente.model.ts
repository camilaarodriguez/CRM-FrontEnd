import { StatusFunil } from './status-funil.enum';

/** Espelha o ClienteResponseDTO da API. */
export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  vendedorId: number;
  vendedorNome: string;
  statusFunil: StatusFunil;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

/**
 * Espelha o ClienteCreateDTO: o vínculo com o vendedor é enviado por id, e
 * vendedorNome, ativo e as datas são resolvidos do outro lado.
 */
export type NovoCliente = Omit<
  Cliente,
  'id' | 'vendedorNome' | 'ativo' | 'criadoEm' | 'atualizadoEm'
>;
