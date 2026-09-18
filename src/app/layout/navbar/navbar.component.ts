import { Component, inject, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { USUARIO_ROLE_META } from '../../core/models/enums/usuario-role.enum';
import { AuthService } from '../../core/services/auth.service';
import { NotificacaoService } from '../../core/services/notificacao.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, MdbDropdownModule, MdbRippleModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificacao = inject(NotificacaoService);

  readonly usuario = this.auth.usuario;
  readonly roleMeta = USUARIO_ROLE_META;

  readonly alternarMenu = output<void>();

  async sair(): Promise<void> {
    const resposta = await this.notificacao.confirmarAcao(
      'Encerrar sessão',
      'Você será redirecionado para a tela de login.',
      'Sair'
    );

    if (resposta.isConfirmed) {
      this.auth.logout();
      void this.router.navigate(['/login']);
    }
  }
}
