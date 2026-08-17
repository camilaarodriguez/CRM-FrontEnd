import { Component, input, output } from '@angular/core';
import { MdbRippleDirective } from '../../directives/mdb-ripple.directive';

/** Modal de confirmação do MDB, controlado por signals (sem depender da API JS do modal). */
@Component({
  selector: 'app-confirm-dialog',
  imports: [MdbRippleDirective],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  readonly aberto = input.required<boolean>();
  readonly titulo = input<string>('Confirmar ação');
  readonly mensagem = input.required<string>();
  readonly destaque = input<string>('');
  readonly complemento = input<string>('');
  readonly textoConfirmar = input<string>('Confirmar');
  readonly textoCancelar = input<string>('Cancelar');
  readonly classeConfirmar = input<string>('btn-danger');

  readonly confirmar = output<void>();
  readonly cancelar = output<void>();
}
