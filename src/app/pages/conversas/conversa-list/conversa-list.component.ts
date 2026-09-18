import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { Conversa } from '../../../core/models/conversa.model';
import { STATUS_CONVERSA_META } from '../../../core/models/enums/status-conversa.enum';
import { UsuarioRole } from '../../../core/models/enums/usuario-role.enum';
import { ErrorResponse } from '../../../core/models/error-response.model';
import { Page, paginaVazia } from '../../../core/models/page.model';
import { Usuario } from '../../../core/models/usuario.model';
import { AuthService } from '../../../core/services/auth.service';
import { ConversaService } from '../../../core/services/conversa.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CarregandoComponent } from '../../../shared/components/carregando/carregando.component';
import { EstadoVazioComponent } from '../../../shared/components/estado-vazio/estado-vazio.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PaginacaoComponent } from '../../../shared/components/paginacao/paginacao.component';

@Component({
  selector: 'app-conversa-list',
  standalone: true,
  imports: [
    DatePipe,
    MdbRippleModule,
    PageHeaderComponent,
    PaginacaoComponent,
    CarregandoComponent,
    EstadoVazioComponent
  ],
  templateUrl: './conversa-list.component.html',
  styleUrl: './conversa-list.component.scss'
})
export class ConversaListComponent implements OnInit {
  private readonly conversaService = inject(ConversaService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly notificacao = inject(NotificacaoService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly statusMeta = STATUS_CONVERSA_META;
  readonly podeVerTodas = this.auth.podeDistribuir;

  readonly pagina = signal<Page<Conversa>>(paginaVazia<Conversa>(20));
  readonly vendedores = signal<Usuario[]>([]);
  readonly carregando = signal<boolean>(true);
  readonly paginaAtual = signal<number>(0);
  readonly filtroVendedor = signal<number | null>(null);

  readonly totalNaoLidas = computed<number>(() =>
    this.pagina().content.reduce((soma, conversa) => soma + conversa.naoLidas, 0)
  );

  ngOnInit(): void {
    // Vendedor enxerga apenas a própria fila; gestão enxerga a operação inteira.
    if (!this.podeVerTodas()) {
      this.filtroVendedor.set(this.auth.usuario()?.id ?? null);
    } else {
      this.carregarVendedores();
    }

    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);

    this.conversaService
      .listar({ vendedorId: this.filtroVendedor() }, { page: this.paginaAtual(), size: 10 })
      .subscribe({
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

  mudarVendedor(valor: string): void {
    this.filtroVendedor.set(valor === '' ? null : Number(valor));
    this.paginaAtual.set(0);
    this.carregar();
  }

  irParaPagina(pagina: number): void {
    this.paginaAtual.set(pagina);
    this.carregar();
  }

  abrir(conversa: Conversa): void {
    void this.router.navigate(['/conversas', conversa.id]);
  }
}
