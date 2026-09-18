/**
 * Espelha o Page<T> devolvido pelo Spring Data nos endpoints paginados
 * (GET /api/clientes, /api/usuarios e /api/conversas).
 */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

/** Parâmetros de paginação aceitos pelo Pageable do Spring. */
export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string;
}

export function paginaVazia<T>(size = 10): Page<T> {
  return {
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size,
    first: true,
    last: true,
    numberOfElements: 0,
    empty: true
  };
}
