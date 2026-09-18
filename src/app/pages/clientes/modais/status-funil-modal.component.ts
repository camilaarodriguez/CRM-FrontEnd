import { Component, inject, signal } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { Cliente } from '../../../core/models/cliente.model';
import {
  STATUS_FUNIL_META,
  STATUS_FUNIL_OPCOES,
  StatusFunil
} from '../../../core/models/enums/status-funil.enum';

/** Modal que move o cliente entre as etapas do funil de vendas. */
@Component({
  selector: 'app-status-funil-modal',
  standalone: true,
  imports: [MdbRippleModule],
  templateUrl: './status-funil-modal.component.html',
  styleUrl: './status-funil-modal.component.scss'
})
export class StatusFunilModalComponent {
  readonly modalRef = inject<MdbModalRef<StatusFunilModalComponent>>(MdbModalRef);

  /** Preenchido pelo MdbModalService através da configuração `data`. */
  cliente!: Cliente;

  readonly opcoes = STATUS_FUNIL_OPCOES;
  readonly meta = STATUS_FUNIL_META;
  readonly selecionado = signal<StatusFunil | null>(null);

  etapaAtual(): StatusFunil {
    return this.cliente.statusFunil;
  }

  escolher(status: StatusFunil): void {
    this.selecionado.set(status);
  }

  confirmar(): void {
    const status = this.selecionado();
    if (status !== null && status !== this.cliente.statusFunil) {
      this.modalRef.close(status);
    }
  }

  cancelar(): void {
    this.modalRef.close();
  }
}
