/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import '../utils/boot.js';

import '../utils/settings.js';
import { FlattenedNodesObserver } from '../utils/flattened-nodes-observer.js';
export { flush, enqueueDebouncer as addDebouncer } from '../utils/flush.js';
/* eslint-disable no-unused-vars */
import { Debouncer } from '../utils/debounce.js';  // used in type annotations
/* eslint-enable no-unused-vars */

const p = Element.prototype;
/**
 * @const {function(this:Node, string): boolean}
 */
const normalizedMatchesSelector = p.matches || p.matchesSelector ||
  p.mozMatchesSelector || p.msMatchesSelector ||
  p.oMatchesSelector || p.webkitMatchesSelector;

/**
 * Cross-platform `element.matches` shim.
 *
 * @function matchesSelector
 * @param {!Node} node Node to check selector against
 * @param {string} selector Selector to match
 * @return {boolean} True if node matched selector
 */
export const matchesSelector = function(node, selector) {
  return normalizedMatchesSelector.call(node, selector);
};

/**
 * Node API wrapper class returned from `Polymer.dom.(target)` when
 * `target` is a `Node`.
 *
 */
export class DomApi {

  /**
   * @param {Node} node Node for which to create a Polymer.dom helper object.
   */
  constructor(node) {
    this.node = node;
  }

  /**
   * Returns an instance of `FlattenedNodesObserver` that
   * listens for node changes on this element.
   *
   * @param {function(this:HTMLElement, { target: !HTMLElement, addedNodes: !Array<!Element>, removedNodes: !Array<!Element> }):void} callback Called when direct or distributed children
   *   of this element changes
   * @return {!FlattenedNodesObserver} Observer instance
   */
  observeNodes(callback) {
    return new FlattenedNodesObserver(
        /** @type {!HTMLElement} */(this.node), callback);
  }

  /**
   * Disconnects an observer previously created via `observeNodes`
   *
   * @param {!FlattenedNodesObserver} observerHandle Observer instance
   *   to disconnect.
   * @return {void}
   */
  unobserveNodes(observerHandle) {
    observerHandle.disconnect();
  }

  /**
   * Provided as a backwards-compatible API only.  This method does nothing.
   * @return {void}
   */
  notifyObserver() {}

  /**
   * Returns true if the provided node is contained with this element's
   * light-DOM children or shadow root, including any nested shadow roots
   * of children therein.
   *
   * @param {Node} node Node to test
   * @return {boolean} Returns true if the given `node` is contained within
   *   this element's light or shadow DOM.
   */
  deepContains(node) {
    if (this.node.contains(node)) {
      return true;
    }
    let n = node;
    let doc = node.ownerDocument;
    // walk from node to `this` or `document`
    while (n && n !== doc && n !== this.node) {
      // use logical parentnode, or native ShadowRoot host
      n = n.parentNode || n.host;
    }
    return n === this.node;
  }

  /**
   * Returns the root node of this node.  Equivalent to `getRootNode()`.
   *
   * @return {Node} Top most element in the dom tree in which the node
   * exists. If the node is connected to a document this is either a
   * shadowRoot or the document; otherwise, it may be the node
   * itself or a node or document fragment containing it.
   */
  getOwnerRoot() {
    return this.node.getRootNode();
  }

  /**
   * For slot elements, returns the nodes assigned to the slot; otherwise
   * an empty array. It is equivalent to `<slot>.addignedNodes({flatten:true})`.
   *
   * @return {!Array<!Node>} Array of assigned nodes
   */
  getDistributedNodes() {
    return (this.node.localName === 'slot') ?
      this.node.assignedNodes({flatten: true}) :
      [];
  }

  /**
   * Returns an array of all slots this element was distributed to.
   *
   * @return {!Array<!HTMLSlotElement>} Description
   */
  getDestinationInsertionPoints() {
    let ip$ = [];
    let n = this.node.assignedSlot;
    while (n) {
      ip$.push(n);
      n = n.assignedSlot;
    }
    return ip$;
  }

  /**
   * Calls `importNode` on the `ownerDocument` for this node.
   *
   * @param {!Node} node Node to import
   * @param {boolean} deep True if the node should be cloned deeply during
   *   import
   * @return {Node} Clone of given node imported to this owner document
   */
  importNode(node, deep) {
    let doc = this.node instanceof Document ? this.node :
      this.node.ownerDocument;
    return doc.importNode(node, deep);
  }

  /**
   * @return {!Array<!Node>} Returns a flattened list of all child nodes and
   * nodes assigned to child slots.
   */
  getEffectiveChildNodes() {
    return FlattenedNodesObserver.getFlattenedNodes(
        /** @type {!HTMLElement} */ (this.node));
  }

  /**
   * Returns a filtered list of flattened child elements for this element based
   * on the given selector.
   *
   * @param {string} selector Selector to filter nodes against
   * @return {!Array<!HTMLElement>} List of flattened child elements
   */
  queryDistributedElements(selector) {
    let c$ = this.getEffectiveChildNodes();
    let list = [];
    for (let i=0, l=c$.length, c; (i<l) && (c=c$[i]); i++) {
      if ((c.nodeType === Node.ELEMENT_NODE) &&
          matchesSelector(c, selector)) {
        list.push(c);
      }
    }
    return list;
  }

  /**
   * For shadow roots, returns the currently focused element within this
   * shadow root.
   *
   * @return {Node|undefined} Currently focused element
   */
  get activeElement() {
    let node = this.node;
    return node._activeElement !== undefined ? node._activeElement : node.activeElement;
  }
}

