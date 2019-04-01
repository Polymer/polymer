/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import './boot.js';

import { pathFromUrl } from './resolve-url.js';
export const useShadow = !(window.ShadyDOM);
export const useNativeCSSProperties = Boolean(!window.ShadyCSS || window.ShadyCSS.nativeCss);
export const useNativeCustomElements = !(window.customElements.polyfillWrapFlushCallback);


/**
 * Globally settable property that is automatically assigned to
 * `ElementMixin` instances, useful for binding in templates to
 * make URL's relative to an application's root.  Defaults to the main
 * document URL, but can be overridden by users.  It may be useful to set
 * `rootPath` to provide a stable application mount path when
 * using client side routing.
 */
export let rootPath = pathFromUrl(document.baseURI || window.location.href);

/**
 * Sets the global rootPath property used by `ElementMixin` and
 * available via `rootPath`.
 *
 * @param {string} path The new root path
 * @return {void}
 */
export const setRootPath = function(path) {
  rootPath = path;
};

/**
 * A global callback used to sanitize any value before inserting it into the DOM.
 * The callback signature is:
 *
 *  function sanitizeDOMValue(value, name, type, node) { ... }
 *
 * Where:
 *
 * `value` is the value to sanitize.
 * `name` is the name of an attribute or property (for example, href).
 * `type` indicates where the value is being inserted: one of property, attribute, or text.
 * `node` is the node where the value is being inserted.
 *
 * @type {(function(*,string,string,Node):*)|undefined}
 */
export let sanitizeDOMValue = window.Polymer && window.Polymer.sanitizeDOMValue || undefined;

/**
 * Sets the global sanitizeDOMValue available via this module's exported
 * `sanitizeDOMValue` variable.
 *
 * @param {(function(*,string,string,Node):*)|undefined} newSanitizeDOMValue the global sanitizeDOMValue callback
 * @return {void}
 */
export const setSanitizeDOMValue = function(newSanitizeDOMValue) {
  sanitizeDOMValue = newSanitizeDOMValue;
};

/**
 * Globally settable property to make Polymer Gestures use passive TouchEvent listeners when recognizing gestures.
 * When set to `true`, gestures made from touch will not be able to prevent scrolling, allowing for smoother
 * scrolling performance.
 * Defaults to `false` for backwards compatibility.
 */
export let passiveTouchGestures = window.Polymer && window.Polymer.passiveTouchGestures || undefined;

/**
 * Sets `passiveTouchGestures` globally for all elements using Polymer Gestures.
 *
 * @param {boolean} usePassive enable or disable passive touch gestures globally
 * @return {void}
 */
export const setPassiveTouchGestures = function(usePassive) {
  passiveTouchGestures = usePassive;
};

/**
 * Setting to ensure Polymer template evaluation only occurs based on tempates
 * defined in trusted script.  When true, `<dom-module>` re-registration is
 * disallowed, `<dom-bind>` is disabled, and `<dom-if>`/`<dom-repeat>`
 * templates will only evaluate in the context of a trusted element template.
 */
export let strictTemplatePolicy = window.Polymer && window.Polymer.strictTemplatePolicy || undefined;

/**
 * Sets `strictTemplatePolicy` globally for all elements
 *
 * @param {boolean} useStrictPolicy enable or disable strict template policy
 *   globally
 * @return {void}
 */
export const setStrictTemplatePolicy = function(useStrictPolicy) {
  strictTemplatePolicy = useStrictPolicy;
};

/**
 * Setting to enable dom-module lookup from Polymer.Element.  By default,
 * templates must be defined in script using the `static get template()`
 * getter and the `html` tag function.  To enable legacy loading of templates
 * via dom-module, set this flag to true.
 */
export let allowTemplateFromDomModule = window.Polymer && window.Polymer.allowTemplateFromDomModule || undefined;

/**
 * Sets `lookupTemplateFromDomModule` globally for all elements
 *
 * @param {boolean} allowDomModule enable or disable template lookup
 *   globally
 * @return {void}
 */
