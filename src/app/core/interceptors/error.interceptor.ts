import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { NotificacaoService } from '../services/notificacao.service';
import { paraErroApi } from '../utils/http-error.util';

/**
 * Último elo do tratamento de erros HTTP: registra a falha e avisa o usuário
 * quando o problema não é algo que a tela saiba explicar.
 *
 * - 401 fora do login: o token venceu ou foi recusado. A sessão é encerrada, o
 *   usuário volta para o login com o aviso de sessão expirada e a tela que fez a
 *   chamada não recebe o erro (ela está sendo deixada para trás).
 * - 0 ou 5xx: servidor fora do ar ou erro interno.
 *
 * Os demais erros seguem para a tela, que os exibe no contexto certo: 400 de
 * validação, 403 de perfil sem permissão e 409 de regra de negócio.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificacao = inject(NotificacaoService);
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((erro: HttpErrorResponse) => {
      const erroApi = paraErroApi(erro, 'Falha na comunicação com o servidor');
      console.error(`[HTTP ${erroApi.status}] ${req.method} ${req.urlWithParams}`, erroApi.mensagem);

      const ehRotaDeAutenticacao = req.url.startsWith(`${environment.apiUrl}/auth/`);

      if (erroApi.status === 401 && !ehRotaDeAutenticacao) {
        // Várias requisições podem falhar juntas: só a primeira avisa o usuário.
        const tinhaSessao = auth.autenticado();
        auth.logout();
        if (tinhaSessao) {
          notificacao.aviso('Sessão expirada', 'Faça login novamente para continuar.');
        }
        void router.navigate(['/login']);
        return EMPTY;
      }

      if (erroApi.status === 0 || erroApi.status >= 500) {
        notificacao.erro(erroApi);
      }

      return throwError(() => erro);
    })
  );
};
