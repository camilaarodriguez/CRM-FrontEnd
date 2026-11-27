import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Restringe as telas de gestão de equipe e distribuição de carteira
 * a quem tem papel de administrador ou gerente. A API aplica a mesma regra
 * (403 para os demais perfis); o guard só evita abrir uma tela que não vai funcionar.
 */
export const distribuicaoGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.sessaoValida()) {
    return router.createUrlTree(['/login']);
  }

  return auth.podeDistribuir() ? true : router.createUrlTree(['/clientes']);
};
