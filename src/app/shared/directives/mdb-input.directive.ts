import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * O MDB só monta o "notch" do `.form-outline` nos elementos existentes no carregamento
 * da página. Como o Angular cria os campos dinamicamente, a inicialização é refeita aqui.
 *
 * O MDB também decide se o label sobe apenas quando inicializa o campo e a cada digitação —
 * então valor preenchido depois disso (autofill do navegador, por exemplo) deixaria o label
 * caído por cima do texto. Por isso a classe `active` é sincronizada com o valor real.
 */
@Directive({ selector: '.form-outline' })
export class MdbInputDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      const elemento = this.host.nativeElement;
      const mdb = window.mdb;

      if (mdb !== undefined) {
        new mdb.Input(elemento).init();
      }

      const campo = elemento.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        'input, textarea'
      );
      if (campo === null) {
        return;
      }

      const sincronizarLabel = (): void => {
        campo.classList.toggle('active', campo.value !== '');
      };

      sincronizarLabel();
      campo.addEventListener('input', sincronizarLabel);
      campo.addEventListener('change', sincronizarLabel);
      // disparado pela animação registrada em styles.scss quando o navegador faz autofill
      campo.addEventListener('animationstart', sincronizarLabel);
    });
  }
}
