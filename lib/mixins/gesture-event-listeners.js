import '../utils/boot.js';
import { dedupingMixin } from '../utils/mixin.js';
import * as gestures$0 from '../utils/gestures.js';

/**
 * @const {Polymer.Gestures}
 */
const gestures = gestures$0;

export const GestureEventListeners = dedupingMixin(superClass => {

  /**
   * @polymer
   * @mixinClass
   * @implements {Polymer_GestureEventListeners}
   */
  class GestureEventListeners extends superClass {

    _addEventListenerToNode(node, eventName, handler) {
      if (!gestures.addListener(node, eventName, handler)) {
        super._addEventListenerToNode(node, eventName, handler);
      }
    }

    _removeEventListenerFromNode(node, eventName, handler) {
      if (!gestures.removeListener(node, eventName, handler)) {
        super._removeEventListenerFromNode(node, eventName, handler);
      }
    }

  }

  return GestureEventListeners;

});
