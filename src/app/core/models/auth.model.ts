import { Usuario } from './usuario.model';

/** Espelha LoginRequestDTO */
export interface LoginRequest {
  email: string;
  senha: string;
}

/** Espelha RegistroRequestDTO: o perfil não é enviado, a API sempre cria VENDEDOR. */
export interface RegistroRequest {
  nome: string;
  email: string;
  senha: string;
}

/** Espelha LoginResponseDTO, devolvido pelo login e pelo cadastro. */
export interface LoginResponse {
  token: string;
  tipo: string;
  /** ISO-8601 em UTC, por exemplo 2026-11-26T20:00:00Z */
  expiraEm: string;
  usuario: Usuario;
}
