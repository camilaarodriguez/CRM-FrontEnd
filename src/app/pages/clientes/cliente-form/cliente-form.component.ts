import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { Cliente, ClienteCreate, ClienteUpdate } from '../../../core/models/cliente.model';
import {
  STATUS_FUNIL_OPCOES,
  StatusFunil
} from '../../../core/models/enums/status-funil.enum';
import { UsuarioRole } from '../../../core/models/enums/usuario-role.enum';
import { ErrorResponse } from '../../../core/models/error-response.model';
import { Usuario } from '../../../core/models/usuario.model';
import { ClienteService } from '../../../core/services/cliente.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CarregandoComponent } from '../../../shared/components/carregando/carregando.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

/** Atende /clientes/novo e /clientes/editar/:id com o mesmo formulário. */
@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MdbFormsModule,
    MdbRippleModule,
    PageHeaderComponent,
    CarregandoComponent
  ],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.scss'
})
export class ClienteFormComponent implements OnInit {
  private readonly rota = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clienteService = inject(ClienteService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly notificacao = inject(NotificacaoService);

  readonly statusOpcoes = STATUS_FUNIL_OPCOES;
  readonly vendedores = signal<Usuario[]>([]);
  readonly carregando = signal<boolean>(false);
  readonly salvando = signal<boolean>(false);
  readonly naoEncontrado = signal<boolean>(false);

  readonly clienteId = signal<number | null>(null);
  readonly edicao = computed<boolean>(() => this.clienteId() !== null);
  readonly titulo = computed<string>(() => (this.edicao() ? 'Editar cliente' : 'Novo cliente'));

  readonly form = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(150)]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(150)]
    }),
    telefone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(20)]
    }),
    documento: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(18)] }),
    empresa: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(150)] }),
    observacoes: new FormControl('', { nonNullable: true }),
    vendedorId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    statusFunil: new FormControl<StatusFunil>(StatusFunil.NOVO, { nonNullable: true })
  });

  get nome(): FormControl<string> {
    return this.form.controls.nome;
  }

  get email(): FormControl<string> {
    return this.form.controls.email;
  }

  get telefone(): FormControl<string> {
    return this.form.controls.telefone;
  }

  get vendedorId(): FormControl<number | null> {
    return this.form.controls.vendedorId;
  }

  ngOnInit(): void {
    this.carregarVendedores();

    const parametro = this.rota.snapshot.paramMap.get('id');
    if (parametro === null) {
      return;
    }

    const id = Number(parametro);
    if (!Number.isInteger(id)) {
      this.naoEncontrado.set(true);
      return;
    }

    this.clienteId.set(id);
    this.carregarCliente(id);
  }

  private carregarVendedores(): void {
    this.usuarioService
      .listar({ role: UsuarioRole.VENDEDOR, ativo: true }, { page: 0, size: 50 })
      .subscribe({
        next: (pagina) => this.vendedores.set(pagina.content),
        error: (erro: ErrorResponse) => this.notificacao.erro(erro)
      });
  }

  private carregarCliente(id: number): void {
    this.carregando.set(true);

    this.clienteService.buscarPorId(id).subscribe({
      next: (cliente) => {
        this.preencher(cliente);
        this.carregando.set(false);
      },
      error: (erro: ErrorResponse) => {
        this.carregando.set(false);
        this.naoEncontrado.set(true);
        this.notificacao.erro(erro);
      }
    });
  }

  private preencher(cliente: Cliente): void {
    this.form.setValue({
      nome: cliente.nome,
      email: cliente.email ?? '',
      telefone: cliente.telefone,
      documento: cliente.documento ?? '',
      empresa: cliente.empresa ?? '',
      observacoes: cliente.observacoes ?? '',
      vendedorId: cliente.vendedorId,
      statusFunil: cliente.statusFunil
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificacao.informacao(
        'Revise o formulário',
        'Alguns campos obrigatórios ainda precisam ser preenchidos.'
      );
      return;
    }

    const valores = this.form.getRawValue();
    if (valores.vendedorId === null) {
      return;
    }

    this.salvando.set(true);
    const id = this.clienteId();

    if (id !== null) {
      const dados: ClienteUpdate = {
        nome: valores.nome.trim(),
        email: valores.email.trim(),
        telefone: valores.telefone.trim(),
        documento: this.ouNulo(valores.documento),
        empresa: this.ouNulo(valores.empresa),
        observacoes: this.ouNulo(valores.observacoes),
        vendedorId: valores.vendedorId
      };

      this.clienteService.atualizar(id, dados).subscribe({
        next: (cliente) => this.aoSalvar(`${cliente.nome} foi atualizado.`),
        error: (erro: ErrorResponse) => this.aoFalhar(erro)
      });
      return;
    }

    const dados: ClienteCreate = {
      nome: valores.nome.trim(),
      email: valores.email.trim(),
      telefone: valores.telefone.trim(),
      documento: this.ouNulo(valores.documento),
      empresa: this.ouNulo(valores.empresa),
      observacoes: this.ouNulo(valores.observacoes),
      vendedorId: valores.vendedorId,
      statusFunil: valores.statusFunil
    };

    this.clienteService.criar(dados).subscribe({
      next: (cliente) =>
        this.aoSalvar(`${cliente.nome} entrou na carteira de ${cliente.vendedorNome}.`),
      error: (erro: ErrorResponse) => this.aoFalhar(erro)
    });
  }

  voltar(): void {
    void this.router.navigate(['/clientes']);
  }

  private aoSalvar(mensagem: string): void {
    this.salvando.set(false);
    this.notificacao.sucesso('Cadastro salvo', mensagem);
    this.voltar();
  }

  private aoFalhar(erro: ErrorResponse): void {
    this.salvando.set(false);
    this.notificacao.erro(erro);
  }

  private ouNulo(valor: string): string | null {
    const texto = valor.trim();
    return texto.length > 0 ? texto : null;
  }
}
