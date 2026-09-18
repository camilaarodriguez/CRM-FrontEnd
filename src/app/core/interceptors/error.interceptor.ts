import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificacaoService } from '../services/notificacao.service';
import { paraErroApi } from '../utils/http-error.util';

/**
 * Último elo do tratamento de erros HTTP: registra a falha e avisa o usuário
 * quando o problema não é algo que a tela saiba explicar (queda de rede ou
 * erro interno). Erros de validação e de regra de negócio seguem adiante para
 * que cada tela os exiba no contexto certo.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificacao = inject(NotificacaoService);

  return next(req).pipe(
    catchError((erro: HttpErrorResponse) => {
      const erroApi = paraErroApi(erro, 'Falha na comunicação com o servidor');
      console.error(`[HTTP ${erroApi.status}] ${req.method} ${req.urlWithParams}`, erroApi.mensagem);

      if (erroApi.status === 0 || erroApi.status >= 500) {
        notificacao.erro(erroApi);
      }

      return throwError(() => erro);
    })
  );
};
