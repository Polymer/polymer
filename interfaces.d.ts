/**
 * This file contains the types that are required for compilation of the
 * Polymer generated type declarations, but which could not themselves be
 * automatically generated.
 */

// Types from "externs/polymer-externs.js"

export interface PolymerElementPropertiesMeta {
  type?: Function;
  value?: any;
  readOnly?: boolean;
  computed?: string;
  reflectToAttribute?: boolean;
  notify?: boolean;
  observer?: string|((val: any, old: any) => void);
}

export type PolymerElementProperties = {
  [key: string]: PolymerElementPropertiesMeta|Function;
};

// TODO Document these properties.
export interface PolymerInit {
  is: string;
  extends?: string;
  properties?: PolymerElementProperties;
  observers?: string[];
  _template?: HTMLTemplateElement;
  hostAttributes?: {[key: string]: any};
  listeners?: {[key: string]: string};
  behaviors?: PolymerInit | PolymerInit[];

  // Lifecycle methods
  registered?(): void;
  created?(): void;
  attached?(): void;
  detached?(): void;
  ready?(): void;
  attributeChanged?(name: string, old?: string, value?: string);

  // Allow any other user-defined properties
  [others: string]: any;
}

// Types from "externs/polymer-internal-shared-types.js"

export interface StampedTemplate extends DocumentFragment {
  __noInsertionPoint: boolean;
  nodeList: Node[];
  $: {[key: string]: Node};
  templateInfo?: TemplateInfo;
}

export interface NodeInfo {
  id: string;
  events: {name: string, value: string}[];
  hasInsertionPoint: boolean;
  templateInfo: TemplateInfo;
  parentInfo: NodeInfo;
  parentIndex: number;
  infoIndex: number;
  bindings: Binding[];
}

export interface TemplateInfo {
  nodeInfoList: NodeInfo[];
  nodeList: Node[];
  stripWhitespace: boolean;
  hasInsertionPoint?: boolean;
  hostProps: Object;
  propertyEffects: Object;
  nextTemplateInfo?: TemplateInfo;
  previousTemplateInfo?: TemplateInfo;
  childNodes: Node[];
  wasPreBound: boolean;
}

export interface LiteralBindingPart {
  literal: string;
  compoundIndex?: number;
}

export interface MethodArg {
  literal: boolean;
  name: string;
  value: string|number;
  rootProperty?: string;
  structured?: boolean;
  wildcard?: boolean;
}

export interface MethodSignature {
  methodName: string;
  static: boolean;
  args: MethodArg[];
  dynamicFn?: boolean;
}

export interface ExpressionBindingPart {
  mode: string;
  negate: boolean;
  source: string;
  dependencies: Array<MethodArg|string>;
  customEvent: boolean;
  signature: Object|null;
  event: string;
}

export type BindingPart = LiteralBindingPart|ExpressionBindingPart;

export interface Binding {
  kind: string;
  target: string;
  parts: BindingPart[];
  literal?: string;
  isCompound: boolean;
  listenerEvent?: string;
  listenerNegate?: boolean;
}

export interface AsyncInterface {
  run: (fn: Function, delay?: number) => number;
  cancel: (handle: number) => void;
}

// Types from "lib/utils/gestures.html"

export interface GestureRecognizer {
  reset: () => void;
  mousedown?: (e: MouseEvent) => void;
  mousemove?: (e: MouseEvent) => void;
  mouseup?: (e: MouseEvent) => void;
  touchstart?: (e: TouchEvent) => void;
  touchmove?: (e: TouchEvent) => void;
  touchend?: (e: TouchEvent) => void;
  click?: (e: MouseEvent) => void;
}

/**
 * Not defined in the TypeScript DOM library.
 * See https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline
 */
export interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining(): number;
}
