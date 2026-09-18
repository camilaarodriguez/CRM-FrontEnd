import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { Conversa } from '../models/conversa.model';
import { StatusConversa } from '../models/enums/status-conversa.enum';
import { DirecaoMensagem } from '../models/enums/direcao-mensagem.enum';
import { StatusEntrega } from '../models/enums/status-entrega.enum';
import { StatusFunil } from '../models/enums/status-funil.enum';
import { TipoMensagem } from '../models/enums/tipo-mensagem.enum';
import { UsuarioRole } from '../models/enums/usuario-role.enum';
import { ErrorResponse } from '../models/error-response.model';
import { Mensagem } from '../models/mensagem.model';
import { Page } from '../models/page.model';
import { Usuario } from '../models/usuario.model';
import {
  ATRIBUICOES_INICIAIS,
  CLIENTES_INICIAIS,
  CONVERSAS_INICIAIS,
  MENSAGENS_INICIAIS,
  USUARIOS_INICIAIS
} from './dados-iniciais';
import {
  AtribuicaoLogEntidade,
  ClienteEntidade,
  ConversaEntidade,
  MensagemEntidade,
  UsuarioEntidade
} from './entidades.model';

interface CorpoDesconhecido {
  [chave: string]: unknown;
}

/**
 * Banco de dados em memória que reproduz o comportamento da API do projeto:
 * mesmos endpoints, mesmos filtros, mesma paginação, mesmas regras de negócio
 * e o mesmo formato de erro do GlobalExceptionHandler.
 *
 * Existe para que o frontend use HttpClient de verdade enquanto o backend não
 * estiver no ar. Para falar com a API real basta desligar o mock em
 * `environment.usarApiMockada` — nenhuma service precisa ser alterada.
 */
@Injectable({ providedIn: 'root' })
export class BancoEmMemoriaService {
  private usuarios: UsuarioEntidade[] = USUARIOS_INICIAIS.map((item) => ({ ...item }));
  private clientes: ClienteEntidade[] = CLIENTES_INICIAIS.map((item) => ({ ...item }));
  private conversas: ConversaEntidade[] = CONVERSAS_INICIAIS.map((item) => ({ ...item }));
  private mensagens: MensagemEntidade[] = MENSAGENS_INICIAIS.map((item) => ({ ...item }));
  private atribuicoes: AtribuicaoLogEntidade[] = ATRIBUICOES_INICIAIS.map((item) => ({ ...item }));

  private proximoUsuarioId = 7;
  private proximoClienteId = 11;
  private proximaConversaId = 11;
  private proximaMensagemId = 12;
  private proximaAtribuicaoId = 11;

  responder(req: HttpRequest<unknown>): Observable<HttpResponse<unknown>> {
    const caminho = this.extrairCaminho(req.url);
    const partes = caminho.split('/').filter((parte) => parte.length > 0);
    const recurso = partes[0] ?? '';

    try {
      if (recurso === 'usuarios') {
        return this.rotearUsuarios(req, partes);
      }
      if (recurso === 'clientes') {
        return this.rotearClientes(req, partes);
      }
      if (recurso === 'conversas') {
        return this.rotearConversas(req, partes);
      }
      if (recurso === 'mensagens') {
        return this.rotearMensagens(req, partes);
      }
      return this.naoEncontrado(req, `Nenhum endpoint mapeado para ${caminho}`);
    } catch (erro) {
      if (erro instanceof HttpErrorResponse) {
        return throwError(() => erro);
      }
      return this.erroInterno(req);
    }
  }

  // ------------------------------------------------------------------ usuários

  private rotearUsuarios(
    req: HttpRequest<unknown>,
    partes: string[]
  ): Observable<HttpResponse<unknown>> {
    const id = partes[1] !== undefined ? Number(partes[1]) : null;
    const subrecurso = partes[2];

    if (req.method === 'GET' && id === null) {
      return this.ok(this.listarUsuarios(req));
    }
    if (req.method === 'GET' && id !== null) {
      return this.ok(this.paraUsuarioResponse(this.acharUsuario(req, id)));
    }
    if (req.method === 'POST' && id === null) {
      return this.criado(this.criarUsuario(req));
    }
    if (req.method === 'PUT' && id !== null) {
      return this.ok(this.atualizarUsuario(req, id));
    }
    if (req.method === 'PATCH' && id !== null && subrecurso === 'status') {
      return this.ok(this.alterarStatusUsuario(req, id));
    }
    if (req.method === 'DELETE' && id !== null) {
      this.excluirUsuario(req, id);
      return this.semConteudo();
    }
    return this.naoEncontrado(req, 'Operacao nao suportada para /api/usuarios');
  }

