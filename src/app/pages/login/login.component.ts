import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MdbInputDirective } from '../../shared/directives/mdb-input.directive';
import { MdbRippleDirective } from '../../shared/directives/mdb-ripple.directive';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MdbInputDirective, MdbRippleDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly erroLogin = signal<boolean>(false);

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

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, senha } = this.form.getRawValue();

    if (!this.auth.login(email, senha)) {
      this.erroLogin.set(true);
      return;
    }

    this.erroLogin.set(false);
    void this.router.navigate(['/clientes']);
  }
}
