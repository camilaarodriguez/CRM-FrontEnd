export const environment = {
  producao: false,
  /**
   * URL relativa: em desenvolvimento o `ng serve` repassa /api para o Spring Boot
   * em localhost:8080 (veja proxy.conf.json), e em produção o Nginx faz o mesmo.
   * Assim nenhum endereço de servidor fica fixo no código.
   */
  apiUrl: '/api'
};
