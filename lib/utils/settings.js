import './boot.js';
import { pathFromUrl } from './resolve-url.js';

/**
 * Legacy settings.
 * @namespace
 * @memberof Polymer
 */
const settings = undefined || {};
export const useShadow = !(window.ShadyDOM);
export const useNativeCSSProperties = Boolean(!window.ShadyCSS || window.ShadyCSS.nativeCss);
export const useNativeCustomElements = !(window.customElements.polyfillWrapFlushCallback);
export { settings as Settings };

/**
 * Globally settable property that is automatically assigned to
 * `Polymer.ElementMixin` instances, useful for binding in templates to
 * make URL's relative to an application's root.  Defaults to the main
 * document URL, but can be overridden by users.  It may be useful to set
 * `Polymer.rootPath` to provide a stable application mount path when
 * using client side routing.
 *
 * @memberof Polymer
 */
let rootPath = undefined ||
  pathFromUrl(document.baseURI || window.location.href);

export { rootPath };

export const setRootPath = function(path) {
  rootPath = path;
};

/**
 * A global callback used to sanitize any value before inserting it into the DOM. The callback signature is:
 *
 *     Polymer = {
 *       sanitizeDOMValue: function(value, name, type, node) { ... }
 *     }
 *
 * Where:
 *
 * `value` is the value to sanitize.
 * `name` is the name of an attribute or property (for example, href).
 * `type` indicates where the value is being inserted: one of property, attribute, or text.
 * `node` is the node where the value is being inserted.
 *
 * @type {(function(*,string,string,Node):*)|undefined}
 * @memberof Polymer
 */
let sanitizeDOMValue = undefined;

export { sanitizeDOMValue };

export const setSanitizeDOMValue = function(newSanitizeDOMValue) {
  sanitizeDOMValue = newSanitizeDOMValue;
};
