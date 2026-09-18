/** Espelha com.crmapi.sistemacrm.model.enums.UsuarioRole */
export enum UsuarioRole {
  ADMIN = 'ADMIN',
  GERENTE = 'GERENTE',
  VENDEDOR = 'VENDEDOR'
}

export interface UsuarioRoleMeta {
  readonly valor: UsuarioRole;
  readonly rotulo: string;
  readonly classeBadge: string;
}

export const USUARIO_ROLE_META: Readonly<Record<UsuarioRole, UsuarioRoleMeta>> = {
  [UsuarioRole.ADMIN]: {
    valor: UsuarioRole.ADMIN,
    rotulo: 'Administrador',
    classeBadge: 'badge-danger'
  },
  [UsuarioRole.GERENTE]: { valor: UsuarioRole.GERENTE, rotulo: 'Gerente', classeBadge: 'badge-primary' },
  [UsuarioRole.VENDEDOR]: { valor: UsuarioRole.VENDEDOR, rotulo: 'Vendedor', classeBadge: 'badge-info' }
};

export const USUARIO_ROLE_OPCOES: readonly UsuarioRoleMeta[] = Object.values(USUARIO_ROLE_META);
