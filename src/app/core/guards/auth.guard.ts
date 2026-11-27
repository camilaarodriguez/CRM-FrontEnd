import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Bloqueia a área interna enquanto não houver um token válido. A expiração é
 * conferida a cada navegação: token vencido encerra a sessão e volta ao login.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.sessaoValida() ? true : router.createUrlTree(['/login']);
};

/** Telas de login e cadastro: quem já está logado vai direto para a área interna. */
export const visitanteGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.sessaoValida() ? router.createUrlTree(['/clientes']) : true;
};
