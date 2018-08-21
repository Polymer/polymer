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

const UndefinedArgumentError = class extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    // Affordances for ensuring instanceof works after babel ES5 compilation
    this.constructor = UndefinedArgumentError;
    this.__proto__ = UndefinedArgumentError.prototype;
  }
};

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
   * @constructor
   * @extends {superClass}
   * @unrestricted
   * @private   */
  class LegacyDataMixin extends superClass {
    /**
     * Overrides `Polyer.PropertyEffects` to add `undefined` argument
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
      if (this._legacyUndefinedCheck && args.length > 1) {
        for (let i=0; i<args.length; i++) {
          if (vals[i] === undefined) {
            // Break out of effect's control flow; will be caught in
            // wrapped property effect function below
            throw new UndefinedArgumentError(`argument '${args[i].name}' is undefined; ensure it has an undefined check`);
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
      if (effect && effect.fn) {
        const fn = effect.fn;
        effect.fn = function() {
          try {
            fn.apply(this, arguments);
          } catch (e) {
            if (e instanceof UndefinedArgumentError) {
              console.warn(e.message);
            } else {
              throw e;
            }
          }
        };
      }
      return super._addPropertyEffect(property, type, effect);
    }

  }

  return LegacyDataMixin;

});

Polymer.Class = (info, mixin) => Class(info, 
  superClass => mixin ? 
    mixin(LegacyDataMixin(superClass)) : 
    LegacyDataMixin(superClass)
);

console.info('LegacyDataMixin will be applied to all legacy elements.\n' +
              'Set `_legacyUndefinedCheck: true` on element class to enable.');