export const setAllowTemplateFromDomModule = function(allowDomModule) {
  allowTemplateFromDomModule = allowDomModule;
};

/**
 * Setting to skip processing style includes and re-writing urls in css styles.
 * Normally "included" styles are pulled into the element and all urls in styles
 * are re-written to be relative to the containing script url.
 * If no includes or relative urls are used in styles, these steps can be
 * skipped as an optimization.
 */
export let legacyOptimizations = window.Polymer && window.Polymer.legacyOptimizations || undefined;

/**
 * Sets `legacyOptimizations` globally for all elements to enable optimizations
 * when only legacy based elements are used.
 *
 * @param {boolean} useLegacyOptimizations enable or disable legacy optimizations
 * includes and url rewriting
 * @return {void}
 */
export const setLegacyOptimizations = function(useLegacyOptimizations) {
  legacyOptimizations = useLegacyOptimizations;
};

/**
 * Setting to add warnings useful when migrating from Polymer 1.x to 2.x.
 */
export let legacyWarnings = window.Polymer && window.Polymer.legacyWarnings || undefined;

/**
 * Sets `legacyWarnings` globally for all elements to migration warnings.
 *
 * @param {boolean} useLegacyWarnings enable or disable warnings
 * @return {void}
 */
export const setLegacyWarnings = function(useLegacyWarnings) {
  legacyWarnings = useLegacyWarnings;
};

/**
 * Setting to perform initial rendering synchronously when running under ShadyDOM.
 * This matches the behavior of Polymer 1.
 */
export let syncInitialRender = window.Polymer && window.Polymer.syncInitialRender || undefined;

/**
 * Sets `syncInitialRender` globally for all elements to enable synchronous
 * initial rendering.
 *
 * @param {boolean} useSyncInitialRender enable or disable synchronous initial
 * rendering globally.
 * @return {void}
 */
export const setSyncInitialRender = function(useSyncInitialRender) {
  syncInitialRender = useSyncInitialRender;
};

/**
 * Setting to retain the legacy Polymer 1 behavior for multi-property
 * observers around undefined values. Observers and computed property methods
 * are not called until no argument is undefined.
 */
export let legacyUndefined = window.Polymer && window.Polymer.legacyUndefined || undefined;

/**
 * Sets `legacyUndefined` globally for all elements to enable legacy
 * multi-property behavior for undefined values.
 *
 * @param {boolean} useLegacyUndefined enable or disable legacy
 * multi-property behavior for undefined.
 * @return {void}
 */
export const setLegacyUndefined = function(useLegacyUndefined) {
  legacyUndefined = useLegacyUndefined;
};

/**
 * Setting to retain the legacy Polymer 1 behavior for setting properties. Does
 * not batch property sets.
 */
export let legacyNoBatch = window.Polymer && window.Polymer.legacyNoBatch || undefined;

/**
 * Sets `legacyNoBatch` globally for all elements to enable legacy
 * behavior for setting properties.
 *
 * @param {boolean} useLegacyNoBatch enable or disable legacy
 * property setting behavior.
 * @return {void}
 */
export const setLegacyNoBatch = function(useLegacyNoBatch) {
  legacyNoBatch = useLegacyNoBatch;
};

/**
 * Setting to revert to the legacy Polymer 1 order for when notifying properties
 * fire change events with respect to other effects.  In Polymer 1.x they fire
 * before observers; in 2.x they fire after all other effect types.
 */
export let legacyNotifyOrder = window.Polymer && window.Polymer.legacyNotifyOrder || undefined;

/**
 * Sets `legacyNotifyOrder` globally for all elements to enable legacy
 * notify order.
 *
 * @param {boolean} useLegacyNotifyOrder enable or disable legacy notify order
 * @return {void}
 */
export const setLegacyNotifyOrder = function(useLegacyNotifyOrder) {
  legacyNotifyOrder = useLegacyNotifyOrder;
};
