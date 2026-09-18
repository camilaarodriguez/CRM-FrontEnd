import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbModalModule, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Cliente, ClienteFiltro } from '../../../core/models/cliente.model';
import {
  STATUS_FUNIL_META,
  STATUS_FUNIL_OPCOES,
  StatusFunil
} from '../../../core/models/enums/status-funil.enum';
import { UsuarioRole } from '../../../core/models/enums/usuario-role.enum';
import { ErrorResponse } from '../../../core/models/error-response.model';
import { Page, paginaVazia } from '../../../core/models/page.model';
import { Usuario } from '../../../core/models/usuario.model';
import { AuthService } from '../../../core/services/auth.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CarregandoComponent } from '../../../shared/components/carregando/carregando.component';
import { EstadoVazioComponent } from '../../../shared/components/estado-vazio/estado-vazio.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PaginacaoComponent } from '../../../shared/components/paginacao/paginacao.component';
import { ClienteDetalhesModalComponent } from '../modais/cliente-detalhes-modal.component';
import {
  ReatribuirModalComponent,
  ResultadoReatribuicao
} from '../modais/reatribuir-modal.component';
import { StatusFunilModalComponent } from '../modais/status-funil-modal.component';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    MdbCheckboxModule,
    MdbModalModule,
    MdbRippleModule,
    PageHeaderComponent,
    PaginacaoComponent,
    CarregandoComponent,
    EstadoVazioComponent
  ],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.scss'
})
export class ClienteListComponent implements OnInit {
  private readonly clienteService = inject(ClienteService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly notificacao = inject(NotificacaoService);
  private readonly modalService = inject(MdbModalService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly statusMeta = STATUS_FUNIL_META;
  readonly statusOpcoes = STATUS_FUNIL_OPCOES;
  readonly podeDistribuir = this.auth.podeDistribuir;

  readonly pagina = signal<Page<Cliente>>(paginaVazia<Cliente>());
  readonly vendedores = signal<Usuario[]>([]);
  readonly carregando = signal<boolean>(true);
  readonly paginaAtual = signal<number>(0);

  readonly campoBusca = new FormControl('', { nonNullable: true });
  readonly filtroStatus = signal<StatusFunil | null>(null);
  readonly filtroVendedor = signal<number | null>(null);
  readonly incluirInativos = signal<boolean>(false);

  readonly temFiltro = computed<boolean>(
    () =>
      this.campoBusca.value.trim() !== '' ||
      this.filtroStatus() !== null ||
      this.filtroVendedor() !== null ||
      this.incluirInativos()
  );

  constructor() {
    this.campoBusca.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => {
        this.paginaAtual.set(0);
        this.carregar();
      });
  }

  ngOnInit(): void {
    this.carregarVendedores();
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);

    const filtro: ClienteFiltro = {
      busca: this.campoBusca.value.trim(),
      status: this.filtroStatus(),
      vendedorId: this.filtroVendedor(),
      incluirInativos: this.incluirInativos()
    };

    this.clienteService.listar(filtro, { page: this.paginaAtual(), size: 8 }).subscribe({
      next: (pagina) => {
        this.pagina.set(pagina);
        this.carregando.set(false);
      },
      error: (erro: ErrorResponse) => {
        this.carregando.set(false);
        this.notificacao.erro(erro);
      }
    });
  }

  private carregarVendedores(): void {
    this.usuarioService
      .listar({ role: UsuarioRole.VENDEDOR, ativo: true }, { page: 0, size: 50 })
      .subscribe({
        next: (pagina) => this.vendedores.set(pagina.content),
        error: (erro: ErrorResponse) => this.notificacao.erro(erro)
      });
  }

  mudarStatus(valor: string): void {
    this.filtroStatus.set(valor === '' ? null : (valor as StatusFunil));
    this.paginaAtual.set(0);
    this.carregar();
  }

  mudarVendedor(valor: string): void {
    this.filtroVendedor.set(valor === '' ? null : Number(valor));
    this.paginaAtual.set(0);
    this.carregar();
  }

  alternarInativos(marcado: boolean): void {
    this.incluirInativos.set(marcado);
    this.paginaAtual.set(0);
    this.carregar();
  }

  irParaPagina(pagina: number): void {
    this.paginaAtual.set(pagina);
    this.carregar();
  }

  limparFiltros(): void {
    this.campoBusca.setValue('', { emitEvent: false });
    this.filtroStatus.set(null);
    this.filtroVendedor.set(null);
    this.incluirInativos.set(false);
    this.paginaAtual.set(0);
    this.carregar();
  }

  abrirDetalhes(cliente: Cliente): void {
    const modalRef = this.modalService.open(ClienteDetalhesModalComponent, {
      data: { cliente },
      modalClass: 'modal-lg modal-dialog-centered'
    });

    modalRef.onClose.subscribe((resultado: string | undefined) => {
      if (resultado === 'editar') {
        void this.router.navigate(['/clientes/editar', cliente.id]);
      }
    });
  }

  abrirFunil(cliente: Cliente): void {
    const modalRef = this.modalService.open(StatusFunilModalComponent, {
      data: { cliente },
      modalClass: 'modal-dialog-centered'
    });

    modalRef.onClose.subscribe((status: StatusFunil | undefined) => {
      if (!status) {
        return;
      }

      this.clienteService.avancarStatusFunil(cliente.id, { statusFunil: status }).subscribe({
        next: (atualizado) => {
          this.notificacao.sucesso(
            'Funil atualizado',
            `${atualizado.nome} agora está em ${this.statusMeta[atualizado.statusFunil].rotulo}.`
          );
          this.carregar();
        },
        error: (erro: ErrorResponse) => this.notificacao.erro(erro)
      });
    });
  }

  abrirReatribuicao(cliente: Cliente): void {
    const modalRef = this.modalService.open(ReatribuirModalComponent, {
      data: { cliente, vendedores: this.vendedores() },
      modalClass: 'modal-dialog-centered'
    });

    modalRef.onClose.subscribe((resultado: ResultadoReatribuicao | undefined) => {
      if (!resultado) {
        return;
      }

      this.clienteService.reatribuir(cliente.id, resultado).subscribe({
        next: (atualizado) => {
          this.notificacao.sucesso(
            'Cliente reatribuído',
            `${atualizado.nome} agora é responsabilidade de ${atualizado.vendedorNome}.`
          );
          this.carregar();
        },
        error: (erro: ErrorResponse) => this.notificacao.erro(erro)
      });
    });
  }

  async excluir(cliente: Cliente): Promise<void> {
    const resposta = await this.notificacao.confirmarExclusao(
      'Excluir cliente',
      `Tem certeza que deseja excluir <strong>${cliente.nome}</strong>?<br>
       Ele sai da carteira, mas a conversa e o histórico de mensagens são preservados.`
    );

    if (!resposta.isConfirmed) {
      return;
    }

    this.clienteService.excluir(cliente.id).subscribe({
      next: () => {
        this.notificacao.sucesso('Cliente excluído', `${cliente.nome} saiu da carteira.`);
        if (this.pagina().content.length === 1 && this.paginaAtual() > 0) {
          this.paginaAtual.update((atual) => atual - 1);
        }
        this.carregar();
      },
      error: (erro: ErrorResponse) => this.notificacao.erro(erro)
    });
  }
}
