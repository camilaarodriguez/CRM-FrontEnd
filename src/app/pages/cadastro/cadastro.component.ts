import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { ErrorResponse } from '../../core/models/error-response.model';
import { AuthService } from '../../core/services/auth.service';
import { NotificacaoService } from '../../core/services/notificacao.service';

/** Confere se "confirmar senha" é igual à senha digitada. */
const senhasIguais: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
  const senha = grupo.get('senha')?.value as string;
  const confirmacao = grupo.get('confirmacao')?.value as string;
  return senha && confirmacao && senha !== confirmacao ? { senhasDiferentes: true } : null;
};

/**
 * Cadastro público de novos usuários (POST /api/auth/registro). A conta nasce
 * com o perfil de vendedor; a gestão de equipe pode promovê-la depois. Como a API
 * já devolve o token, a pessoa entra no sistema logo após criar a conta.
 */
@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MdbFormsModule, MdbRippleModule],
  templateUrl: './cadastro.component.html',
  styleUrl: '../login/login.component.scss'
})
export class CadastroComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificacao = inject(NotificacaoService);

  readonly enviando = signal<boolean>(false);
  readonly mensagemErro = signal<string>('');
  readonly detalhesErro = signal<string[]>([]);

  readonly form = new FormGroup(
    {
      nome: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(150)]
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email, Validators.maxLength(150)]
      }),
      senha: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(72)]
      }),
      confirmacao: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      })
    },
    { validators: senhasIguais }
  );

  get nome(): FormControl<string> {
    return this.form.controls.nome;
  }

  get email(): FormControl<string> {
    return this.form.controls.email;
  }

  get senha(): FormControl<string> {
    return this.form.controls.senha;
  }

  get confirmacao(): FormControl<string> {
    return this.form.controls.confirmacao;
  }

  get senhasDiferentes(): boolean {
    return this.confirmacao.touched && this.form.hasError('senhasDiferentes');
  }

  cadastrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nome, email, senha } = this.form.getRawValue();
    this.enviando.set(true);
    this.mensagemErro.set('');
    this.detalhesErro.set([]);

    this.auth.registrar({ nome: nome.trim(), email: email.trim(), senha }).subscribe({
      next: (usuario) => {
        this.enviando.set(false);
        this.notificacao.sucesso(`Conta criada! Bem-vindo, ${usuario.nome.split(' ')[0]}.`);
        void this.router.navigate(['/clientes']);
      },
      error: (erro: ErrorResponse) => {
        this.enviando.set(false);
        // 409 (e-mail já cadastrado) e 400 (validação da API) aparecem no formulário.
        this.mensagemErro.set(erro.mensagem);
        this.detalhesErro.set(erro.detalhes ?? []);
      }
    });
  }
}
