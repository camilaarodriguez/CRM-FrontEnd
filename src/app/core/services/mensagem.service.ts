import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Mensagem, MensagemCreate } from '../models/mensagem.model';
import { tratarErro } from '../utils/http-error.util';

/**
 * Consome exclusivamente o MensagemController (/api/mensagens).
 * Nenhum outro endpoint do backend é acessado por esta service.
 */
@Injectable({ providedIn: 'root' })
export class MensagemService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/mensagens`;

  /** GET /api/mensagens/conversa/{conversaId} */
  listarPorConversa(conversaId: number): Observable<Mensagem[]> {
    return this.http
      .get<Mensagem[]>(`${this.url}/conversa/${conversaId}`)
      .pipe(tratarErro('Falha ao carregar as mensagens'));
  }

  /** POST /api/mensagens */
  enviar(mensagem: MensagemCreate): Observable<Mensagem> {
    return this.http
      .post<Mensagem>(this.url, mensagem)
      .pipe(tratarErro('Falha ao enviar a mensagem'));
  }
}
