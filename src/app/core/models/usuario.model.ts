import { UsuarioRole } from './enums/usuario-role.enum';

/** Espelha UsuarioResponseDTO */
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: UsuarioRole;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string | null;
}

/** Espelha UsuarioCreateDTO */
export interface UsuarioCreate {
  nome: string;
  email: string;
  senha: string;
  role: UsuarioRole;
}

/** Espelha UsuarioUpdateDTO */
export interface UsuarioUpdate {
  nome: string;
  email: string;
  role: UsuarioRole;
}

/** Espelha UsuarioStatusDTO */
export interface UsuarioStatus {
  ativo: boolean;
}

/** Filtros de GET /api/usuarios */
export interface UsuarioFiltro {
  busca?: string;
  role?: UsuarioRole | null;
  ativo?: boolean | null;
}
