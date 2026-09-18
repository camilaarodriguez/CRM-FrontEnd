import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Restringe as telas de gestão de equipe e distribuição de carteira
 * a quem tem papel de administrador ou gerente.
 */
export const distribuicaoGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.autenticado()) {
    return router.createUrlTree(['/login']);
  }

  return auth.podeDistribuir() ? true : router.createUrlTree(['/clientes']);
};
