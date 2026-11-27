export const environment = {
  producao: true,
  /**
   * URL relativa: o build é servido pelo Nginx da EC2, que encaminha /api para o
   * Spring Boot na própria instância. O mesmo build funciona em qualquer IP ou
   * domínio, sem endereço fixo no código.
   */
  apiUrl: '/api'
};
