import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { ErrorResponse } from '../../core/models/error-response.model';
import { AuthService } from '../../core/services/auth.service';
import { NotificacaoService } from '../../core/services/notificacao.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MdbFormsModule, MdbRippleModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificacao = inject(NotificacaoService);

  readonly enviando = signal<boolean>(false);
  readonly mensagemErro = signal<string>('');

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    senha: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)]
    })
  });

  get email(): FormControl<string> {
    return this.form.controls.email;
  }

  get senha(): FormControl<string> {
    return this.form.controls.senha;
  }

  preencherDemonstracao(email: string): void {
    this.form.setValue({ email, senha: '123456' });
  }

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, senha } = this.form.getRawValue();
    this.enviando.set(true);
    this.mensagemErro.set('');

    this.auth.login(email, senha).subscribe({
      next: (usuario) => {
        this.enviando.set(false);
        this.notificacao.sucesso(`Bem-vindo, ${usuario.nome.split(' ')[0]}!`);
        void this.router.navigate(['/clientes']);
      },
      error: (erro: ErrorResponse) => {
        this.enviando.set(false);
        this.mensagemErro.set(erro.mensagem);
        this.notificacao.erro(erro);
      }
    });
  }
}
