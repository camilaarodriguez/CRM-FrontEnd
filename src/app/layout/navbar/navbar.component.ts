import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MdbRippleDirective } from '../../shared/directives/mdb-ripple.directive';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, MdbRippleDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly usuario = this.auth.usuario;

  sair(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
