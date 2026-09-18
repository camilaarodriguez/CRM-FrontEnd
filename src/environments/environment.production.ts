export const environment = {
  producao: true,

  /** URL base da API quando o backend estiver publicado. */
  apiUrl: 'http://localhost:8080/api',

  /**
   * Mantido como `true` para que a entrega funcione sem depender do backend.
   * Ao subir a API, troque para `false`: as services passam a falar com o
   * servidor real sem que nenhuma outra linha do projeto mude.
   */
  usarApiMockada: true
};
