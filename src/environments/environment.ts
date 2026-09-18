export const environment = {
  producao: false,
  /**
   * URL base da API. As services consomem esta URL normalmente via HttpClient;
   * enquanto o backend não estiver disponível, o mockApiInterceptor responde
   * a estas mesmas rotas em memória.
   */
  apiUrl: '/api',
  /** Quando true, o mockApiInterceptor intercepta as chamadas e simula o backend. */
  usarApiMockada: true
};
