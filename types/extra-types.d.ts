/**
 * This file contains the types that are required for compilation of the
 * Polymer generated type declarations, but which could not themselves be
 * automatically generated.
 */

// Types from "externs/polymer-externs.js"

interface PolymerElementPropertiesMeta {
    type?: Function;
    value?: any;
    readOnly?: boolean;
    computed?: string;
    reflectToAttribute?: boolean;
    notify?: boolean;
    observer?: string|((val: any, old: any) => void);
}

type PolymerElementProperties = {
    [key: string]: PolymerElementPropertiesMeta|Function;
};

// TODO Document these properties.
interface PolymerInit {
    is: string;
    extends?: string;
    properties?: PolymerElementProperties;
    observers?: string[];
    template?: HTMLTemplateElement|string;
    hostAttributes?: {[key: string]: any};
    listeners?: {[key: string]: string};
}

// Types from "externs/polymer-internal-shared-types.js"

interface StampedTemplate extends DocumentFragment {
    __noInsertionPoint: boolean;
    nodeList: Node[];
    $: {[key: string]: Node};
    templateInfo?: TemplateInfo;
}

interface NodeInfo {
    id: string;
    events: {name: string, value: string}[];
    hasInsertionPoint: boolean;
    templateInfo: TemplateInfo;
    parentInfo: NodeInfo;
    parentIndex: number;
    infoIndex: number;
    bindings: Binding[];
}

interface TemplateInfo {
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

interface LiteralBindingPart {
    literal: string;
    compoundIndex?: number;
}

interface MethodArg {
    literal: boolean;
    name: string;
    value: string|number;
    rootProperty?: string;
    structured?: boolean;
    wildcard?: boolean;
}

interface MethodSignature {
    methodName: string;
    static: boolean;
    args: MethodArg[];
    dynamicFn?: boolean;
}

interface ExpressionBindingPart {
    mode: string;
    negate: boolean;
    source: string;
    dependencies: Array<MethodArg|string>;
    customEvent: boolean;
    signature: Object|null;
    event: string;
}

type BindingPart = LiteralBindingPart|ExpressionBindingPart;

interface Binding {
    kind: string;
    target: string;
    parts: BindingPart[];
    literal?: string;
    isCompound: boolean;
    listenerEvent?: string;
    listenerNegate?: boolean;
}

interface AsyncInterface {
    run: (fn: Function, delay?: number) => number;
    cancel: (handle: number) => void;
}

// Types from "lib/utils/gestures.html"

interface GestureRecognizer {
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
interface IdleDeadline {
    didTimeout: boolean;
    timeRemaining(): number;
}

/**
 * Polymer defines its own `Element` class, shadowing the standard global
 * `Element` class. This means that references to `Element` within the `Polymer`
 * namespace inadvertently reference `Polymer.Element`. Here we define an alias
 * of the global `Element`, so that we can reference it from declarations within
 * the `Polymer` namespace.
 *
 * See https://github.com/Microsoft/TypeScript/issues/983 for general discussion
 * of this shadowing problem in TypeScript.
 */
type _Element = Element;