  private listarUsuarios(req: HttpRequest<unknown>): Page<Usuario> {
    const busca = (req.params.get('busca') ?? '').trim().toLowerCase();
    const role = req.params.get('role');
    const ativo = req.params.get('ativo');

    const filtrados = this.usuarios.filter((usuario) => {
      const casaBusca =
        busca === '' ||
        usuario.nome.toLowerCase().includes(busca) ||
        usuario.email.toLowerCase().includes(busca);
      const casaRole = role === null || usuario.role === role;
      const casaAtivo = ativo === null || usuario.ativo === (ativo === 'true');
      return casaBusca && casaRole && casaAtivo;
    });

    const ordenados = [...filtrados].sort((a, b) => a.nome.localeCompare(b.nome));
    return this.paginar(ordenados.map((item) => this.paraUsuarioResponse(item)), req);
  }

  private criarUsuario(req: HttpRequest<unknown>): Usuario {
    const corpo = this.corpo(req);
    const nome = this.texto(corpo, 'nome');
    const email = this.texto(corpo, 'email');
    const senha = this.texto(corpo, 'senha');
    const role = this.texto(corpo, 'role');

    const problemas: string[] = [];
    if (!nome) {
      problemas.push('O nome e obrigatorio');
    }
    if (!email) {
      problemas.push('O email e obrigatorio');
    }
    if (senha.length < 6) {
      problemas.push('A senha deve ter no minimo 6 caracteres');
    }
    if (!role) {
      problemas.push('O role e obrigatorio');
    }
    if (problemas.length > 0) {
      throw this.erroValidacao(req, problemas);
    }

    if (this.usuarios.some((usuario) => usuario.email.toLowerCase() === email.toLowerCase())) {
      throw this.erroNegocio(req, 'Ja existe um usuario cadastrado com o email informado');
    }

    const agora = new Date().toISOString();
    const novo: UsuarioEntidade = {
      id: this.proximoUsuarioId++,
      nome,
      email,
      senha,
      role: role as UsuarioRole,
      ativo: true,
      criadoEm: agora,
      atualizadoEm: agora
    };
    this.usuarios.push(novo);
    return this.paraUsuarioResponse(novo);
  }

  private atualizarUsuario(req: HttpRequest<unknown>, id: number): Usuario {
    const usuario = this.acharUsuario(req, id);
    const corpo = this.corpo(req);
    const nome = this.texto(corpo, 'nome');
    const email = this.texto(corpo, 'email');
    const role = this.texto(corpo, 'role');

    const problemas: string[] = [];
    if (!nome) {
      problemas.push('O nome e obrigatorio');
    }
    if (!email) {
      problemas.push('O email e obrigatorio');
    }
    if (!role) {
      problemas.push('O role e obrigatorio');
    }
    if (problemas.length > 0) {
      throw this.erroValidacao(req, problemas);
    }

    const emailEmUso = this.usuarios.some(
      (outro) => outro.id !== id && outro.email.toLowerCase() === email.toLowerCase()
    );
    if (emailEmUso) {
      throw this.erroNegocio(req, 'Ja existe um usuario cadastrado com o email informado');
    }

    usuario.nome = nome;
    usuario.email = email;
    usuario.role = role as UsuarioRole;
    usuario.atualizadoEm = new Date().toISOString();
    return this.paraUsuarioResponse(usuario);
  }

  private alterarStatusUsuario(req: HttpRequest<unknown>, id: number): Usuario {
    const usuario = this.acharUsuario(req, id);
    const corpo = this.corpo(req);
    const ativo = corpo['ativo'];

    if (typeof ativo !== 'boolean') {
      throw this.erroValidacao(req, ['O campo ativo e obrigatorio']);
    }

    usuario.ativo = ativo;
    usuario.atualizadoEm = new Date().toISOString();
    return this.paraUsuarioResponse(usuario);
  }

