/**
 * @fileoverview Externs for Polymer, polyfills, and missing stuff in Closure Compiler
 * @externs
 * */

/* externs to upstream to closure compiler */

/**
 * @record
 */
function CustomElement(){}
/** @type {!Array<string> | undefined} */
CustomElement.observedAttributes;
/** @type {function()|undefined} */
CustomElement.prototype.connectedCallback;
/** @type {function()|undefined} */
CustomElement.prototype.disconnectedCallback;
/** @type {function(string, ?string, ?string, ?string)|undefined} */
CustomElement.prototype.attributeChangedCallback;

/** @type {boolean} */
Event.prototype.composed;

/**
 * @return {!Array<!(Element|ShadowRoot|Document|Window)>}
 */
Event.prototype.composedPath = function(){};

/**
 * @param {!{mode: string}} options
 * @return {!ShadowRoot}
 */
HTMLElement.prototype.attachShadow = function(options){};

/**
 * @constructor
 * @extends {HTMLElement}
 */
function HTMLSlotElement(){}

/**
 * @param {!{flatten: boolean}=} options
 * @return {!Array<!Node>}
 */
HTMLSlotElement.prototype.assignedNodes = function(options){};

/** @type {HTMLSlotElement} */
Node.prototype.assignedSlot;

/** @constructor */
function InputDeviceCapabilities(){}

/** @type {boolean} */
InputDeviceCapabilities.prototype.firesTouchEvents;

/** @type {InputDeviceCapabilities} */
MouseEvent.prototype.sourceCapabilities;

const customElements = {
  /**
   * @param {string} tagName
   * @param {!CustomElement} klass
   * @param {Object=} options
   * @return {!CustomElement}
   */
  define(tagName, klass, options){},
  /**
   * @param {string} tagName
   * @return {CustomElement}
   */
  get(tagName){},
  /**
   * @param {string} tagName
   * @return {Promise<!CustomElement>}
   */
  whenDefined(tagName){}
}
window.customElements = customElements;

/* externs to include in webcomponents polyfills */
/**
 * @constructor
 * @extends {HTMLElement}
 */
function CustomStyle(){}
/**
 * @param {!HTMLStyleElement} style
 */
CustomStyle.prototype.processHook = function(style){};

let HTMLImports = {
  /**
   * @param {function()} callback
   */
  whenReady(callback){}
};

window.HTMLImports = HTMLImports;

let ShadyCSS = {
  applyStyle(){},
  updateStyles(){},
  prepareTemplate(){},
  nativeCss: false,
  nativeCssApply: false,
  nativeShadow: false
};
window.ShadyCSS = ShadyCSS;

let ShadyDOM = {
  inUse: false,
  flush(){},
  observeChildren(){},
  unobserveChildren(){},
  patch(){}
};

window.ShadyDOM = ShadyDOM;

let WebComponents = {};
window.WebComponents = WebComponents;

/** @type {Element} */
HTMLElement.prototype._activeElement;

/**
 * @param {HTMLTemplateElement} template
 */
HTMLTemplateElement.prototype.decorate = function(template){};

/**
 * @param {!{is: string}} init
 * @return {!CustomElement}
 */
function Polymer(init){}