import { DirecaoMensagem } from '../models/enums/direcao-mensagem.enum';
import { StatusConversa } from '../models/enums/status-conversa.enum';
import { StatusEntrega } from '../models/enums/status-entrega.enum';
import { StatusFunil } from '../models/enums/status-funil.enum';
import { TipoMensagem } from '../models/enums/tipo-mensagem.enum';
import { UsuarioRole } from '../models/enums/usuario-role.enum';
import {
  AtribuicaoLogEntidade,
  ClienteEntidade,
  ConversaEntidade,
  MensagemEntidade,
  UsuarioEntidade
} from './entidades.model';

function diasAtras(dias: number, hora = 9): string {
  const data = new Date();
  data.setDate(data.getDate() - dias);
  data.setHours(hora, 0, 0, 0);
  return data.toISOString();
}

function horasAtras(horas: number): string {
  const data = new Date();
  data.setHours(data.getHours() - horas, 0, 0, 0);
  return data.toISOString();
}

export const USUARIOS_INICIAIS: UsuarioEntidade[] = [
  {
    id: 1,
    nome: 'Administrador',
    email: 'admin@crm.com',
    senha: '123456',
    role: UsuarioRole.ADMIN,
    ativo: true,
    criadoEm: diasAtras(180),
    atualizadoEm: diasAtras(180)
  },
  {
    id: 2,
    nome: 'Marcos Vinicius Teixeira',
    email: 'marcos.teixeira@crm.com',
    senha: '123456',
    role: UsuarioRole.GERENTE,
    ativo: true,
    criadoEm: diasAtras(150),
    atualizadoEm: diasAtras(40)
  },
  {
    id: 3,
    nome: 'Ana Beatriz Moraes',
    email: 'ana.moraes@crm.com',
    senha: '123456',
    role: UsuarioRole.VENDEDOR,
    ativo: true,
    criadoEm: diasAtras(120),
    atualizadoEm: diasAtras(30)
  },
  {
    id: 4,
    nome: 'Carlos Eduardo Lima',
    email: 'carlos.lima@crm.com',
    senha: '123456',
    role: UsuarioRole.VENDEDOR,
    ativo: true,
    criadoEm: diasAtras(110),
    atualizadoEm: diasAtras(25)
  },
  {
    id: 5,
    nome: 'Fernanda Ribeiro',
    email: 'fernanda.ribeiro@crm.com',
    senha: '123456',
    role: UsuarioRole.VENDEDOR,
    ativo: true,
    criadoEm: diasAtras(90),
    atualizadoEm: diasAtras(10)
  },
  {
    id: 6,
    nome: 'Rodrigo Salles Antunes',
    email: 'rodrigo.antunes@crm.com',
    senha: '123456',
    role: UsuarioRole.VENDEDOR,
    ativo: false,
    criadoEm: diasAtras(200),
    atualizadoEm: diasAtras(60)
  }
];

