/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/* eslint-disable valid-jsdoc */
/**
 * Node wrapper to ensure ShadowDOM safe operation regardless of polyfill
 * presence or mode. Note that with the introduction of `ShadyDOM.noPatch`,
 * a node wrapper must be used to access ShadowDOM API.
 * This is similar to using `Polymer.dom` but relies exclusively
 * on the presence of the ShadyDOM polyfill rather than requiring the loading
 * of legacy (Polymer.dom) API.
 * @type {function(Node):Node}
 */
export const wrap = window['ShadyDOM'] && window['ShadyDOM']['wrap'] ?
  window['ShadyDOM']['wrap'] : n => n;

/**
 * Wraps the node only when in `ShadyDOM` is in `noPatch` mode and not in
 * `on-demand` patching mode. This is more optimal than calling `wrap` for all
 * operations except `appendChild` and `insertBefore` (when the node is being
 * moved from a location where it was logically positioned in the DOM);
 * when setting `className`/`class`; when calling `querySelector|All`;
 * when setting `textContent` or `innerHTML`.
 */
export const wrapIfNeeded = window['ShadyDOM'] && window['ShadyDOM']['wrapIfNeeded'] ?
  window['ShadyDOM']['wrapIfNeeded'] : n => n;