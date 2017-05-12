/**
 * @fileoverview Externs for webcomponents polyfills
 * @externs
 */

let HTMLImports = {
  /**
   * @param {function()} callback
   */
  whenReady(callback){}
};

window.HTMLImports = HTMLImports;

let ShadyDOM = {
  inUse: false,
  flush(){},
  /**
   * @param {!Node} target
   * @param {function(Array<MutationRecord>, MutationObserver)} callback
   * @return {MutationObserver}
   */
  observeChildren(target, callback){},
  /**
   * @param {MutationObserver} observer
   */
  unobserveChildren(observer){},
  /**
   * @param {Node} node
   */
  patch(node){}
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