function forwardMethods(proto, methods) {
  for (let i=0; i < methods.length; i++) {
    let method = methods[i];
    /* eslint-disable valid-jsdoc */
    proto[method] = /** @this {DomApi} */ function() {
      return this.node[method].apply(this.node, arguments);
    };
    /* eslint-enable */
  }
}

function forwardReadOnlyProperties(proto, properties) {
  for (let i=0; i < properties.length; i++) {
    let name = properties[i];
    Object.defineProperty(proto, name, {
      get: function() {
        const domApi = /** @type {DomApi} */(this);
        return domApi.node[name];
      },
      configurable: true
    });
  }
}

function forwardProperties(proto, properties) {
  for (let i=0; i < properties.length; i++) {
    let name = properties[i];
    Object.defineProperty(proto, name, {
      /**
       * @this {DomApi}
       * @return {*} .
       */
      get: function() {
        return this.node[name];
      },
      /**
       * @this {DomApi}
       * @param {*} value .
       */
      set: function(value) {
        this.node[name] = value;
      },
      configurable: true
    });
  }
}


/**
 * Event API wrapper class returned from `dom.(target)` when
 * `target` is an `Event`.
 */
export class EventApi {
  constructor(event) {
    this.event = event;
  }

  /**
   * Returns the first node on the `composedPath` of this event.
   *
   * @return {!EventTarget} The node this event was dispatched to
   */
  get rootTarget() {
    return this.event.composedPath()[0];
  }

  /**
   * Returns the local (re-targeted) target for this event.
   *
   * @return {!EventTarget} The local (re-targeted) target for this event.
   */
  get localTarget() {
    return this.event.target;
  }

  /**
   * Returns the `composedPath` for this event.
   * @return {!Array<!EventTarget>} The nodes this event propagated through
   */
  get path() {
    return this.event.composedPath();
  }
}

/**
 * @function
 * @param {boolean=} deep
 * @return {!Node}
 */
DomApi.prototype.cloneNode;
/**
 * @function
 * @param {!Node} node
 * @return {!Node}
 */
DomApi.prototype.appendChild;
/**
 * @function
 * @param {!Node} newChild
 * @param {Node} refChild
 * @return {!Node}
 */
DomApi.prototype.insertBefore;
/**
 * @function
 * @param {!Node} node
 * @return {!Node}
 */
DomApi.prototype.removeChild;
/**
 * @function
 * @param {!Node} oldChild
 * @param {!Node} newChild
 * @return {!Node}
 */
DomApi.prototype.replaceChild;
/**
 * @function
 * @param {string} name
 * @param {string} value
 * @return {void}
 */
DomApi.prototype.setAttribute;
/**
 * @function
 * @param {string} name
 * @return {void}
 */
DomApi.prototype.removeAttribute;
/**
 * @function
 * @param {string} selector
 * @return {?Element}
 */
DomApi.prototype.querySelector;
/**
 * @function
 * @param {string} selector
 * @return {!NodeList<!Element>}
 */
DomApi.prototype.querySelectorAll;

/** @type {?Node} */
DomApi.prototype.parentNode;
/** @type {?Node} */
DomApi.prototype.firstChild;
/** @type {?Node} */
DomApi.prototype.lastChild;
/** @type {?Node} */
DomApi.prototype.nextSibling;
/** @type {?Node} */
DomApi.prototype.previousSibling;
/** @type {?HTMLElement} */
DomApi.prototype.firstElementChild;
/** @type {?HTMLElement} */
DomApi.prototype.lastElementChild;
/** @type {?HTMLElement} */
DomApi.prototype.nextElementSibling;
/** @type {?HTMLElement} */
DomApi.prototype.previousElementSibling;
/** @type {!Array<!Node>} */
DomApi.prototype.childNodes;
/** @type {!Array<!HTMLElement>} */
DomApi.prototype.children;
/** @type {?DOMTokenList} */
DomApi.prototype.classList;

/** @type {string} */
DomApi.prototype.textContent;
/** @type {string} */
DomApi.prototype.innerHTML;

forwardMethods(DomApi.prototype, [
  'cloneNode', 'appendChild', 'insertBefore', 'removeChild',
  'replaceChild', 'setAttribute', 'removeAttribute',
  'querySelector', 'querySelectorAll'
]);

forwardReadOnlyProperties(DomApi.prototype, [
  'parentNode', 'firstChild', 'lastChild',
  'nextSibling', 'previousSibling', 'firstElementChild',
  'lastElementChild', 'nextElementSibling', 'previousElementSibling',
  'childNodes', 'children', 'classList'
]);

forwardProperties(DomApi.prototype, [
  'textContent', 'innerHTML'
]);

/**
 * Legacy DOM and Event manipulation API wrapper factory used to abstract
 * differences between native Shadow DOM and "Shady DOM" when polyfilling on
 * older browsers.
 *
 * Note that in Polymer 2.x use of `Polymer.dom` is no longer required and
 * in the majority of cases simply facades directly to the standard native
 * API.
 *
 * @summary Legacy DOM and Event manipulation API wrapper factory used to
 * abstract differences between native Shadow DOM and "Shady DOM."
 * @param {(Node|Event)=} obj Node or event to operate on
 * @return {!DomApi|!EventApi} Wrapper providing either node API or event API
 */
export const dom = function(obj) {
  obj = obj || document;
  if (!obj.__domApi) {
    let helper;
    if (obj instanceof Event) {
      helper = new EventApi(obj);
    } else {
      helper = new DomApi(obj);
    }
    obj.__domApi = helper;
  }
  return obj.__domApi;
};
