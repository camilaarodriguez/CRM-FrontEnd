/**
 * Espelha com.crmapi.sistemacrm.model.enums.TipoMensagem.
 *
 * O enum é mantido completo para continuar fiel ao contrato da API, mas a
 * interface só envia mensagens de texto: os demais tipos não são oferecidos.
 */
export enum TipoMensagem {
  TEXTO = 'TEXTO',
  IMAGEM = 'IMAGEM',
  AUDIO = 'AUDIO',
  DOCUMENTO = 'DOCUMENTO',
  LOCALIZACAO = 'LOCALIZACAO'
}
