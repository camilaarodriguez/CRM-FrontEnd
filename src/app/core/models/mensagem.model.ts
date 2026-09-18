import { DirecaoMensagem } from './enums/direcao-mensagem.enum';
import { StatusEntrega } from './enums/status-entrega.enum';
import { TipoMensagem } from './enums/tipo-mensagem.enum';

/** Espelha MensagemResponseDTO */
export interface Mensagem {
  id: number;
  conversaId: number;
  direcao: DirecaoMensagem;
  tipo: TipoMensagem;
  conteudo: string;
  waMessageId: string | null;
  statusEntrega: StatusEntrega | null;
  enviadaPorId: number | null;
  enviadaPorNome: string | null;
  criadoEm: string;
}

/** Espelha MensagemCreateDTO */
export interface MensagemCreate {
  conversaId: number;
  tipo: TipoMensagem;
  conteudo: string;
}
