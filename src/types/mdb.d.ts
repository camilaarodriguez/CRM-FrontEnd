/**
 * Tipagem mínima do bundle UMD do MDB UI Kit carregado via CDN no index.html.
 * Evita `any` ao inicializar componentes MDB criados dinamicamente pelo Angular.
 */
interface MdbInputInstance {
  init(): void;
}

interface MdbRippleInstance {
  dispose(): void;
}

interface MdbUiKit {
  Input: new (element: Element) => MdbInputInstance;
  Ripple: new (
    element: Element,
    options?: Record<string, string | number | boolean>
  ) => MdbRippleInstance;
}

interface Window {
  readonly mdb?: MdbUiKit;
}
