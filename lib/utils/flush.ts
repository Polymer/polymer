/*
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {Debouncer} from './debounce.js';

let debouncerQueue: Debouncer[] = [];

/**
 * Adds a `Polymer.Debouncer` to a list of globally flushable tasks.
 *
 * @memberof Polymer
 * @param {Polymer.Debouncer} debouncer Debouncer to enqueue
 */
export function enqueueDebouncer(debouncer: Debouncer) {
  debouncerQueue.push(debouncer);
}

function flushDebouncers() {
  const didFlush = Boolean(debouncerQueue.length);
  while (debouncerQueue.length) {
    try {
      debouncerQueue.shift()!.flush();
    } catch(e) {
      setTimeout(() => {
        throw e;
      });
    }
  }
  return didFlush;
}

/**
 * Forces several classes of asynchronously queued tasks to flush:
 * - Debouncers added via `enqueueDebouncer`
 * - ShadyDOM distribution
 *
 * @memberof Polymer
 */
export function flush() {
  let shadyDOM = false, debouncers = false;
  do {
    let ShadyDOM = (window as any).ShadyDOM;
    let ShadyCSS = (window as any).ShadyCSS;
    shadyDOM = !!(ShadyDOM && ShadyDOM.flush());
    if (ShadyCSS && ShadyCSS.ScopingShim) {
      ShadyCSS.ScopingShim.flush();
    }
    debouncers = flushDebouncers();
  } while ((shadyDOM || debouncers) === true);
}
