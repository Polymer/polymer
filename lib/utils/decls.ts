export {};

declare global {
  interface Event {
    composedPath(): Element[];
  }
  interface EventInit {
    composed?: boolean;
  }
  interface Window {
    ShadyDOM: {};
  }
}

