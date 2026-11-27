import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ErrorResponse } from '../models/error-response.model';

/**
 * Escapa texto vindo de dados (nome de cliente, mensagem da API etc.) antes de
 * montá-lo em HTML de alertas, para que nada digitado vire marcação ou script.
 */
export function escaparHtml(texto: string | null | undefined): string {
  return (texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Centraliza o feedback visual da aplicação com SweetAlert2, para que as telas
 * não repitam configuração de alerta e a linguagem seja a mesma em todo lugar.
 */
@Injectable({ providedIn: 'root' })
export class NotificacaoService {
  private readonly corPrimaria = '#1266f1';
  private readonly corPerigo = '#dc4c64';

  /** Aviso discreto no canto da tela, para ações que deram certo. */
  sucesso(titulo: string, texto?: string): void {
    void Swal.fire({
      icon: 'success',
      title: titulo,
      text: texto,
      toast: true,
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }

  /** Alerta que pede atenção, como a sessão que expirou. */
  aviso(titulo: string, texto?: string): void {
    void Swal.fire({
      icon: 'warning',
      title: titulo,
      text: texto,
      confirmButtonColor: this.corPrimaria,
      confirmButtonText: 'Entendi'
    });
  }

  informacao(titulo: string, texto?: string): void {
    void Swal.fire({
      icon: 'info',
      title: titulo,
      text: texto,
      confirmButtonColor: this.corPrimaria,
      confirmButtonText: 'Entendi'
    });
  }

  /**
   * Exibe o erro devolvido pela API, incluindo os detalhes de validação. O texto
   * vindo do servidor é escapado antes de entrar no HTML do alerta, para que nenhum
   * dado digitado por alguém seja interpretado como marcação (XSS).
   */
  erro(erro: ErrorResponse): void {
    const detalhes = erro.detalhes?.length
      ? `<ul class="text-start mb-0 mt-2">${erro.detalhes.map((d) => `<li>${escaparHtml(d)}</li>`).join('')}</ul>`
      : '';

    void Swal.fire({
      icon: 'error',
      title: erro.erro || 'Não foi possível concluir',
      html: `<p class="mb-0">${escaparHtml(erro.mensagem)}</p>${detalhes}`,
      confirmButtonColor: this.corPrimaria,
      confirmButtonText: 'Fechar',
      footer: erro.status ? `<small class="text-muted">HTTP ${erro.status}</small>` : undefined
    });
  }

  /** Confirmação destrutiva: usada antes de excluir registros. */
  confirmarExclusao(titulo: string, texto: string): Promise<SweetAlertResult<unknown>> {
    return Swal.fire({
      icon: 'warning',
      title: titulo,
      html: texto,
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-trash me-2"></i>Excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: this.corPerigo,
      cancelButtonColor: '#9fa6b2',
      reverseButtons: true,
      focusCancel: true
    });
  }

  /** Confirmação neutra, para ações que mudam estado sem apagar nada. */
  confirmarAcao(titulo: string, texto: string, textoBotao = 'Confirmar'): Promise<SweetAlertResult<unknown>> {
    return Swal.fire({
      icon: 'question',
      title: titulo,
      html: texto,
      showCancelButton: true,
      confirmButtonText: textoBotao,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: this.corPrimaria,
      cancelButtonColor: '#9fa6b2',
      reverseButtons: true
    });
  }
}
