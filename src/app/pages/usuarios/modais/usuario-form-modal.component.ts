import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import {
  USUARIO_ROLE_OPCOES,
  UsuarioRole
} from '../../../core/models/enums/usuario-role.enum';
import { Usuario, UsuarioCreate, UsuarioUpdate } from '../../../core/models/usuario.model';

export type ResultadoUsuario =
  | { modo: 'criar'; dados: UsuarioCreate }
  | { modo: 'editar'; id: number; dados: UsuarioUpdate };

/**
 * Formulário de usuário exibido dentro de um modal do MDB, usado tanto para
 * cadastrar quanto para editar um integrante da equipe.
 */
@Component({
  selector: 'app-usuario-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MdbFormsModule, MdbRippleModule],
  templateUrl: './usuario-form-modal.component.html'
})
export class UsuarioFormModalComponent {
  readonly modalRef = inject<MdbModalRef<UsuarioFormModalComponent>>(MdbModalRef);

  /** Preenchido pelo MdbModalService através da configuração `data`. */
  usuario: Usuario | null = null;

  readonly enviado = signal<boolean>(false);
  readonly opcoesRole = USUARIO_ROLE_OPCOES;

  readonly form = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(150)]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(150)]
    }),
    senha: new FormControl('', { nonNullable: true }),
    role: new FormControl<UsuarioRole | null>(null, { validators: [Validators.required] })
  });

  constructor() {
    // O MdbModalService injeta `data` logo após a construção, por isso o preenchimento
    // é feito no primeiro acesso ao formulário através do método iniciar().
    queueMicrotask(() => this.iniciar());
  }

  private iniciar(): void {
    if (this.usuario === null) {
      this.form.controls.senha.addValidators([Validators.required, Validators.minLength(6)]);
      this.form.controls.senha.updateValueAndValidity();
      return;
    }

    this.form.patchValue({
      nome: this.usuario.nome,
      email: this.usuario.email,
      role: this.usuario.role
    });
    this.form.controls.senha.disable();
  }

  get edicao(): boolean {
    return this.usuario !== null;
  }

  get nome(): FormControl<string> {
    return this.form.controls.nome;
  }

  get email(): FormControl<string> {
    return this.form.controls.email;
  }

  get senha(): FormControl<string> {
    return this.form.controls.senha;
  }

  get role(): FormControl<UsuarioRole | null> {
    return this.form.controls.role;
  }

  confirmar(): void {
    this.enviado.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    if (valores.role === null) {
      return;
    }

    if (this.usuario !== null) {
      const resultado: ResultadoUsuario = {
        modo: 'editar',
        id: this.usuario.id,
        dados: {
          nome: valores.nome.trim(),
          email: valores.email.trim(),
          role: valores.role
        }
      };
      this.modalRef.close(resultado);
      return;
    }

    const resultado: ResultadoUsuario = {
      modo: 'criar',
      dados: {
        nome: valores.nome.trim(),
        email: valores.email.trim(),
        senha: valores.senha,
        role: valores.role
      }
    };
    this.modalRef.close(resultado);
  }

  cancelar(): void {
    this.modalRef.close();
  }
}
