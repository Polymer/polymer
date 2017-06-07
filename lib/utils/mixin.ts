/*
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

// unique global id for deduping mixins.
let dedupeId = 0;

/**
 * Given a mixin producing function, memoize applications of mixin to base
 * @private
 * @param {Function} mixin Mixin for which to create a caching mixin.
 * @return {Function} Returns a mixin which when applied multiple times to the
 * same base will always return the same extended class.
 */
function cachingMixin<A extends object, R>(mixin: (a: A) => R): (a: A)=>R {
  return function(base) {
    let m: {__mixinApplications?: WeakMap<A, R>} & typeof mixin = mixin;
    if (!m.__mixinApplications) {
      m.__mixinApplications = new WeakMap<A, R>();
    }
    let map = m.__mixinApplications;
    let application = map.get(base);
    if (!application) {
      application = mixin(base);
      map.set(base, application);
    }
    return application;
  };
}

interface WithMixinSet {
  __mixinSet: {[dedupeId: number]: boolean};
}

/**
 * Wraps an ES6 class expression mixin such that the mixin is only applied
 * if it has not already been applied its base argument.  Also memoizes mixin
 * applications.
 *
 * @memberof Polymer
 * @param {Function} mixin ES6 class expression mixin to wrap
 * @return {Function} Wrapped mixin that deduplicates and memoizes
 *   mixin applications to base
 */
export const dedupingMixin = function<A extends object, R>(mixin: (a: A)=>R): (a: A)=>R {
  mixin = cachingMixin(mixin);
  const m = mixin as {__dedupeId: number} & typeof mixin;
  // maintain a unique id for each mixin
  m.__dedupeId = ++dedupeId;
  return function(base: A) {
    const b = base as WithMixinSet & A;
    const baseSet = b.__mixinSet;
    if (baseSet && baseSet[m.__dedupeId]) {
      return base as any as R;
    }
    const extended = mixin(base) as WithMixinSet & R;
    // copy inherited mixin set from the extended class, or the base class
    // NOTE: we avoid use of Set here because some browser (IE11)
    // cannot extend a base Set via the constructor.
    extended.__mixinSet =
      Object.create(extended.__mixinSet || baseSet || null);
    extended.__mixinSet[m.__dedupeId] = true;
    return extended;
  }
};
