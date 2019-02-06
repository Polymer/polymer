/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { Class } from './class.js';
import { Polymer } from '../../polymer-legacy.js';
import { dedupingMixin } from '../utils/mixin.js';
import { templatize } from '../utils/templatize.js';

const UndefinedArgumentError = class extends Error {
  constructor(message, arg) {
    super(message);
    this.arg = arg;
    this.name = this.constructor.name;
    // Affordances for ensuring instanceof works after babel ES5 compilation
    // TODO(kschaaf): Remove after polymer CLI updates to newer Babel that
    // sets the constructor/prototype correctly for subclassed builtins
    this.constructor = UndefinedArgumentError;
    this.__proto__ = UndefinedArgumentError.prototype;
  }
};

/**
 * Wraps effect functions to catch `UndefinedArgumentError`s and warn.
 *
 * @param {Object=} effect Effect metadata object
 * @param {Object=} fnName Name of user function, if known
 * @return {?Object|undefined} Effect metadata object
 */
function wrapEffect(effect, fnName) {
  if (effect && effect.fn) {
    const fn = effect.fn;
    effect.fn = function() {
      try {
        fn.apply(this, arguments);
      } catch (e) {
        if (e instanceof UndefinedArgumentError) {
          console.warn(`Argument '${e.arg}'${fnName ?` for method '${fnName}'` : ''} was undefined. Ensure it has a default value, or else ensure the method handles the argument being undefined.`);
        } else {
          throw e;
        }
      }
    };
  }
  return effect;
}

/**
 * Mixin to selectively add back Polymer 1.x's `undefined` rules
 * governing when observers & computing functions run based
 * on all arguments being defined (reference https://www.polymer-project.org/1.0/docs/devguide/observers#multi-property-observers).
 *
 * When loaded, all legacy elements (defined with `Polymer({...})`)
 * will have the mixin applied. The mixin only restores legacy data handling
 * if `_legacyUndefinedCheck: true` is set on the element's prototype.
 *
 * This mixin is intended for use to help migration from Polymer 1.x to
 * 2.x+ by allowing legacy code to work while identifying observers and
 * computing functions that need undefined checks to work without
 * the mixin in Polymer 2.
 *
 * @mixinFunction
 * @polymer
 * @summary Mixin to selectively add back Polymer 1.x's `undefined` rules
 * governing when observers & computing functions run.
 */
export const LegacyDataMixin = dedupingMixin(superClass => {

  /**
   * @unrestricted
   * @private
   */
  class LegacyDataMixin extends superClass {
    /**
     * Overrides `Polymer.PropertyEffects` to add `undefined` argument
     * checking to match Polymer 1.x style rules
     *
     * @param {!Array<!MethodArg>} args Array of argument metadata
     * @param {string} path Property/path name that triggered the method effect
     * @param {Object} props Bag of current property changes
     * @return {Array<*>} Array of argument values
     * @private
     */
    _marshalArgs(args, path, props) {
      const vals = super._marshalArgs(args, path, props);
      // Per legacy data rules, single-property observers (whether in `properties`
      // and in `observers`) are called regardless of whether their argument is
      // undefined or not. Multi-property observers must have all arguments defined
      if (this._legacyUndefinedCheck && vals.length > 1) {
        for (let i=0; i<vals.length; i++) {
          if (vals[i] === undefined) {
            // Break out of effect's control flow; will be caught in
            // wrapped property effect function below
            const name = args[i].name;
            throw new UndefinedArgumentError(`Argument '${name}' is undefined.`, name);
          }
        }
      }
      return vals;
    }

    /**
     * Overrides `Polyer.PropertyEffects` to wrap effect functions to
     * catch `UndefinedArgumentError`s and warn.
     *
     * @param {string} property Property that should trigger the effect
     * @param {string} type Effect type, from this.PROPERTY_EFFECT_TYPES
     * @param {Object=} effect Effect metadata object
     * @return {void}
     * @protected
     */
    _addPropertyEffect(property, type, effect) {
      return super._addPropertyEffect(property, type,
        wrapEffect(effect, effect && effect.info && effect.info.methodName));
    }

    /**
     * Overrides `Polyer.PropertyEffects` to wrap effect functions to
     * catch `UndefinedArgumentError`s and warn.
     *
     * @param {Object} templateInfo Template metadata to add effect to
     * @param {string} prop Property that should trigger the effect
     * @param {Object=} effect Effect metadata object
     * @return {void}
     * @protected
     */
    static _addTemplatePropertyEffect(templateInfo, prop, effect) {
      return super._addTemplatePropertyEffect(templateInfo, prop, wrapEffect(effect));
    }

  }

  return LegacyDataMixin;

});

// LegacyDataMixin is applied to base class _before_ metaprogramming, to
// ensure override of _addPropertyEffect et.al. are used by metaprogramming
// performed in _finalizeClass
Polymer.Class = (info, mixin) => Class(info,
  superClass => mixin ?
    mixin(LegacyDataMixin(superClass)) :
    LegacyDataMixin(superClass)
);

// Apply LegacyDataMixin to Templatizer instances as well, and defer
// runtime switch to the root's host (_methodHost)
/**
 * @mixinFunction
 * @polymer
 */
const TemplatizeMixin =
  dedupingMixin(superClass => {
    /**
     * @constructor
     * @extends {HTMLElement}
     */
    const legacyBase = LegacyDataMixin(superClass);
    /**
     * @private
     */
    class TemplateLegacy extends legacyBase {
      get _legacyUndefinedCheck() {
        return this._methodHost && this._methodHost._legacyUndefinedCheck;
      }
    }
    /** @type {!Polymer_PropertyEffects} */
    TemplateLegacy.prototype._methodHost;
    return TemplateLegacy;
  });

templatize.mixin = TemplatizeMixin;

console.info('LegacyDataMixin will be applied to all legacy elements.\n' +
              'Set `_legacyUndefinedCheck: true` on element class to enable.');
