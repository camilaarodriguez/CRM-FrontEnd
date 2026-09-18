import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BancoEmMemoriaService } from '../mock/banco-em-memoria.service';

/**
 * Responde às chamadas de /api com o banco em memória enquanto o backend não
 * estiver disponível. As services seguem usando HttpClient normalmente: para
 * ligar a API real basta `usarApiMockada: false` no environment.
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const ehChamadaDaApi = req.url.includes('/api/');

  if (!environment.usarApiMockada || !ehChamadaDaApi) {
    return next(req);
  }

  const banco = inject(BancoEmMemoriaService);
  // Pequena latência para que a interface exerça os estados de carregamento.
  return banco.responder(req).pipe(delay(320));
};