  private excluirUsuario(req: HttpRequest<unknown>, id: number): void {
    const usuario = this.acharUsuario(req, id);

    const possuiCarteira = this.clientes.some((cliente) => cliente.vendedorId === usuario.id);
    if (possuiCarteira) {
      throw this.erroNegocio(
        req,
        'Nao e possivel excluir um usuario que ainda possui clientes atribuidos'
      );
    }

    this.usuarios = this.usuarios.filter((item) => item.id !== id);
  }

  // ------------------------------------------------------------------ clientes

  private rotearClientes(
    req: HttpRequest<unknown>,
    partes: string[]
  ): Observable<HttpResponse<unknown>> {
    const id = partes[1] !== undefined ? Number(partes[1]) : null;
    const subrecurso = partes[2];

    if (req.method === 'GET' && id === null) {
      return this.ok(this.listarClientes(req));
    }
    if (req.method === 'GET' && id !== null) {
      return this.ok(this.paraClienteResponse(this.acharCliente(req, id)));
    }
    if (req.method === 'POST' && id === null) {
      return this.criado(this.criarCliente(req));
    }
    if (req.method === 'PUT' && id !== null) {
      return this.ok(this.atualizarCliente(req, id));
    }
    if (req.method === 'PATCH' && id !== null && subrecurso === 'status-funil') {
      return this.ok(this.atualizarStatusFunil(req, id));
    }
    if (req.method === 'PATCH' && id !== null && subrecurso === 'reatribuir') {
      return this.ok(this.reatribuirCliente(req, id));
    }
    if (req.method === 'DELETE' && id !== null) {
      this.excluirCliente(req, id);
      return this.semConteudo();
    }
    return this.naoEncontrado(req, 'Operacao nao suportada para /api/clientes');
  }

  private listarClientes(req: HttpRequest<unknown>): Page<Cliente> {
    const busca = (req.params.get('busca') ?? '').trim().toLowerCase();
    const status = req.params.get('status');
    const vendedorId = req.params.get('vendedorId');
    const incluirInativos = req.params.get('incluirInativos') === 'true';

    const filtrados = this.clientes.filter((cliente) => {
      const casaBusca =
        busca === '' ||
        cliente.nome.toLowerCase().includes(busca) ||
        (cliente.email ?? '').toLowerCase().includes(busca);
      const casaStatus = status === null || cliente.statusFunil === status;
      const casaVendedor = vendedorId === null || cliente.vendedorId === Number(vendedorId);
      const casaAtivo = incluirInativos || cliente.ativo;
      return casaBusca && casaStatus && casaVendedor && casaAtivo;
    });

    const ordenados = [...filtrados].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
    return this.paginar(ordenados.map((item) => this.paraClienteResponse(item)), req);
  }

  private criarCliente(req: HttpRequest<unknown>): Cliente {
    const corpo = this.corpo(req);
    const nome = this.texto(corpo, 'nome');
    const telefone = this.texto(corpo, 'telefone');
    const vendedorId = Number(corpo['vendedorId']);

    const problemas: string[] = [];
    if (!nome) {
      problemas.push('O nome e obrigatorio');
    }
    if (!telefone) {
      problemas.push('O telefone e obrigatorio');
    }
    if (!vendedorId) {
      problemas.push('O vendedorId e obrigatorio');
    }
    if (problemas.length > 0) {
      throw this.erroValidacao(req, problemas);
    }

    const vendedor = this.acharVendedor(req, vendedorId);

    const telefoneEmUso = this.clientes.some((cliente) => cliente.telefone === telefone);
    if (telefoneEmUso) {
      throw this.erroNegocio(req, 'Ja existe um cliente cadastrado com o telefone informado');
    }

    const agora = new Date().toISOString();
    const statusInformado = this.texto(corpo, 'statusFunil');
    const novo: ClienteEntidade = {
      id: this.proximoClienteId++,
      nome,
      email: this.textoOuNulo(corpo, 'email'),
      telefone,
      documento: this.textoOuNulo(corpo, 'documento'),
      empresa: this.textoOuNulo(corpo, 'empresa'),
      observacoes: this.textoOuNulo(corpo, 'observacoes'),
      vendedorId: vendedor.id,
      statusFunil: statusInformado ? (statusInformado as StatusFunil) : StatusFunil.NOVO,
      ativo: true,
      criadoEm: agora,
      atualizadoEm: agora
    };
    this.clientes.push(novo);

    // O backend abre uma conversa e registra a atribuição inicial junto com o cliente.
    const conversa = this.abrirConversa(novo, vendedor.id);
    this.registrarAtribuicao(conversa.id, null, vendedor.id, vendedor.id, 'Atribuicao inicial na criacao do cliente');

    return this.paraClienteResponse(novo);
  }

