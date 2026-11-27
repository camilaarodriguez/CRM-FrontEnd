import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, RegistroRequest } from '../models/auth.model';
import { UsuarioRole } from '../models/enums/usuario-role.enum';
import { Usuario } from '../models/usuario.model';
import { tratarErro } from '../utils/http-error.util';

const CHAVE_SESSAO = 'crm.sessao';

/** O que fica guardado no navegador entre recargas da página. */
interface Sessao {
  token: string;
  /** Instante de expiração em milissegundos desde 1970 (UTC). */
  expiraEm: number;
  usuario: Usuario;
}

/**
 * Sessão do usuário logado, baseada no JWT emitido pela API.
 *
 * O login e o cadastro chamam o AuthController (/api/auth). O token devolvido é
 * guardado junto da data de expiração e enviado em toda requisição pelo
 * authInterceptor. Quando o token vence, a sessão é encerrada e os guards mandam
 * o usuário de volta para o login.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/auth`;

  private readonly _sessao = signal<Sessao | null>(this.recuperarSessao());

  readonly usuario = computed<Usuario | null>(() => this._sessao()?.usuario ?? null);
  readonly autenticado = computed<boolean>(() => this._sessao() !== null);
  readonly ehAdministrador = computed<boolean>(() => this.usuario()?.role === UsuarioRole.ADMIN);
  readonly ehGerente = computed<boolean>(() => this.usuario()?.role === UsuarioRole.GERENTE);
  readonly ehVendedor = computed<boolean>(() => this.usuario()?.role === UsuarioRole.VENDEDOR);

  /** Quem pode distribuir carteira: administrador e gerente. */
  readonly podeDistribuir = computed<boolean>(
    () => this.ehAdministrador() || this.ehGerente()
  );

  /** POST /api/auth/login */
  login(email: string, senha: string): Observable<Usuario> {
    return this.http
      .post<LoginResponse>(`${this.url}/login`, { email, senha })
      .pipe(
        tratarErro('Não foi possível entrar'),
        map((resposta) => this.iniciarSessao(resposta))
      );
  }

  /** POST /api/auth/registro: cria a conta e já entra no sistema. */
  registrar(dados: RegistroRequest): Observable<Usuario> {
    return this.http
      .post<LoginResponse>(`${this.url}/registro`, dados)
      .pipe(
        tratarErro('Não foi possível criar a conta'),
        map((resposta) => this.iniciarSessao(resposta))
      );
  }

  logout(): void {
    this._sessao.set(null);
    localStorage.removeItem(CHAVE_SESSAO);
  }

  /**
   * Confere, no momento da chamada, se há uma sessão com token ainda válido.
   * Se o token já venceu, encerra a sessão antes de responder.
   */
  sessaoValida(): boolean {
    const sessao = this._sessao();
    if (sessao === null) {
      return false;
    }
    if (Date.now() >= sessao.expiraEm) {
      this.logout();
      return false;
    }
    return true;
  }

  /** Token para o cabeçalho Authorization, ou null quando não há sessão válida. */
  token(): string | null {
    return this.sessaoValida() ? (this._sessao()?.token ?? null) : null;
  }

  private iniciarSessao(resposta: LoginResponse): Usuario {
    const sessao: Sessao = {
      token: resposta.token,
      expiraEm: expiracaoDoToken(resposta.token) ?? Date.parse(resposta.expiraEm),
      usuario: resposta.usuario
    };
    this._sessao.set(sessao);
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
    return resposta.usuario;
  }

  private recuperarSessao(): Sessao | null {
    const bruto = localStorage.getItem(CHAVE_SESSAO);
    if (bruto === null) {
      return null;
    }

    try {
      const sessao = JSON.parse(bruto) as Sessao;
      const valida =
        typeof sessao.token === 'string' &&
        typeof sessao.expiraEm === 'number' &&
        sessao.usuario !== undefined &&
        Date.now() < sessao.expiraEm;
      if (!valida) {
        localStorage.removeItem(CHAVE_SESSAO);
        return null;
      }
      return sessao;
    } catch {
      localStorage.removeItem(CHAVE_SESSAO);
      return null;
    }
  }
}

/**
 * Lê a claim "exp" do payload do JWT (em segundos) e devolve em milissegundos.
 * A assinatura não é conferida aqui: quem valida o token de verdade é a API.
 */
function expiracaoDoToken(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const exp = (JSON.parse(json) as { exp?: unknown }).exp;
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null;
  }
}
