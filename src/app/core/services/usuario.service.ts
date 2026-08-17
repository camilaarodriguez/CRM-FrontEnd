import { Injectable, computed, signal } from '@angular/core';
import { Role } from '../models/role.enum';
import { Usuario } from '../models/usuario.model';

/**
 * Equivalente mockado de `/api/usuarios`.
 * `vendedores` corresponde a `GET /api/usuarios?role=VENDEDOR`.
 */
@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly _usuarios = signal<Usuario[]>([
    { id: 1, nome: 'Administrador', email: 'admin@crm.com', role: Role.ADMIN, ativo: true },
    {
      id: 2,
      nome: 'Marcos Vinícius Teixeira',
      email: 'marcos.teixeira@crm.com',
      role: Role.GERENTE,
      ativo: true
    },
    {
      id: 3,
      nome: 'Ana Beatriz Moraes',
      email: 'ana.moraes@crm.com',
      role: Role.VENDEDOR,
      ativo: true
    },
    {
      id: 4,
      nome: 'Carlos Eduardo Lima',
      email: 'carlos.lima@crm.com',
      role: Role.VENDEDOR,
      ativo: true
    },
    {
      id: 5,
      nome: 'Fernanda Ribeiro',
      email: 'fernanda.ribeiro@crm.com',
      role: Role.VENDEDOR,
      ativo: true
    }
  ]);

  readonly usuarios = this._usuarios.asReadonly();

  readonly vendedores = computed<Usuario[]>(() =>
    this._usuarios().filter((usuario) => usuario.role === Role.VENDEDOR && usuario.ativo)
  );

  buscarPorId(id: number): Usuario | undefined {
    return this._usuarios().find((usuario) => usuario.id === id);
  }

  buscarPorEmail(email: string): Usuario | undefined {
    const alvo = email.trim().toLowerCase();
    return this._usuarios().find((usuario) => usuario.email.toLowerCase() === alvo);
  }
}
