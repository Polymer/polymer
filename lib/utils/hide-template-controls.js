/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/**
 * @fileoverview
 *
 * Module to hide `<dom-bind>`, `<dom-if>`, and `<dom-repeat>` elements
 * optimally in ShadyDOM
 */

import {legacyOptimizations, useShadow} from './settings.js';

let elementsHidden = false;

/**
 * @return {boolean} True if elements will be hidden globally
 */
export function hideElementsGlobally() {
  if (legacyOptimizations && !useShadow) {
    if (!elementsHidden) {
      elementsHidden = true;
      const style = document.createElement('style');
      style.textContent = 'dom-bind,dom-if,dom-repeat{display:none;}';
      document.head.appendChild(style);
    }
    return true;
  }
  return false;
}