import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Cliente,
  ClienteCreate,
  ClienteFiltro,
  ClienteReatribuir,
  ClienteStatusFunil,
  ClienteUpdate
} from '../models/cliente.model';
import { Page, PageRequest } from '../models/page.model';
import { tratarErro } from '../utils/http-error.util';

/**
 * Consome exclusivamente o ClienteController (/api/clientes).
 * Nenhum outro endpoint do backend é acessado por esta service.
 */
@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/clientes`;

  /** GET /api/clientes?busca=&status=&vendedorId=&incluirInativos=&page=&size= */
  listar(filtro: ClienteFiltro = {}, paginacao: PageRequest = {}): Observable<Page<Cliente>> {
    let params = new HttpParams()
      .set('page', String(paginacao.page ?? 0))
      .set('size', String(paginacao.size ?? 10));

    if (filtro.busca) {
      params = params.set('busca', filtro.busca);
    }
    if (filtro.status) {
      params = params.set('status', filtro.status);
    }
    if (filtro.vendedorId) {
      params = params.set('vendedorId', String(filtro.vendedorId));
    }
    if (filtro.incluirInativos) {
      params = params.set('incluirInativos', 'true');
    }

    return this.http
      .get<Page<Cliente>>(this.url, { params })
      .pipe(tratarErro('Falha ao listar os clientes'));
  }

  /** GET /api/clientes/{id} */
  buscarPorId(id: number): Observable<Cliente> {
    return this.http
      .get<Cliente>(`${this.url}/${id}`)
      .pipe(tratarErro('Falha ao carregar o cliente'));
  }

  /** POST /api/clientes */
  criar(cliente: ClienteCreate): Observable<Cliente> {
    return this.http
      .post<Cliente>(this.url, cliente)
      .pipe(tratarErro('Falha ao cadastrar o cliente'));
  }

  /** PUT /api/clientes/{id} */
  atualizar(id: number, cliente: ClienteUpdate): Observable<Cliente> {
    return this.http
      .put<Cliente>(`${this.url}/${id}`, cliente)
      .pipe(tratarErro('Falha ao atualizar o cliente'));
  }

  /** PATCH /api/clientes/{id}/status-funil */
  avancarStatusFunil(id: number, status: ClienteStatusFunil): Observable<Cliente> {
    return this.http
      .patch<Cliente>(`${this.url}/${id}/status-funil`, status)
      .pipe(tratarErro('Falha ao mover o cliente no funil'));
  }

  /** PATCH /api/clientes/{id}/reatribuir */
  reatribuir(id: number, dados: ClienteReatribuir): Observable<Cliente> {
    return this.http
      .patch<Cliente>(`${this.url}/${id}/reatribuir`, dados)
      .pipe(tratarErro('Falha ao reatribuir o cliente'));
  }

  /** DELETE /api/clientes/{id} */
  excluir(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.url}/${id}`)
      .pipe(tratarErro('Falha ao excluir o cliente'));
  }
}
