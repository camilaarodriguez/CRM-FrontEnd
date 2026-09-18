import { Component, computed, input, output } from '@angular/core';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

/** Controle de paginação reutilizado pelas listagens que consomem Page<T>. */
@Component({
  selector: 'app-paginacao',
  standalone: true,
  imports: [MdbRippleModule],
  templateUrl: './paginacao.component.html'
})
export class PaginacaoComponent {
  readonly paginaAtual = input.required<number>();
  readonly totalPaginas = input.required<number>();
  readonly totalRegistros = input.required<number>();

  readonly mudarPagina = output<number>();

  readonly primeira = computed<boolean>(() => this.paginaAtual() === 0);
  readonly ultima = computed<boolean>(() => this.paginaAtual() >= this.totalPaginas() - 1);

  readonly paginas = computed<number[]>(() =>
    Array.from({ length: this.totalPaginas() }, (_, indice) => indice)
  );

  anterior(): void {
    if (!this.primeira()) {
      this.mudarPagina.emit(this.paginaAtual() - 1);
    }
  }

  proxima(): void {
    if (!this.ultima()) {
      this.mudarPagina.emit(this.paginaAtual() + 1);
    }
  }

  irPara(pagina: number): void {
    if (pagina !== this.paginaAtual()) {
      this.mudarPagina.emit(pagina);
    }
  }
}
