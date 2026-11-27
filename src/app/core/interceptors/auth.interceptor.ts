import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

/**
 * Anexa o JWT da sessão em toda chamada à API, no cabeçalho
 * "Authorization: Bearer <token>". O token só vai para a própria API: chamadas
 * para outros endereços e as rotas públicas de login e cadastro seguem sem ele.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const ehChamadaDaApi = req.url.startsWith(environment.apiUrl);
  const ehRotaPublica = req.url.startsWith(`${environment.apiUrl}/auth/`);

  if (!ehChamadaDaApi || ehRotaPublica) {
    return next(req);
  }

  const token = inject(AuthService).token();
  if (!token) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
