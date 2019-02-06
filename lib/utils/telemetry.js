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
 * Total number of Polymer element instances created.
 * @type {number}
 */
export let instanceCount = 0;

export function incrementInstanceCount() {
  instanceCount++;
}

/**
 * Array of Polymer element classes that have been finalized.
 * @type {!Array<!PolymerElementConstructor>}
 */
export const registrations = [];

/**
 * @param {!PolymerElementConstructor} prototype Element prototype to log
 * @private
 */
function _regLog(prototype) {
  console.log('[' + /** @type {?} */(prototype).is + ']: registered');
}

/**
 * Registers a class prototype for telemetry purposes.
 * @param {!PolymerElementConstructor} prototype Element prototype to register
 * @protected
 */
export function register(prototype) {
  registrations.push(prototype);
}

/**
 * Logs all elements registered with an `is` to the console.
 * @public
 */
export function dumpRegistrations() {
  registrations.forEach(_regLog);
}