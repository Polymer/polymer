/**
 * @fileoverview
 * @suppress {checkPrototypalTypes}
 * @license Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { ElementMixin } from './element-mixin.js';

import { dedupingMixin } from '../utils/mixin.js';

const DISABLED_ATTR = 'disable-upgrade';

/**
 * Element class mixin that allows the element to boot up in a non-enabled
 * state when the `disable-upgrade` attribute is present. This mixin is
 * designed to be used with element classes like PolymerElement that perform
 * initial startup work when they are first connected. When the
 * `disable-upgrade` attribute is removed, if the element is connected, it
 * boots up and "enables" as it otherwise would; if it is not connected, the
 * element boots up when it is next connected.
 *
 * Using `disable-upgrade` with PolymerElement prevents any data propagation
 * to the element, any element DOM from stamping, or any work done in
 * connected/disconnctedCallback from occuring, but it does not prevent work
 * done in the element constructor.
 *
 * Note, this mixin must be applied on top of any element class that
 * itself implements a `connectedCallback` so that it can control the work
 * done in `connectedCallback`. For example,
 *
 *     MyClass = DisableUpgradeMixin(class extends BaseClass {...});
 *
 * @mixinFunction
 * @polymer
 * @appliesMixin ElementMixin
 */
export const DisableUpgradeMixin = dedupingMixin((base) => {
  /**
   * @constructor
   * @implements {Polymer_ElementMixin}
   * @extends {HTMLElement}
   * @private
   */
  const superClass = ElementMixin(base);

  /**
   * @polymer
   * @mixinClass
   * @implements {Polymer_DisableUpgradeMixin}
   */
  class DisableUpgradeClass extends superClass {

    /**
     * @suppress {missingProperties} go/missingfnprops
     */
    static get observedAttributes() {
      return super.observedAttributes.concat(DISABLED_ATTR);
    }

    /**
     * @override
     * @param {string} name Attribute name.
     * @param {?string} old The previous value for the attribute.
     * @param {?string} value The new value for the attribute.
     * @param {?string=} namespace The XML namespace for the attribute.
     * @return {undefined}
     */
    attributeChangedCallback(name, old, value, namespace) {
      if (name == DISABLED_ATTR) {
        if (!this.__dataEnabled && value == null && this.isConnected) {
          super.connectedCallback();
        }
      } else {
        super.attributeChangedCallback(
            name, old, value, /** @type {null|string} */ (namespace));
      }
    }

    /*
      NOTE: cannot gate on attribute because this is called before
      attributes are delivered. Therefore, we stub this out and
      call `super._initializeProperties()` manually.
    */
    /** @override */
    _initializeProperties() {}

    // prevent user code in connected from running
    /** @override */
    connectedCallback() {
      if (this.__dataEnabled || !this.hasAttribute(DISABLED_ATTR)) {
        super.connectedCallback();
      }
    }

    // prevent element from turning on properties
    /** @override */
    _enableProperties() {
      if (!this.hasAttribute(DISABLED_ATTR)) {
        if (!this.__dataEnabled) {
          super._initializeProperties();
        }
        super._enableProperties();
      }
    }

    // only go if "enabled"
    /** @override */
    disconnectedCallback() {
      if (this.__dataEnabled) {
        super.disconnectedCallback();
      }
    }

  }

  return DisableUpgradeClass;
});