export const CLIENTES_INICIAIS: ClienteEntidade[] = [
  {
    id: 1,
    nome: 'Mariana Alves Souza',
    email: 'mariana.souza@techdominio.com.br',
    telefone: '(11) 98877-6543',
    documento: '412.559.870-11',
    empresa: 'Tech Dominio Ltda',
    observacoes: 'Chegou pelo anuncio do Instagram. Pediu proposta para 12 licencas.',
    vendedorId: 3,
    statusFunil: StatusFunil.NOVO,
    ativo: true,
    criadoEm: diasAtras(12),
    atualizadoEm: diasAtras(12)
  },
  {
    id: 2,
    nome: 'Rafael Nogueira Lima',
    email: 'rafael.lima@vetorlog.com',
    telefone: '(21) 99654-1200',
    documento: '22.145.908/0001-73',
    empresa: 'Vetor Logistica',
    observacoes: 'Responsavel pela frota. Prefere contato no periodo da tarde.',
    vendedorId: 4,
    statusFunil: StatusFunil.EM_CONTATO,
    ativo: true,
    criadoEm: diasAtras(25),
    atualizadoEm: diasAtras(3)
  },
  {
    id: 3,
    nome: 'Juliana Prado Bittencourt',
    email: 'juliana.prado@casamineira.com.br',
    telefone: '(31) 98432-7788',
    documento: '18.720.455/0001-09',
    empresa: 'Casa Mineira Alimentos',
    observacoes: 'Negociacao em andamento: desconto de 8% aprovado pelo gerente.',
    vendedorId: 5,
    statusFunil: StatusFunil.NEGOCIACAO,
    ativo: true,
    criadoEm: diasAtras(40),
    atualizadoEm: diasAtras(1)
  },
  {
    id: 4,
    nome: 'Eduardo Tavares Ramos',
    email: 'eduardo.ramos@sulconstrutora.com.br',
    telefone: '(41) 99123-4567',
    documento: '09.882.140/0001-55',
    empresa: 'Sul Construtora',
    observacoes: 'Contrato assinado em reuniao presencial. Renovacao anual.',
    vendedorId: 3,
    statusFunil: StatusFunil.FECHADO,
    ativo: true,
    criadoEm: diasAtras(60),
    atualizadoEm: diasAtras(6)
  },
  {
    id: 5,
    nome: 'Patricia Gomes Ferreira',
    email: 'patricia.ferreira@clinicavida.com.br',
    telefone: '(51) 98765-0099',
    documento: '31.004.778/0001-20',
    empresa: 'Clinica Vida Plena',
    observacoes: 'Optou por um concorrente por causa do prazo de implantacao.',
    vendedorId: 4,
    statusFunil: StatusFunil.PERDIDO,
    ativo: false,
    criadoEm: diasAtras(75),
    atualizadoEm: diasAtras(20)
  },
  {
    id: 6,
    nome: 'Bruno Carvalho Martins',
    email: 'bruno.martins@ilhadigital.com',
    telefone: '(48) 99880-2211',
    documento: '27.551.903/0001-64',
    empresa: 'Ilha Digital Marketing',
    observacoes: 'Pediu para retomar o contato depois do fechamento do trimestre.',
    vendedorId: 5,
    statusFunil: StatusFunil.EM_CONTATO,
    ativo: true,
    criadoEm: diasAtras(18),
    atualizadoEm: diasAtras(2)
  },
  {
    id: 7,
    nome: 'Camila Rodrigues Pinto',
    email: 'camila.pinto@agrocentral.com.br',
    telefone: '(62) 98111-3344',
    documento: '40.218.665/0001-31',
    empresa: 'Agro Central Sementes',
    observacoes: 'Proposta enviada. Aguardando retorno do setor de compras.',
    vendedorId: 3,
    statusFunil: StatusFunil.NEGOCIACAO,
    ativo: true,
    criadoEm: diasAtras(30),
    atualizadoEm: horasAtras(20)
  },
  {
    id: 8,
    nome: 'Thiago Mendes Barbosa',
    email: 'thiago.barbosa@barbosafilhos.com.br',
    telefone: '(85) 99444-8877',
    documento: '13.905.220/0001-48',
    empresa: 'Barbosa e Filhos Comercio',
    observacoes: 'Primeiro contato feito pelo canal de mensagens da empresa.',
    vendedorId: 4,
    statusFunil: StatusFunil.NOVO,
    ativo: true,
    criadoEm: diasAtras(5),
    atualizadoEm: diasAtras(5)
  },
  {
    id: 9,
    nome: 'Leticia Aparecida Nunes',
    email: 'leticia.nunes@moveisaurora.com.br',
    telefone: '(47) 99233-1180',
    documento: '35.772.014/0001-92',
    empresa: 'Moveis Aurora',
    observacoes: 'Indicacao da Sul Construtora. Quer integracao com o ERP atual.',
    vendedorId: 5,
    statusFunil: StatusFunil.EM_CONTATO,
    ativo: true,
    criadoEm: diasAtras(9),
    atualizadoEm: horasAtras(30)
  },
  {
    id: 10,
    nome: 'Gustavo Henrique Peixoto',
    email: 'gustavo.peixoto@rotanorte.com.br',
    telefone: '(92) 98120-4455',
    documento: '51.339.807/0001-16',
    empresa: 'Rota Norte Transportes',
    observacoes: 'Lead novo, ainda sem primeiro contato registrado.',
    vendedorId: 3,
    statusFunil: StatusFunil.NOVO,
    ativo: true,
    criadoEm: diasAtras(2),
    atualizadoEm: diasAtras(2)
  }
];

