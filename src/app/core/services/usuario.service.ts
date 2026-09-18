import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page, PageRequest } from '../models/page.model';
import {
  Usuario,
  UsuarioCreate,
  UsuarioFiltro,
  UsuarioStatus,
  UsuarioUpdate
} from '../models/usuario.model';
import { tratarErro } from '../utils/http-error.util';

/**
 * Consome exclusivamente o UsuarioController (/api/usuarios).
 * Nenhum outro endpoint do backend é acessado por esta service.
 */
@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/usuarios`;

  /** GET /api/usuarios?busca=&role=&ativo=&page=&size= */
  listar(filtro: UsuarioFiltro = {}, paginacao: PageRequest = {}): Observable<Page<Usuario>> {
    let params = new HttpParams()
      .set('page', String(paginacao.page ?? 0))
      .set('size', String(paginacao.size ?? 10));

    if (filtro.busca) {
      params = params.set('busca', filtro.busca);
    }
    if (filtro.role) {
      params = params.set('role', filtro.role);
    }
    if (filtro.ativo !== null && filtro.ativo !== undefined) {
      params = params.set('ativo', String(filtro.ativo));
    }

    return this.http
      .get<Page<Usuario>>(this.url, { params })
      .pipe(tratarErro('Falha ao listar os usuários'));
  }

  /** GET /api/usuarios/{id} */
  buscarPorId(id: number): Observable<Usuario> {
    return this.http
      .get<Usuario>(`${this.url}/${id}`)
      .pipe(tratarErro('Falha ao carregar o usuário'));
  }

  /** POST /api/usuarios */
  criar(usuario: UsuarioCreate): Observable<Usuario> {
    return this.http
      .post<Usuario>(this.url, usuario)
      .pipe(tratarErro('Falha ao cadastrar o usuário'));
  }

  /** PUT /api/usuarios/{id} */
  atualizar(id: number, usuario: UsuarioUpdate): Observable<Usuario> {
    return this.http
      .put<Usuario>(`${this.url}/${id}`, usuario)
      .pipe(tratarErro('Falha ao atualizar o usuário'));
  }

  /** PATCH /api/usuarios/{id}/status */
  alterarStatus(id: number, status: UsuarioStatus): Observable<Usuario> {
    return this.http
      .patch<Usuario>(`${this.url}/${id}/status`, status)
      .pipe(tratarErro('Falha ao alterar o status do usuário'));
  }

  /** DELETE /api/usuarios/{id} */
  excluir(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.url}/${id}`)
      .pipe(tratarErro('Falha ao excluir o usuário'));
  }
}
