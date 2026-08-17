import { Injectable, computed, inject, signal } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';

const CHAVE_STORAGE = 'crm.usuario';
const SENHA_MOCK = '123456';

/**
 * Autenticação mockada. A API ainda não expõe endpoint de login, então a
 * validação é feita contra a lista de usuários em memória.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usuarioService = inject(UsuarioService);

  private readonly _usuario = signal<Usuario | null>(this.recuperarSessao());

  readonly usuario = this._usuario.asReadonly();
  readonly autenticado = computed<boolean>(() => this._usuario() !== null);

  login(email: string, senha: string): boolean {
    const usuario = this.usuarioService.buscarPorEmail(email);
    if (usuario === undefined || !usuario.ativo || senha !== SENHA_MOCK) {
      return false;
    }

    this._usuario.set(usuario);
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(usuario));
    return true;
  }

  logout(): void {
    this._usuario.set(null);
    localStorage.removeItem(CHAVE_STORAGE);
  }

  private recuperarSessao(): Usuario | null {
    const bruto = localStorage.getItem(CHAVE_STORAGE);
    if (bruto === null) {
      return null;
    }

    try {
      return JSON.parse(bruto) as Usuario;
    } catch {
      localStorage.removeItem(CHAVE_STORAGE);
      return null;
    }
  }
}
