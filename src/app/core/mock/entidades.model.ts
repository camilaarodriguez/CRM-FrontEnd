import { DirecaoMensagem } from '../models/enums/direcao-mensagem.enum';
import { StatusConversa } from '../models/enums/status-conversa.enum';
import { StatusEntrega } from '../models/enums/status-entrega.enum';
import { StatusFunil } from '../models/enums/status-funil.enum';
import { TipoMensagem } from '../models/enums/tipo-mensagem.enum';
import { UsuarioRole } from '../models/enums/usuario-role.enum';

/**
 * Registros internos do banco em memória, no mesmo formato das entidades JPA
 * do backend. As respostas da API são montadas a partir deles, como fazem os
 * mappers do lado Java.
 */
export interface UsuarioEntidade {
  id: number;
  nome: string;
  email: string;
  senha: string;
  role: UsuarioRole;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string | null;
}

export interface ClienteEntidade {
  id: number;
  nome: string;
  email: string | null;
  telefone: string;
  documento: string | null;
  empresa: string | null;
  observacoes: string | null;
  vendedorId: number;
  statusFunil: StatusFunil;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string | null;
}

export interface ConversaEntidade {
  id: number;
  clienteId: number;
  vendedorId: number | null;
  status: StatusConversa;
  naoLidas: number;
  ultimaMensagemEm: string | null;
  janelaExpiraEm: string | null;
  criadoEm: string;
  atualizadoEm: string | null;
}

export interface MensagemEntidade {
  id: number;
  conversaId: number;
  direcao: DirecaoMensagem;
  tipo: TipoMensagem;
  conteudo: string;
  waMessageId: string | null;
  statusEntrega: StatusEntrega | null;
  enviadaPorId: number | null;
  criadoEm: string;
}

export interface AtribuicaoLogEntidade {
  id: number;
  conversaId: number;
  deUsuarioId: number | null;
  paraUsuarioId: number;
  feitaPorId: number;
  motivo: string | null;
  criadoEm: string;
}
