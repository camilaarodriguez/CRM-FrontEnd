import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    // provideAnimations é exigido pelos componentes do MDB Angular.
    provideAnimations(),
    // Ordem importa: o authInterceptor anexa o token antes da requisição sair, e o
    // errorInterceptor trata a resposta (401 encerra a sessão).
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
  ]
};
