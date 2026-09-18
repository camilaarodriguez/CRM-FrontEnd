import { Component, input } from '@angular/core';

@Component({
  selector: 'app-estado-vazio',
  standalone: true,
  template: `
    <div class="text-center py-5">
      <i class="{{ icone() }} fa-3x text-muted mb-3"></i>
      <h6 class="fw-bold mb-1">{{ titulo() }}</h6>
      <p class="text-muted mb-4">{{ descricao() }}</p>
      <ng-content />
    </div>
  `
})
export class EstadoVazioComponent {
  readonly titulo = input.required<string>();
  readonly descricao = input<string>('');
  readonly icone = input<string>('fas fa-inbox');
}
