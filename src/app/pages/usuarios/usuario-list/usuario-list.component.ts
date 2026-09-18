import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MdbModalModule, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
  USUARIO_ROLE_META,
  USUARIO_ROLE_OPCOES,
  UsuarioRole
} from '../../../core/models/enums/usuario-role.enum';
import { ErrorResponse } from '../../../core/models/error-response.model';
import { Page, paginaVazia } from '../../../core/models/page.model';
import { Usuario } from '../../../core/models/usuario.model';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CarregandoComponent } from '../../../shared/components/carregando/carregando.component';
import { EstadoVazioComponent } from '../../../shared/components/estado-vazio/estado-vazio.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PaginacaoComponent } from '../../../shared/components/paginacao/paginacao.component';
import {
  ResultadoUsuario,
  UsuarioFormModalComponent
} from '../modais/usuario-form-modal.component';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MdbModalModule,
    MdbRippleModule,
    PageHeaderComponent,
    PaginacaoComponent,
    CarregandoComponent,
    EstadoVazioComponent
  ],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.scss'
})
export class UsuarioListComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly notificacao = inject(NotificacaoService);
  private readonly modalService = inject(MdbModalService);

  readonly roleMeta = USUARIO_ROLE_META;
  readonly roleOpcoes = USUARIO_ROLE_OPCOES;

  readonly pagina = signal<Page<Usuario>>(paginaVazia<Usuario>());
  readonly carregando = signal<boolean>(true);
  readonly paginaAtual = signal<number>(0);
  readonly filtroRole = signal<UsuarioRole | null>(null);
  readonly filtroAtivo = signal<boolean | null>(null);
  readonly campoBusca = new FormControl('', { nonNullable: true });

  constructor() {
    this.campoBusca.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => {
        this.paginaAtual.set(0);
        this.carregar();
      });
  }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);

    this.usuarioService
      .listar(
        {
          busca: this.campoBusca.value.trim(),
          role: this.filtroRole(),
          ativo: this.filtroAtivo()
        },
        { page: this.paginaAtual(), size: 8 }
      )
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

  mudarRole(valor: string): void {
    this.filtroRole.set(valor === '' ? null : (valor as UsuarioRole));
    this.paginaAtual.set(0);
    this.carregar();
  }

  mudarSituacao(valor: string): void {
    this.filtroAtivo.set(valor === '' ? null : valor === 'true');
    this.paginaAtual.set(0);
    this.carregar();
  }

  irParaPagina(pagina: number): void {
    this.paginaAtual.set(pagina);
    this.carregar();
  }

  abrirFormulario(usuario: Usuario | null): void {
    const modalRef = this.modalService.open(UsuarioFormModalComponent, {
      data: { usuario },
      modalClass: 'modal-dialog-centered'
    });

    modalRef.onClose.subscribe((resultado: ResultadoUsuario | undefined) => {
      if (!resultado) {
        return;
      }

      if (resultado.modo === 'criar') {
        this.usuarioService.criar(resultado.dados).subscribe({
          next: (criado) => {
            this.notificacao.sucesso('Integrante cadastrado', `${criado.nome} já pode acessar o CRM.`);
            this.carregar();
          },
          error: (erro: ErrorResponse) => this.notificacao.erro(erro)
        });
        return;
      }

      this.usuarioService.atualizar(resultado.id, resultado.dados).subscribe({
        next: (atualizado) => {
          this.notificacao.sucesso('Cadastro atualizado', `Os dados de ${atualizado.nome} foram salvos.`);
          this.carregar();
        },
        error: (erro: ErrorResponse) => this.notificacao.erro(erro)
      });
    });
  }

  async alternarSituacao(usuario: Usuario): Promise<void> {
    const ativando = !usuario.ativo;
    const resposta = await this.notificacao.confirmarAcao(
      ativando ? 'Reativar acesso' : 'Desativar acesso',
      ativando
        ? `<strong>${usuario.nome}</strong> voltará a acessar o CRM e a receber clientes.`
        : `<strong>${usuario.nome}</strong> deixará de acessar o CRM e de receber novos clientes.`,
      ativando ? 'Reativar' : 'Desativar'
    );

    if (!resposta.isConfirmed) {
      return;
    }

    this.usuarioService.alterarStatus(usuario.id, { ativo: ativando }).subscribe({
      next: (atualizado) => {
        this.notificacao.sucesso(
          atualizado.ativo ? 'Acesso reativado' : 'Acesso desativado',
          `${atualizado.nome} foi atualizado.`
        );
        this.carregar();
      },
      error: (erro: ErrorResponse) => this.notificacao.erro(erro)
    });
  }

  async excluir(usuario: Usuario): Promise<void> {
    const resposta = await this.notificacao.confirmarExclusao(
      'Excluir integrante',
      `Tem certeza que deseja excluir <strong>${usuario.nome}</strong>?<br>
       Só é possível excluir quem não tem clientes atribuídos.`
    );

    if (!resposta.isConfirmed) {
      return;
    }

    this.usuarioService.excluir(usuario.id).subscribe({
      next: () => {
        this.notificacao.sucesso('Integrante excluído', `${usuario.nome} saiu da equipe.`);
        this.carregar();
      },
      error: (erro: ErrorResponse) => this.notificacao.erro(erro)
    });
  }
}
