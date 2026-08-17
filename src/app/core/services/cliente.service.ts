import { Injectable, inject, signal } from '@angular/core';
import { Cliente, NovoCliente } from '../models/cliente.model';
import { StatusFunil } from '../models/status-funil.enum';
import { UsuarioService } from './usuario.service';

/**
 * Equivalente mockado de `/api/clientes`, com o mesmo contrato da API:
 * o vendedor entra por id e o nome é resolvido aqui, como faz o relacionamento no backend.
 */
@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly usuarioService = inject(UsuarioService);

  private readonly _clientes = signal<Cliente[]>([
    {
      id: 1,
      nome: 'Mariana Alves Souza',
      email: 'mariana.souza@techdominio.com.br',
      telefone: '(11) 98877-6543',
      vendedorId: 3,
      vendedorNome: 'Ana Beatriz Moraes',
      statusFunil: StatusFunil.NOVO,
      ativo: true,
      criadoEm: new Date(2026, 2, 4),
      atualizadoEm: new Date(2026, 2, 4)
    },
    {
      id: 2,
      nome: 'Rafael Nogueira Lima',
      email: 'rafael.lima@vetorlog.com',
      telefone: '(21) 99654-1200',
      vendedorId: 4,
      vendedorNome: 'Carlos Eduardo Lima',
      statusFunil: StatusFunil.EM_CONTATO,
      ativo: true,
      criadoEm: new Date(2026, 2, 18),
      atualizadoEm: new Date(2026, 3, 1)
    },
    {
      id: 3,
      nome: 'Juliana Prado Bittencourt',
      email: 'juliana.prado@casamineira.com.br',
      telefone: '(31) 98432-7788',
      vendedorId: 5,
      vendedorNome: 'Fernanda Ribeiro',
      statusFunil: StatusFunil.NEGOCIACAO,
      ativo: true,
      criadoEm: new Date(2026, 3, 2),
      atualizadoEm: new Date(2026, 4, 15)
    },
    {
      id: 4,
      nome: 'Eduardo Tavares Ramos',
      email: 'eduardo.ramos@sulconstrutora.com.br',
      telefone: '(41) 99123-4567',
      vendedorId: 3,
      vendedorNome: 'Ana Beatriz Moraes',
      statusFunil: StatusFunil.FECHADO,
      ativo: true,
      criadoEm: new Date(2026, 3, 21),
      atualizadoEm: new Date(2026, 5, 3)
    },
    {
      id: 5,
      nome: 'Patrícia Gomes Ferreira',
      email: 'patricia.ferreira@clinicavida.com.br',
      telefone: '(51) 98765-0099',
      vendedorId: 4,
      vendedorNome: 'Carlos Eduardo Lima',
      statusFunil: StatusFunil.PERDIDO,
      ativo: false,
      criadoEm: new Date(2026, 4, 9),
      atualizadoEm: new Date(2026, 5, 20)
    },
    {
      id: 6,
      nome: 'Bruno Carvalho Martins',
      email: 'bruno.martins@ilhadigital.com',
      telefone: '(48) 99880-2211',
      vendedorId: 5,
      vendedorNome: 'Fernanda Ribeiro',
      statusFunil: StatusFunil.EM_CONTATO,
      ativo: true,
      criadoEm: new Date(2026, 4, 27),
      atualizadoEm: new Date(2026, 4, 27)
    },
    {
      id: 7,
      nome: 'Camila Rodrigues Pinto',
      email: 'camila.pinto@agrocentral.com.br',
      telefone: '(62) 98111-3344',
      vendedorId: 3,
      vendedorNome: 'Ana Beatriz Moraes',
      statusFunil: StatusFunil.NEGOCIACAO,
      ativo: true,
      criadoEm: new Date(2026, 5, 11),
      atualizadoEm: new Date(2026, 6, 8)
    },
    {
      id: 8,
      nome: 'Thiago Mendes Barbosa',
      email: 'thiago.barbosa@barbosafilhos.com.br',
      telefone: '(85) 99444-8877',
      vendedorId: 4,
      vendedorNome: 'Carlos Eduardo Lima',
      statusFunil: StatusFunil.NOVO,
      ativo: true,
      criadoEm: new Date(2026, 6, 1),
      atualizadoEm: new Date(2026, 6, 1)
    }
  ]);

  private proximoId = 9;

  readonly clientes = this._clientes.asReadonly();

  listar(): Cliente[] {
    return this._clientes();
  }

  buscarPorId(id: number): Cliente | undefined {
    return this._clientes().find((cliente) => cliente.id === id);
  }

  criar(cliente: NovoCliente): void {
    const agora = new Date();
    const novo: Cliente = {
      ...cliente,
      id: this.proximoId++,
      vendedorNome: this.nomeDoVendedor(cliente.vendedorId),
      ativo: true,
      criadoEm: agora,
      atualizadoEm: agora
    };

    this._clientes.update((clientes) => [...clientes, novo]);
  }

  atualizar(id: number, cliente: Partial<Cliente>): void {
    this._clientes.update((clientes) =>
      clientes.map((atual) => {
        if (atual.id !== id) {
          return atual;
        }

        return {
          ...atual,
          ...cliente,
          id: atual.id,
          vendedorNome:
            cliente.vendedorId === undefined
              ? atual.vendedorNome
              : this.nomeDoVendedor(cliente.vendedorId),
          atualizadoEm: new Date()
        };
      })
    );
  }

  excluir(id: number): void {
    this._clientes.update((clientes) => clientes.filter((cliente) => cliente.id !== id));
  }

  private nomeDoVendedor(vendedorId: number): string {
    return this.usuarioService.buscarPorId(vendedorId)?.nome ?? '';
  }
}
