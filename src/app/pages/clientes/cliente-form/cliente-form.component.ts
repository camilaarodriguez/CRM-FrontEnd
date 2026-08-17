import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NovoCliente } from '../../../core/models/cliente.model';
import { STATUS_FUNIL_OPCOES, StatusFunil } from '../../../core/models/status-funil.enum';
import { ClienteService } from '../../../core/services/cliente.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { MdbInputDirective } from '../../../shared/directives/mdb-input.directive';
import { MdbRippleDirective } from '../../../shared/directives/mdb-ripple.directive';

/** Atende `/clientes/novo` e `/clientes/editar/:id` — o modo é definido pelo parâmetro da rota. */
@Component({
  selector: 'app-cliente-form',
  imports: [ReactiveFormsModule, PageHeaderComponent, MdbInputDirective, MdbRippleDirective],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.scss'
})
export class ClienteFormComponent {
  private readonly rota = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clienteService = inject(ClienteService);
  private readonly usuarioService = inject(UsuarioService);

  readonly statusOpcoes = STATUS_FUNIL_OPCOES;
  readonly vendedores = this.usuarioService.vendedores;

  readonly clienteId = signal<number | null>(this.lerIdDaRota());
  readonly edicao = computed<boolean>(() => this.clienteId() !== null);
  readonly titulo = computed<string>(() => (this.edicao() ? 'Editar Cliente' : 'Novo Cliente'));
  readonly naoEncontrado = signal<boolean>(false);
  readonly salvo = signal<boolean>(false);

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
    statusFunil: new FormControl<StatusFunil>(StatusFunil.NOVO, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    vendedorId: new FormControl<number | null>(null, { validators: [Validators.required] })
  });

  constructor() {
    const id = this.clienteId();
    if (id === null) {
      return;
    }

    const cliente = this.clienteService.buscarPorId(id);
    if (cliente === undefined) {
      this.naoEncontrado.set(true);
      this.form.disable();
      return;
    }

    this.form.setValue({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone ?? '',
      statusFunil: cliente.statusFunil,
      vendedorId: cliente.vendedorId
    });
  }

  get nome(): FormControl<string> {
    return this.form.controls.nome;
  }

  get email(): FormControl<string> {
    return this.form.controls.email;
  }

  get telefone(): FormControl<string> {
    return this.form.controls.telefone;
  }

  get statusFunil(): FormControl<StatusFunil> {
    return this.form.controls.statusFunil;
  }

  get vendedorId(): FormControl<number | null> {
    return this.form.controls.vendedorId;
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    if (valores.vendedorId === null) {
      return;
    }

    const dados: NovoCliente = {
      nome: valores.nome.trim(),
      email: valores.email.trim(),
      telefone: valores.telefone.trim() || undefined,
      statusFunil: valores.statusFunil,
      vendedorId: valores.vendedorId
    };

    const id = this.clienteId();
    if (id !== null) {
      this.clienteService.atualizar(id, dados);
    } else {
      this.clienteService.criar(dados);
    }

    this.salvo.set(true);
    setTimeout(() => this.voltar(), 900);
  }

  voltar(): void {
    void this.router.navigate(['/clientes']);
  }

  private lerIdDaRota(): number | null {
    const parametro = this.rota.snapshot.paramMap.get('id');
    if (parametro === null) {
      return null;
    }

    const id = Number(parametro);
    return Number.isInteger(id) ? id : null;
  }
}