  private atualizarCliente(req: HttpRequest<unknown>, id: number): Cliente {
    const cliente = this.acharCliente(req, id);
    const corpo = this.corpo(req);
    const nome = this.texto(corpo, 'nome');
    const telefone = this.texto(corpo, 'telefone');
    const vendedorId = Number(corpo['vendedorId']);

    const problemas: string[] = [];
    if (!nome) {
      problemas.push('O nome e obrigatorio');
    }
    if (!telefone) {
      problemas.push('O telefone e obrigatorio');
    }
    if (!vendedorId) {
      problemas.push('O vendedorId e obrigatorio');
    }
    if (problemas.length > 0) {
      throw this.erroValidacao(req, problemas);
    }

    const vendedor = this.acharVendedor(req, vendedorId);
    const telefoneEmUso = this.clientes.some(
      (outro) => outro.id !== id && outro.telefone === telefone
    );
    if (telefoneEmUso) {
      throw this.erroNegocio(req, 'Ja existe um cliente cadastrado com o telefone informado');
    }

    cliente.nome = nome;
    cliente.email = this.textoOuNulo(corpo, 'email');
    cliente.telefone = telefone;
    cliente.documento = this.textoOuNulo(corpo, 'documento');
    cliente.empresa = this.textoOuNulo(corpo, 'empresa');
    cliente.observacoes = this.textoOuNulo(corpo, 'observacoes');
    cliente.vendedorId = vendedor.id;
    cliente.atualizadoEm = new Date().toISOString();

    return this.paraClienteResponse(cliente);
  }

  private atualizarStatusFunil(req: HttpRequest<unknown>, id: number): Cliente {
    const cliente = this.acharCliente(req, id);
    const statusFunil = this.texto(this.corpo(req), 'statusFunil');

    if (!statusFunil) {
      throw this.erroValidacao(req, ['O statusFunil e obrigatorio']);
    }

    cliente.statusFunil = statusFunil as StatusFunil;
    cliente.atualizadoEm = new Date().toISOString();
    return this.paraClienteResponse(cliente);
  }

  private reatribuirCliente(req: HttpRequest<unknown>, id: number): Cliente {
    const cliente = this.acharCliente(req, id);
    const corpo = this.corpo(req);
    const novoVendedorId = Number(corpo['novoVendedorId']);

    if (!novoVendedorId) {
      throw this.erroValidacao(req, ['O novoVendedorId e obrigatorio']);
    }
    if (novoVendedorId === cliente.vendedorId) {
      throw this.erroNegocio(req, 'O cliente ja esta atribuido a este vendedor');
    }

    const vendedorAntigoId = cliente.vendedorId;
    const vendedorNovo = this.acharVendedor(req, novoVendedorId);

    cliente.vendedorId = vendedorNovo.id;
    cliente.atualizadoEm = new Date().toISOString();

    const conversa =
      this.conversas.find((item) => item.clienteId === cliente.id) ??
      this.abrirConversa(cliente, vendedorNovo.id);
    conversa.vendedorId = vendedorNovo.id;
    conversa.atualizadoEm = new Date().toISOString();

    this.registrarAtribuicao(
      conversa.id,
      vendedorAntigoId,
      vendedorNovo.id,
      vendedorNovo.id,
      this.textoOuNulo(corpo, 'motivo')
    );

    return this.paraClienteResponse(cliente);
  }

  private excluirCliente(req: HttpRequest<unknown>, id: number): void {
    const cliente = this.acharCliente(req, id);

    if (!cliente.ativo) {
      throw this.erroNegocio(req, 'Este cliente ja esta inativo');
    }

    // Exclusao logica, como faz o backend: o cliente sai da carteira e a
    // conversa com o historico de mensagens continua disponivel.
    cliente.ativo = false;
    cliente.atualizadoEm = new Date().toISOString();
  }

