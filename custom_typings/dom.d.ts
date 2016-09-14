declare interface Window {
  customElements: CustomElementRegistry;
}

declare class CustomElementRegistry {
  define(name: string, definition: {prototype: any}): void;
}

declare interface HTMLElement {
  shadowRoot: DocumentFragment;
}
