import { HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ErrorResponse } from '../models/error-response.model';

/**
 * Converte qualquer falha de HttpClient no mesmo formato que o
 * GlobalExceptionHandler do backend devolve, para que a interface trate
 * erro de rede e erro de negócio de um jeito só.
 */
export function paraErroApi(erro: HttpErrorResponse, contexto: string): ErrorResponse {
  const corpo = erro.error as Partial<ErrorResponse> | null;

  if (corpo && typeof corpo === 'object' && typeof corpo.mensagem === 'string') {
    return {
      timestamp: corpo.timestamp ?? new Date().toISOString(),
      status: corpo.status ?? erro.status,
      erro: corpo.erro ?? contexto,
      mensagem: corpo.mensagem,
      caminho: corpo.caminho ?? erro.url ?? '',
      detalhes: corpo.detalhes ?? []
    };
  }

  const semConexao = erro.status === 0;
  return {
    timestamp: new Date().toISOString(),
    status: erro.status,
    erro: contexto,
    mensagem: semConexao
      ? 'Não foi possível falar com o servidor. Verifique sua conexão e tente novamente.'
      : erro.message,
    caminho: erro.url ?? '',
    detalhes: []
  };
}

/**
 * Operador para o pipe das services: normaliza o erro e o repassa adiante,
 * deixando a decisão de exibir mensagem para quem assinou o Observable.
 */
export function tratarErro<T>(contexto: string) {
  return (origem: Observable<T>): Observable<T> =>
    origem.pipe(catchError((erro: HttpErrorResponse) => throwError(() => paraErroApi(erro, contexto))));
}