  // ----------------------------------------------------------------- conversas

  private rotearConversas(
    req: HttpRequest<unknown>,
    partes: string[]
  ): Observable<HttpResponse<unknown>> {
    const id = partes[1] !== undefined ? Number(partes[1]) : null;

    if (req.method === 'GET' && id === null) {
      return this.ok(this.listarConversas(req));
    }
    if (req.method === 'GET' && id !== null) {
      const conversa = this.conversas.find((item) => item.id === id);
      if (!conversa) {
        throw this.erroNaoEncontrado(req, `Conversa nao encontrada com o id: ${id}`);
      }
      return this.ok(this.paraConversaResponse(conversa));
    }
    return this.naoEncontrado(req, 'Operacao nao suportada para /api/conversas');
  }

  private listarConversas(req: HttpRequest<unknown>): Page<Conversa> {
    const vendedorId = req.params.get('vendedorId');

    const filtradas = this.conversas.filter(
      (conversa) => vendedorId === null || conversa.vendedorId === Number(vendedorId)
    );

    const ordenadas = [...filtradas].sort((a, b) =>
      (b.ultimaMensagemEm ?? b.criadoEm).localeCompare(a.ultimaMensagemEm ?? a.criadoEm)
    );

    return this.paginar(ordenadas.map((item) => this.paraConversaResponse(item)), req, 20);
  }

  // ----------------------------------------------------------------- mensagens

  private rotearMensagens(
    req: HttpRequest<unknown>,
    partes: string[]
  ): Observable<HttpResponse<unknown>> {
    if (req.method === 'POST' && partes.length === 1) {
      return this.criado(this.enviarMensagem(req));
    }
    if (req.method === 'GET' && partes[1] === 'conversa' && partes[2] !== undefined) {
      return this.ok(this.listarMensagens(req, Number(partes[2])));
    }
    return this.naoEncontrado(req, 'Operacao nao suportada para /api/mensagens');
  }

  private listarMensagens(req: HttpRequest<unknown>, conversaId: number): Mensagem[] {
    const conversa = this.conversas.find((item) => item.id === conversaId);
    if (!conversa) {
      throw this.erroNaoEncontrado(req, `Conversa nao encontrada com o id: ${conversaId}`);
    }

    // Abrir a conversa zera o contador de mensagens não lidas.
    conversa.naoLidas = 0;

    return this.mensagens
      .filter((mensagem) => mensagem.conversaId === conversaId)
      .sort((a, b) => a.criadoEm.localeCompare(b.criadoEm))
      .map((mensagem) => this.paraMensagemResponse(mensagem));
  }

  private enviarMensagem(req: HttpRequest<unknown>): Mensagem {
    const corpo = this.corpo(req);
    const conversaId = Number(corpo['conversaId']);
    const conteudo = this.texto(corpo, 'conteudo');
    const tipo = this.texto(corpo, 'tipo');

    const problemas: string[] = [];
    if (!conversaId) {
      problemas.push('O conversaId e obrigatorio');
    }
    if (!conteudo) {
      problemas.push('O conteudo e obrigatorio');
    }
    if (!tipo) {
      problemas.push('O tipo e obrigatorio');
    }
    if (problemas.length > 0) {
      throw this.erroValidacao(req, problemas);
    }

    const conversa = this.conversas.find((item) => item.id === conversaId);
    if (!conversa) {
      throw this.erroNaoEncontrado(req, `Conversa nao encontrada com o id: ${conversaId}`);
    }
    if (conversa.status === StatusConversa.FECHADA) {
      throw this.erroNegocio(req, 'Nao e possivel enviar mensagem em uma conversa fechada');
    }

    const agora = new Date().toISOString();
    const nova: MensagemEntidade = {
      id: this.proximaMensagemId++,
      conversaId: conversa.id,
      direcao: DirecaoMensagem.SAIDA,
      tipo: tipo as TipoMensagem,
      conteudo,
      waMessageId: `wamid.${Date.now()}`,
      statusEntrega: StatusEntrega.ENVIADA,
      enviadaPorId: conversa.vendedorId,
      criadoEm: agora
    };
    this.mensagens.push(nova);

    conversa.ultimaMensagemEm = agora;
    conversa.atualizadoEm = agora;
    if (conversa.status === StatusConversa.ABERTA) {
      conversa.status = StatusConversa.EM_ATENDIMENTO;
    }

    return this.paraMensagemResponse(nova);
  }

