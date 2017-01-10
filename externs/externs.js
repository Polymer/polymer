window.Polymer = {};
function Polymer(){}

let customElements = {
  define(){},
  get(){},
  whenDefined(){}
}
window.customElements = customElements;

let HTMLImports = {
  whenReady(){}
};

window.HTMLImports = HTMLImports;

let addEventListener = window.addEventListener;

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

Event.prototype.composed = false;

HTMLElement.prototype.attachShadow = function(){};

/**
 * @record
 */
function CustomStyle(){}
/**
 * @param {!HTMLStyleElement} style
 */
CustomStyle.prototype.processHook = function(style){};

/**
 * @record
 */
function CustomElement(){}
/**
 * @type {Array<string> | undefined}
 */
CustomElement.observedAttributes;
CustomElement.prototype.connectedCallback = function(){};
CustomElement.prototype.disconnectedCallback = function(){};
/**
 * @param {!string} attributeName
 * @param {?string} oldValue
 * @param {?string} newValue
 * @param {?string} namespaceURI
 */
CustomElement.prototype.attributeChangedCallback = function(attributeName, oldValue, newValue, namespaceURI){};

/**
 * @constructor
 * @extends HTMLElement
 */
function HTMLSlotElement(){}

/**
 * @param {{flatten: boolean} | undefined} options
 * @return {Array<Node>}
 */
HTMLSlotElement.prototype.assignedNodes = function(options){};