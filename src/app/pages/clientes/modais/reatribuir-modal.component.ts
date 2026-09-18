import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { Cliente } from '../../../core/models/cliente.model';
import { Usuario } from '../../../core/models/usuario.model';

export interface ResultadoReatribuicao {
  novoVendedorId: number;
  motivo: string | null;
}

/**
 * Modal de distribuição de carteira: transfere o cliente para outro vendedor
 * e registra o motivo, alimentando o histórico de atribuições do backend.
 */
@Component({
  selector: 'app-reatribuir-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MdbFormsModule, MdbRippleModule],
  templateUrl: './reatribuir-modal.component.html'
})
export class ReatribuirModalComponent {
  readonly modalRef = inject<MdbModalRef<ReatribuirModalComponent>>(MdbModalRef);

  /** Preenchidos pelo MdbModalService através da configuração `data`. */
  cliente!: Cliente;
  vendedores: Usuario[] = [];

  readonly enviado = signal<boolean>(false);

  readonly form = new FormGroup({
    novoVendedorId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    motivo: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(255)] })
  });

  get novoVendedorId(): FormControl<number | null> {
    return this.form.controls.novoVendedorId;
  }

  vendedoresDisponiveis(): Usuario[] {
    return this.vendedores.filter((vendedor) => vendedor.id !== this.cliente.vendedorId);
  }

  confirmar(): void {
    this.enviado.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { novoVendedorId, motivo } = this.form.getRawValue();
    if (novoVendedorId === null) {
      return;
    }

    const resultado: ResultadoReatribuicao = {
      novoVendedorId,
      motivo: motivo.trim().length > 0 ? motivo.trim() : null
    };
    this.modalRef.close(resultado);
  }

  cancelar(): void {
    this.modalRef.close();
  }
}