  // ------------------------------------------------------------------ apoio

  private abrirConversa(cliente: ClienteEntidade, vendedorId: number): ConversaEntidade {
    const agora = new Date().toISOString();
    const conversa: ConversaEntidade = {
      id: this.proximaConversaId++,
      clienteId: cliente.id,
      vendedorId,
      status: StatusConversa.ABERTA,
      naoLidas: 0,
      ultimaMensagemEm: null,
      janelaExpiraEm: null,
      criadoEm: agora,
      atualizadoEm: agora
    };
    this.conversas.push(conversa);
    return conversa;
  }

  private registrarAtribuicao(
    conversaId: number,
    deUsuarioId: number | null,
    paraUsuarioId: number,
    feitaPorId: number,
    motivo: string | null
  ): void {
    this.atribuicoes.push({
      id: this.proximaAtribuicaoId++,
      conversaId,
      deUsuarioId,
      paraUsuarioId,
      feitaPorId,
      motivo,
      criadoEm: new Date().toISOString()
    });
  }

  private acharUsuario(req: HttpRequest<unknown>, id: number): UsuarioEntidade {
    const usuario = this.usuarios.find((item) => item.id === id);
    if (!usuario) {
      throw this.erroNaoEncontrado(req, `Usuario nao encontrado com o id: ${id}`);
    }
    return usuario;
  }

  private acharVendedor(req: HttpRequest<unknown>, id: number): UsuarioEntidade {
    const usuario = this.usuarios.find((item) => item.id === id);
    if (!usuario) {
      throw this.erroNaoEncontrado(req, `Vendedor nao encontrado com o id: ${id}`);
    }
    if (!usuario.ativo) {
      throw this.erroNegocio(req, 'Nao e possivel atribuir clientes a um usuario inativo');
    }
    return usuario;
  }

  private acharCliente(req: HttpRequest<unknown>, id: number): ClienteEntidade {
    const cliente = this.clientes.find((item) => item.id === id);
    if (!cliente) {
      throw this.erroNaoEncontrado(req, `Cliente nao encontrado com o id: ${id}`);
    }
    return cliente;
  }

  private paraUsuarioResponse(entidade: UsuarioEntidade): Usuario {
    return {
      id: entidade.id,
      nome: entidade.nome,
      email: entidade.email,
      role: entidade.role,
      ativo: entidade.ativo,
      criadoEm: entidade.criadoEm,
      atualizadoEm: entidade.atualizadoEm
    };
  }

  private paraClienteResponse(entidade: ClienteEntidade): Cliente {
    const vendedor = this.usuarios.find((item) => item.id === entidade.vendedorId);
    return {
      id: entidade.id,
      nome: entidade.nome,
      email: entidade.email,
      telefone: entidade.telefone,
      documento: entidade.documento,
      empresa: entidade.empresa,
      observacoes: entidade.observacoes,
      vendedorId: entidade.vendedorId,
      vendedorNome: vendedor?.nome ?? '',
      statusFunil: entidade.statusFunil,
      ativo: entidade.ativo,
      criadoEm: entidade.criadoEm,
      atualizadoEm: entidade.atualizadoEm
    };
  }

  private paraConversaResponse(entidade: ConversaEntidade): Conversa {
    const cliente = this.clientes.find((item) => item.id === entidade.clienteId);
    const vendedor = this.usuarios.find((item) => item.id === entidade.vendedorId);
    return {
      id: entidade.id,
      clienteId: entidade.clienteId,
      clienteNome: cliente?.nome ?? '',
      vendedorId: entidade.vendedorId,
      vendedorNome: vendedor?.nome ?? null,
      status: entidade.status,
      naoLidas: entidade.naoLidas,
      ultimaMensagemEm: entidade.ultimaMensagemEm,
      janelaExpiraEm: entidade.janelaExpiraEm,
      criadoEm: entidade.criadoEm,
      atualizadoEm: entidade.atualizadoEm
    };
  }