export const CONVERSAS_INICIAIS: ConversaEntidade[] = [
  {
    id: 1,
    clienteId: 1,
    vendedorId: 3,
    status: StatusConversa.ABERTA,
    naoLidas: 2,
    ultimaMensagemEm: horasAtras(1),
    janelaExpiraEm: null,
    criadoEm: diasAtras(12),
    atualizadoEm: horasAtras(1)
  },
  {
    id: 2,
    clienteId: 2,
    vendedorId: 4,
    status: StatusConversa.EM_ATENDIMENTO,
    naoLidas: 0,
    ultimaMensagemEm: horasAtras(5),
    janelaExpiraEm: null,
    criadoEm: diasAtras(25),
    atualizadoEm: horasAtras(5)
  },
  {
    id: 3,
    clienteId: 3,
    vendedorId: 5,
    status: StatusConversa.EM_ATENDIMENTO,
    naoLidas: 1,
    ultimaMensagemEm: horasAtras(3),
    janelaExpiraEm: null,
    criadoEm: diasAtras(40),
    atualizadoEm: horasAtras(3)
  },
  {
    id: 4,
    clienteId: 4,
    vendedorId: 3,
    status: StatusConversa.FECHADA,
    naoLidas: 0,
    ultimaMensagemEm: diasAtras(6, 16),
    janelaExpiraEm: null,
    criadoEm: diasAtras(60),
    atualizadoEm: diasAtras(6, 16)
  },
  {
    id: 5,
    clienteId: 5,
    vendedorId: 4,
    status: StatusConversa.FECHADA,
    naoLidas: 0,
    ultimaMensagemEm: diasAtras(20, 11),
    janelaExpiraEm: null,
    criadoEm: diasAtras(75),
    atualizadoEm: diasAtras(20, 11)
  },
  {
    id: 6,
    clienteId: 6,
    vendedorId: 5,
    status: StatusConversa.ABERTA,
    naoLidas: 3,
    ultimaMensagemEm: horasAtras(2),
    janelaExpiraEm: null,
    criadoEm: diasAtras(18),
    atualizadoEm: horasAtras(2)
  },
  {
    id: 7,
    clienteId: 7,
    vendedorId: 3,
    status: StatusConversa.EM_ATENDIMENTO,
    naoLidas: 0,
    ultimaMensagemEm: horasAtras(20),
    janelaExpiraEm: null,
    criadoEm: diasAtras(30),
    atualizadoEm: horasAtras(20)
  },
  {
    id: 8,
    clienteId: 8,
    vendedorId: 4,
    status: StatusConversa.ABERTA,
    naoLidas: 1,
    ultimaMensagemEm: horasAtras(8),
    janelaExpiraEm: null,
    criadoEm: diasAtras(5),
    atualizadoEm: horasAtras(8)
  },
  {
    id: 9,
    clienteId: 9,
    vendedorId: 5,
    status: StatusConversa.EM_ATENDIMENTO,
    naoLidas: 0,
    ultimaMensagemEm: horasAtras(30),
    janelaExpiraEm: null,
    criadoEm: diasAtras(9),
    atualizadoEm: horasAtras(30)
  },
  {
    id: 10,
    clienteId: 10,
    vendedorId: 3,
    status: StatusConversa.ABERTA,
    naoLidas: 1,
    ultimaMensagemEm: horasAtras(26),
    janelaExpiraEm: null,
    criadoEm: diasAtras(2),
    atualizadoEm: horasAtras(26)
  }
];

