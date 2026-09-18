import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { Cliente } from '../../../core/models/cliente.model';
import { STATUS_FUNIL_META } from '../../../core/models/enums/status-funil.enum';

/** Modal de consulta rápida com a ficha completa do cliente. */
@Component({
  selector: 'app-cliente-detalhes-modal',
  standalone: true,
  imports: [DatePipe, MdbRippleModule],
  templateUrl: './cliente-detalhes-modal.component.html'
})
export class ClienteDetalhesModalComponent {
  readonly modalRef = inject<MdbModalRef<ClienteDetalhesModalComponent>>(MdbModalRef);

  /** Preenchido pelo MdbModalService através da configuração `data`. */
  cliente!: Cliente;

  readonly meta = STATUS_FUNIL_META;

  fechar(): void {
    this.modalRef.close();
  }

  editar(): void {
    this.modalRef.close('editar');
  }
}