  private paraMensagemResponse(entidade: MensagemEntidade): Mensagem {
    const autor = this.usuarios.find((item) => item.id === entidade.enviadaPorId);
    return {
      id: entidade.id,
      conversaId: entidade.conversaId,
      direcao: entidade.direcao,
      tipo: entidade.tipo,
      conteudo: entidade.conteudo,
      waMessageId: entidade.waMessageId,
      statusEntrega: entidade.statusEntrega,
      enviadaPorId: entidade.enviadaPorId,
      enviadaPorNome: autor?.nome ?? null,
      criadoEm: entidade.criadoEm
    };
  }

  private paginar<T>(itens: T[], req: HttpRequest<unknown>, tamanhoPadrao = 10): Page<T> {
    const page = Number(req.params.get('page') ?? 0);
    const size = Number(req.params.get('size') ?? tamanhoPadrao);
    const inicio = page * size;
    const conteudo = itens.slice(inicio, inicio + size);
    const totalPages = size > 0 ? Math.ceil(itens.length / size) : 0;

    return {
      content: conteudo,
      totalElements: itens.length,
      totalPages,
      number: page,
      size,
      first: page === 0,
      last: totalPages === 0 || page >= totalPages - 1,
      numberOfElements: conteudo.length,
      empty: conteudo.length === 0
    };
  }

  private corpo(req: HttpRequest<unknown>): CorpoDesconhecido {
    return (req.body ?? {}) as CorpoDesconhecido;
  }

  private texto(corpo: CorpoDesconhecido, chave: string): string {
    const valor = corpo[chave];
    return typeof valor === 'string' ? valor.trim() : '';
  }

  private textoOuNulo(corpo: CorpoDesconhecido, chave: string): string | null {
    const valor = this.texto(corpo, chave);
    return valor.length > 0 ? valor : null;
  }

  private extrairCaminho(url: string): string {
    const semOrigem = url.replace(/^https?:\/\/[^/]+/, '');
    const semQuery = semOrigem.split('?')[0] ?? '';
    return semQuery.replace(/^\/?api\/?/, '');
  }

  private ok(corpo: unknown): Observable<HttpResponse<unknown>> {
    return of(new HttpResponse({ status: 200, body: corpo }));
  }

  private criado(corpo: unknown): Observable<HttpResponse<unknown>> {
    return of(new HttpResponse({ status: 201, body: corpo }));
  }

  private semConteudo(): Observable<HttpResponse<unknown>> {
    return of(new HttpResponse({ status: 204, body: null }));
  }

  private naoEncontrado(
    req: HttpRequest<unknown>,
    mensagem: string
  ): Observable<HttpResponse<unknown>> {
    return throwError(() => this.erroNaoEncontrado(req, mensagem));
  }

  private erroInterno(req: HttpRequest<unknown>): Observable<HttpResponse<unknown>> {
    return throwError(
      () =>
        new HttpErrorResponse({
          status: 500,
          url: req.url,
          error: this.montarErro(500, 'Erro interno', 'Ocorreu um erro inesperado ao processar a requisicao', req.url)
        })
    );
  }

  private erroNaoEncontrado(req: HttpRequest<unknown>, mensagem: string): HttpErrorResponse {
    return new HttpErrorResponse({
      status: 404,
      url: req.url,
      error: this.montarErro(404, 'Recurso nao encontrado', mensagem, req.url)
    });
  }

  private erroNegocio(req: HttpRequest<unknown>, mensagem: string): HttpErrorResponse {
    return new HttpErrorResponse({
      status: 409,
      url: req.url,
      error: this.montarErro(409, 'Violacao de regra de negocio', mensagem, req.url)
    });
  }

  private erroValidacao(req: HttpRequest<unknown>, detalhes: string[]): HttpErrorResponse {
    return new HttpErrorResponse({
      status: 400,
      url: req.url,
      error: this.montarErro(
        400,
        'Erro de validacao',
        'Um ou mais campos sao invalidos',
        req.url,
        detalhes
      )
    });
  }

  private montarErro(
    status: number,
    erro: string,
    mensagem: string,
    caminho: string,
    detalhes: string[] = []
  ): ErrorResponse {
    return {
      timestamp: new Date().toISOString(),
      status,
      erro,
      mensagem,
      caminho,
      detalhes
    };
  }
}