export const MENSAGENS_INICIAIS: MensagemEntidade[] = [
  {
    id: 1,
    conversaId: 1,
    direcao: DirecaoMensagem.ENTRADA,
    tipo: TipoMensagem.TEXTO,
    conteudo: 'Oi! Vi o anuncio de voces e queria entender melhor os planos.',
    waMessageId: 'wamid.0001',
    statusEntrega: StatusEntrega.LIDA,
    enviadaPorId: null,
    criadoEm: horasAtras(4)
  },
  {
    id: 2,
    conversaId: 1,
    direcao: DirecaoMensagem.SAIDA,
    tipo: TipoMensagem.TEXTO,
    conteudo: 'Ola, Mariana! Claro. Para quantos usuarios seria a licenca?',
    waMessageId: 'wamid.0002',
    statusEntrega: StatusEntrega.LIDA,
    enviadaPorId: 3,
    criadoEm: horasAtras(3)
  },
  {
    id: 3,
    conversaId: 1,
    direcao: DirecaoMensagem.ENTRADA,
    tipo: TipoMensagem.TEXTO,
    conteudo: 'Seriam 12 por enquanto, mas devemos crescer no proximo semestre.',
    waMessageId: 'wamid.0003',
    statusEntrega: StatusEntrega.ENTREGUE,
    enviadaPorId: null,
    criadoEm: horasAtras(1)
  },
  {
    id: 4,
    conversaId: 2,
    direcao: DirecaoMensagem.SAIDA,
    tipo: TipoMensagem.TEXTO,
    conteudo: 'Bom dia, Rafael! Consegui liberar a condicao especial para a frota.',
    waMessageId: 'wamid.0010',
    statusEntrega: StatusEntrega.LIDA,
    enviadaPorId: 4,
    criadoEm: horasAtras(7)
  },
  {
    id: 5,
    conversaId: 2,
    direcao: DirecaoMensagem.ENTRADA,
    tipo: TipoMensagem.TEXTO,
    conteudo: 'Perfeito, me manda por escrito que eu levo para a diretoria.',
    waMessageId: 'wamid.0011',
    statusEntrega: StatusEntrega.LIDA,
    enviadaPorId: null,
    criadoEm: horasAtras(5)
  },
  {
    id: 6,
    conversaId: 3,
    direcao: DirecaoMensagem.SAIDA,
    tipo: TipoMensagem.TEXTO,
    conteudo: 'Juliana, acabei de enviar a proposta revisada para o seu e-mail.',
    waMessageId: 'wamid.0020',
    statusEntrega: StatusEntrega.ENTREGUE,
    enviadaPorId: 5,
    criadoEm: horasAtras(6)
  },
  {
    id: 7,
    conversaId: 3,
    direcao: DirecaoMensagem.ENTRADA,
    tipo: TipoMensagem.TEXTO,
    conteudo: 'Recebi! Vou revisar com o financeiro e te falo ainda hoje.',
    waMessageId: 'wamid.0021',
    statusEntrega: StatusEntrega.ENTREGUE,
    enviadaPorId: null,
    criadoEm: horasAtras(3)
  },
  {
    id: 8,
    conversaId: 6,
    direcao: DirecaoMensagem.ENTRADA,
    tipo: TipoMensagem.TEXTO,
    conteudo: 'Fernanda, conseguimos retomar aquela conversa?',
    waMessageId: 'wamid.0030',
    statusEntrega: StatusEntrega.ENTREGUE,
    enviadaPorId: null,
    criadoEm: horasAtras(2)
  },
  {
    id: 9,
    conversaId: 7,
    direcao: DirecaoMensagem.SAIDA,
    tipo: TipoMensagem.TEXTO,
    conteudo: 'Camila, a proposta foi enviada para o setor de compras. Estou a disposicao.',
    waMessageId: 'wamid.0040',
    statusEntrega: StatusEntrega.LIDA,
    enviadaPorId: 3,
    criadoEm: horasAtras(20)
  },
  {
    id: 10,
    conversaId: 8,
    direcao: DirecaoMensagem.ENTRADA,
    tipo: TipoMensagem.TEXTO,
    conteudo: 'Boa tarde, gostaria de saber o preco do plano basico.',
    waMessageId: 'wamid.0050',
    statusEntrega: StatusEntrega.ENTREGUE,
    enviadaPorId: null,
    criadoEm: horasAtras(8)
  },
  {
    id: 11,
    conversaId: 10,
    direcao: DirecaoMensagem.ENTRADA,
    tipo: TipoMensagem.TEXTO,
    conteudo: 'Ola, recebi o contato de voces pelo site.',
    waMessageId: 'wamid.0060',
    statusEntrega: StatusEntrega.ENTREGUE,
    enviadaPorId: null,
    criadoEm: horasAtras(26)
  }
];

export const ATRIBUICOES_INICIAIS: AtribuicaoLogEntidade[] = CONVERSAS_INICIAIS.map(
  (conversa, indice) => ({
    id: indice + 1,
    conversaId: conversa.id,
    deUsuarioId: null,
    paraUsuarioId: conversa.vendedorId ?? 3,
    feitaPorId: 2,
    motivo: 'Atribuicao inicial na criacao do cliente',
    criadoEm: conversa.criadoEm
  })
);
