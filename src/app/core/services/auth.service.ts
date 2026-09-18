import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';
import { UsuarioRole } from '../models/enums/usuario-role.enum';
import { ErrorResponse } from '../models/error-response.model';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';

const CHAVE_SESSAO = 'crm.usuario';

/**
 * Sessão do usuário logado.
 *
 * O backend ainda não expõe endpoint de autenticação, então a senha é validada
 * localmente contra um valor de demonstração, conforme previsto nos critérios.
 * A identificação do usuário, porém, vem do UsuarioController via UsuarioService.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usuarioService = inject(UsuarioService);

  /** Senha única aceita na demonstração, já que não há endpoint de login. */
  private readonly senhaDemonstracao = '123456';

  private readonly _usuario = signal<Usuario | null>(this.recuperarSessao());

  readonly usuario = this._usuario.asReadonly();
  readonly autenticado = computed<boolean>(() => this._usuario() !== null);
  readonly ehAdministrador = computed<boolean>(() => this._usuario()?.role === UsuarioRole.ADMIN);
  readonly ehGerente = computed<boolean>(() => this._usuario()?.role === UsuarioRole.GERENTE);
  readonly ehVendedor = computed<boolean>(() => this._usuario()?.role === UsuarioRole.VENDEDOR);

  /** Quem pode distribuir carteira: administrador e gerente. */
  readonly podeDistribuir = computed<boolean>(
    () => this.ehAdministrador() || this.ehGerente()
  );

  login(email: string, senha: string): Observable<Usuario> {
    if (senha !== this.senhaDemonstracao) {
      return throwError(() => this.credenciaisInvalidas());
    }

    return this.usuarioService.listar({ busca: email }, { page: 0, size: 5 }).pipe(
      map((pagina) => {
        const alvo = email.trim().toLowerCase();
        const usuario = pagina.content.find((item) => item.email.toLowerCase() === alvo);

        if (!usuario) {
          throw this.credenciaisInvalidas();
        }
        if (!usuario.ativo) {
          throw this.usuarioInativo();
        }

        this._usuario.set(usuario);
        localStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuario));
        return usuario;
      })
    );
  }

  logout(): void {
    this._usuario.set(null);
    localStorage.removeItem(CHAVE_SESSAO);
  }

  private credenciaisInvalidas(): ErrorResponse {
    return {
      timestamp: new Date().toISOString(),
      status: 401,
      erro: 'Credenciais inválidas',
      mensagem: 'E-mail ou senha incorretos. Confira os dados e tente novamente.',
      caminho: '/login',
      detalhes: []
    };
  }

  private usuarioInativo(): ErrorResponse {
    return {
      timestamp: new Date().toISOString(),
      status: 403,
      erro: 'Acesso bloqueado',
      mensagem: 'Este usuário está inativo. Procure um administrador para reativar o acesso.',
      caminho: '/login',
      detalhes: []
    };
  }

  private recuperarSessao(): Usuario | null {
    const bruto = localStorage.getItem(CHAVE_SESSAO);
    if (bruto === null) {
      return null;
    }

    try {
      return JSON.parse(bruto) as Usuario;
    } catch {
      localStorage.removeItem(CHAVE_SESSAO);
      return null;
    }
  }
}
