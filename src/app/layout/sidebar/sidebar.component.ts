import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface ItemMenu {
  readonly rota: string;
  readonly rotulo: string;
  readonly icone: string;
  readonly exato: boolean;
  readonly restrito: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly auth = inject(AuthService);

  readonly podeDistribuir = this.auth.podeDistribuir;

  readonly itens: readonly ItemMenu[] = [
    { rota: '/clientes', rotulo: 'Clientes', icone: 'fas fa-users', exato: true, restrito: false },
    {
      rota: '/conversas',
      rotulo: 'Conversas',
      icone: 'fas fa-comments',
      exato: false,
      restrito: false
    },
    { rota: '/equipe', rotulo: 'Equipe', icone: 'fas fa-user-gear', exato: false, restrito: true }
  ];

  itensVisiveis(): readonly ItemMenu[] {
    return this.itens.filter((item) => !item.restrito || this.podeDistribuir());
  }
}
