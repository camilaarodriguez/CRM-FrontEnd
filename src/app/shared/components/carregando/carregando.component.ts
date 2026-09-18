import { Component, input } from '@angular/core';

@Component({
  selector: 'app-carregando',
  standalone: true,
  template: `
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando</span>
      </div>
      <p class="text-muted mt-3 mb-0">{{ mensagem() }}</p>
    </div>
  `
})
export class CarregandoComponent {
  readonly mensagem = input<string>('Carregando informações...');
}
