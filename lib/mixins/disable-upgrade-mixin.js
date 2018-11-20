/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

const DISABLE_UPGRADE = 'disable-upgrade';

/**
 * Element class mixin that allows the element to boot up in a non-enabled
 * state when the `disable-upgrade` attribute is present. This mixin is
 * designed to be used with element classes like PolymerElement that perform
 * initial startup work when they are first connected. When the
 * `disable-upgrade` attribute is removed, the element
 * boots up and "enables" as it otherwise would.
 *
 * For legacy elements, it also prevents the `created` method from being called
 * and event listeners from being added.
 *
 * Using `disable-upgrade` with Polymer.Element prevents any data propagation
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
 * @appliesMixin Polymer.ElementMixin
 * @memberof Polymer
 * @param {Object} base base class on which to apply mixin
 * @return {Object} class with mixin applied
 */
export const DisableUpgradeMixin = (base) => {

  /**
   * @polymer
   * @mixinClass
   * @implements {Polymer_DisableUpgradeMixin}
   */
  class DisableUpgradeClass extends base {

    /** @override */
    static get observedAttributes() {
      return super.observedAttributes.concat(DISABLE_UPGRADE);
    }

    /** @override */
    attributeChangedCallback(name, old, value, namespace) {
      if (name == DISABLE_UPGRADE) {
        if (!this.__dataEnabled && value == null && this.isConnected) {
          super.connectedCallback();
        }
      } else {
        super.attributeChangedCallback(name, old, value, namespace);
      }
    }

    // disable while `disable-upgrade` is on
    created() {}

    // disable while `disable-upgrade` is on
    _applyListeners() {}

    // prevent user code in connected from running
    /** @override */
    connectedCallback() {
      if (this.__dataEnabled || !this.hasAttribute(DISABLE_UPGRADE)) {
        super.connectedCallback();
      }
    }

    // prevent element from turning on properties
    /** @override */
    _enableProperties() {
      if (!this.__dataEnabled) {
        if (!this.hasAttribute(DISABLE_UPGRADE)) {
          // When enabling, run previously disabled lifecycle.
          // NOTE: This alters the timing of disabled lifecycle for all
          // elements that support `disable-upgrade`
          if (super.created) {
            super.created();
          }
          if (super._applyListeners) {
            super._applyListeners();
          }
          super._enableProperties();
        }
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

};
