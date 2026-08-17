import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cliente } from '../../../core/models/cliente.model';
import {
  STATUS_FUNIL_META,
  STATUS_FUNIL_OPCOES,
  StatusFunil
} from '../../../core/models/status-funil.enum';
import { ClienteService } from '../../../core/services/cliente.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { MdbRippleDirective } from '../../../shared/directives/mdb-ripple.directive';

type FiltroStatus = StatusFunil | 'TODOS';

@Component({
  selector: 'app-cliente-list',
  imports: [RouterLink, PageHeaderComponent, ConfirmDialogComponent, MdbRippleDirective],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.scss'
})
export class ClienteListComponent {
  private readonly clienteService = inject(ClienteService);

  readonly statusMeta = STATUS_FUNIL_META;
  readonly statusOpcoes = STATUS_FUNIL_OPCOES;

  readonly clientes = this.clienteService.clientes;
  readonly termoBusca = signal<string>('');
  readonly filtroStatus = signal<FiltroStatus>('TODOS');
  readonly incluirInativos = signal<boolean>(false);
  readonly clienteParaExcluir = signal<Cliente | null>(null);

  /** Mesmos critérios da ClienteSpecification: busca por nome ou e-mail, status e inativos. */
  readonly clientesFiltrados = computed<Cliente[]>(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    const status = this.filtroStatus();
    const incluirInativos = this.incluirInativos();

    return this.clientes().filter((cliente) => {
      const casaTermo =
        termo === '' ||
        cliente.nome.toLowerCase().includes(termo) ||
        cliente.email.toLowerCase().includes(termo);
      const casaStatus = status === 'TODOS' || cliente.statusFunil === status;
      const casaAtivo = incluirInativos || cliente.ativo;

      return casaTermo && casaStatus && casaAtivo;
    });
  });

  readonly temFiltroAtivo = computed<boolean>(
    () =>
      this.termoBusca().trim() !== '' || this.filtroStatus() !== 'TODOS' || this.incluirInativos()
  );

  buscar(evento: Event): void {
    const campo = evento.target as HTMLInputElement;
    this.termoBusca.set(campo.value);
  }

  filtrarPorStatus(evento: Event): void {
    const campo = evento.target as HTMLSelectElement;
    this.filtroStatus.set(campo.value as FiltroStatus);
  }

  alternarInativos(evento: Event): void {
    const campo = evento.target as HTMLInputElement;
    this.incluirInativos.set(campo.checked);
  }

  limparFiltros(): void {
    this.termoBusca.set('');
    this.filtroStatus.set('TODOS');
    this.incluirInativos.set(false);
  }

  pedirExclusao(cliente: Cliente): void {
    this.clienteParaExcluir.set(cliente);
  }

  cancelarExclusao(): void {
    this.clienteParaExcluir.set(null);
  }

  confirmarExclusao(): void {
    const cliente = this.clienteParaExcluir();
    if (cliente === null) {
      return;
    }

    this.clienteService.excluir(cliente.id);
    this.clienteParaExcluir.set(null);
  }
}
