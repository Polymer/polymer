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

import { dedupingMixin } from '../utils/mixin.js';
import { addListener, removeListener } from '../utils/gestures.js';

/**
 * Element class mixin that provides API for adding Polymer's cross-platform
 * gesture events to nodes.
 *
 * The API is designed to be compatible with override points implemented
 * in `TemplateStamp` such that declarative event listeners in
 * templates will support gesture events when this mixin is applied along with
 * `TemplateStamp`.
 *
 * @mixinFunction
 * @polymer
 * @summary Element class mixin that provides API for adding Polymer's
 *   cross-platform
 * gesture events to nodes
 */
export const GestureEventListeners = dedupingMixin(
    /**
     * @template T
     * @param {function(new:T)} superClass Class to apply mixin to.
     * @return {function(new:T)} superClass with mixin applied.
     */
    (superClass) => {
      /**
       * @polymer
       * @mixinClass
       * @implements {Polymer_GestureEventListeners}
       */
      class GestureEventListeners extends superClass {
        /**
         * Add the event listener to the node if it is a gestures event.
         *
         * @param {!EventTarget} node Node to add event listener to
         * @param {string} eventName Name of event
         * @param {function(!Event):void} handler Listener function to add
         * @return {void}
         * @override
         */
        _addEventListenerToNode(node, eventName, handler) {
          if (!addListener(node, eventName, handler)) {
            super._addEventListenerToNode(node, eventName, handler);
          }
        }

        /**
         * Remove the event listener to the node if it is a gestures event.
         *
         * @param {!EventTarget} node Node to remove event listener from
         * @param {string} eventName Name of event
         * @param {function(!Event):void} handler Listener function to remove
         * @return {void}
         * @override
         */
        _removeEventListenerFromNode(node, eventName, handler) {
          if (!removeListener(node, eventName, handler)) {
            super._removeEventListenerFromNode(node, eventName, handler);
          }
        }
      }

      return GestureEventListeners;
    });
