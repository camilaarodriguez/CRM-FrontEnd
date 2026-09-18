import { DatePipe } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  computed,
  inject,
  input,
  signal,
  viewChild
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { Conversa } from '../../../core/models/conversa.model';
import { DirecaoMensagem } from '../../../core/models/enums/direcao-mensagem.enum';
import {
  STATUS_CONVERSA_META,
  StatusConversa
} from '../../../core/models/enums/status-conversa.enum';
import { STATUS_ENTREGA_ICONE, StatusEntrega } from '../../../core/models/enums/status-entrega.enum';
import { TipoMensagem } from '../../../core/models/enums/tipo-mensagem.enum';
import { ErrorResponse } from '../../../core/models/error-response.model';
import { Mensagem } from '../../../core/models/mensagem.model';
import { ConversaService } from '../../../core/services/conversa.service';
import { MensagemService } from '../../../core/services/mensagem.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { CarregandoComponent } from '../../../shared/components/carregando/carregando.component';

@Component({
  selector: 'app-conversa-chat',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    MdbFormsModule,
    MdbRippleModule,
    CarregandoComponent
  ],
  templateUrl: './conversa-chat.component.html',
  styleUrl: './conversa-chat.component.scss'
})
export class ConversaChatComponent implements OnInit, AfterViewChecked {
  private readonly conversaService = inject(ConversaService);
  private readonly mensagemService = inject(MensagemService);
  private readonly notificacao = inject(NotificacaoService);
  private readonly router = inject(Router);

  /** Recebido da rota /conversas/:id por withComponentInputBinding(). */
  readonly id = input.required<string>();

  private readonly painel = viewChild<ElementRef<HTMLDivElement>>('painelMensagens');
  private precisaRolar = false;

  readonly conversa = signal<Conversa | null>(null);
  readonly mensagens = signal<Mensagem[]>([]);
  readonly carregando = signal<boolean>(true);
  readonly enviando = signal<boolean>(false);
  readonly naoEncontrada = signal<boolean>(false);

  readonly statusMeta = STATUS_CONVERSA_META;
  readonly iconeEntrega = STATUS_ENTREGA_ICONE;
  readonly Direcao = DirecaoMensagem;

  readonly conversaFechada = computed<boolean>(() => this.conversa()?.status === StatusConversa.FECHADA);

  /** A conversa aceita apenas texto, por isso o formulário tem um campo só. */
  readonly form = new FormGroup({
    conteudo: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  ngOnInit(): void {
    const identificador = Number(this.id());

    if (!Number.isInteger(identificador)) {
      this.naoEncontrada.set(true);
      this.carregando.set(false);
      return;
    }

    this.carregarConversa(identificador);
  }

  ngAfterViewChecked(): void {
    if (this.precisaRolar) {
      this.rolarParaFim();
      this.precisaRolar = false;
    }
  }

  private carregarConversa(id: number): void {
    this.carregando.set(true);

    this.conversaService.buscarPorId(id).subscribe({
      next: (conversa) => {
        this.conversa.set(conversa);
        this.carregarMensagens(id);
      },
      error: (erro: ErrorResponse) => {
        this.carregando.set(false);
        this.naoEncontrada.set(true);
        this.notificacao.erro(erro);
      }
    });
  }

  private carregarMensagens(conversaId: number): void {
    this.mensagemService.listarPorConversa(conversaId).subscribe({
      next: (mensagens) => {
        this.mensagens.set(mensagens);
        this.carregando.set(false);
        this.precisaRolar = true;
      },
      error: (erro: ErrorResponse) => {
        this.carregando.set(false);
        this.notificacao.erro(erro);
      }
    });
  }

  enviar(): void {
    const conversa = this.conversa();
    if (conversa === null || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { conteudo } = this.form.getRawValue();
    this.enviando.set(true);

    this.mensagemService
      .enviar({ conversaId: conversa.id, tipo: TipoMensagem.TEXTO, conteudo: conteudo.trim() })
      .subscribe({
        next: (mensagem) => {
          this.mensagens.update((atuais) => [...atuais, mensagem]);
          this.form.patchValue({ conteudo: '' });
          this.form.controls.conteudo.markAsUntouched();
          this.enviando.set(false);
          this.precisaRolar = true;
          this.atualizarCabecalho(conversa.id);
        },
        error: (erro: ErrorResponse) => {
          this.enviando.set(false);
          this.notificacao.erro(erro);
        }
      });
  }

  private atualizarCabecalho(conversaId: number): void {
    this.conversaService.buscarPorId(conversaId).subscribe({
      next: (conversa) => this.conversa.set(conversa),
      error: () => undefined
    });
  }

  iconeDoStatus(status: StatusEntrega | null): string {
    return status === null ? '' : this.iconeEntrega[status];
  }

  voltar(): void {
    void this.router.navigate(['/conversas']);
  }

  private rolarParaFim(): void {
    const elemento = this.painel()?.nativeElement;
    if (elemento) {
      elemento.scrollTop = elemento.scrollHeight;
    }
  }
}
