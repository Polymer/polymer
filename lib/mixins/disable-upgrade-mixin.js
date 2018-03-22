import { ElementMixin } from './element-mixin.js';
import { dedupingMixin } from '../utils/mixin.js';

const DISABLED_ATTR = 'disable-upgrade';

export const DisableUpgradeMixin = dedupingMixin((base) => {

  /**
   * @constructor
   * @extends {base}
   * @implements {Polymer_ElementMixin}
   */
  const superClass = ElementMixin(base);
  /**
   * @polymer
   * @mixinClass
   * @implements {Polymer_DisableUpgradeMixin}
   */
  class DisableUpgradeClass extends superClass {

    /** @override */
    static get observedAttributes() {
      return super.observedAttributes.concat(DISABLED_ATTR);
    }

    /** @override */
    attributeChangedCallback(name, old, value) {
      if (name == DISABLED_ATTR) {
        if (!this.__dataEnabled && value == null && this.isConnected) {
          super.connectedCallback();
        }
      } else {
        super.attributeChangedCallback(name, old, value);
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
