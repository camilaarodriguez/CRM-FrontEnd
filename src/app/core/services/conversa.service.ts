import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Conversa, ConversaFiltro } from '../models/conversa.model';
import { Page, PageRequest } from '../models/page.model';
import { tratarErro } from '../utils/http-error.util';

/**
 * Consome exclusivamente o ConversaController (/api/conversas).
 * Nenhum outro endpoint do backend é acessado por esta service.
 */
@Injectable({ providedIn: 'root' })
export class ConversaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/conversas`;

  /** GET /api/conversas?vendedorId=&page=&size= */
  listar(filtro: ConversaFiltro = {}, paginacao: PageRequest = {}): Observable<Page<Conversa>> {
    let params = new HttpParams()
      .set('page', String(paginacao.page ?? 0))
      .set('size', String(paginacao.size ?? 20));

    if (filtro.vendedorId) {
      params = params.set('vendedorId', String(filtro.vendedorId));
    }

    return this.http
      .get<Page<Conversa>>(this.url, { params })
      .pipe(tratarErro('Falha ao listar as conversas'));
  }

  /** GET /api/conversas/{id} */
  buscarPorId(id: number): Observable<Conversa> {
    return this.http
      .get<Conversa>(`${this.url}/${id}`)
      .pipe(tratarErro('Falha ao carregar a conversa'));
  }
}
