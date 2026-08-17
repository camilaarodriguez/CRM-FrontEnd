import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/** Ativa o efeito ripple do MDB nos botões renderizados pelo Angular. */
@Directive({ selector: '[data-mdb-ripple-init]' })
export class MdbRippleDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      const mdb = window.mdb;
      if (mdb === undefined) {
        return;
      }
      new mdb.Ripple(this.host.nativeElement);
    });
  }
}
