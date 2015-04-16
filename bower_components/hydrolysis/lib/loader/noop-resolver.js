/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// jshint node:true
'use strict';

/**
 * A resolver that resolves to null any uri matching config.
 * @param {string} config
 */
function NoopResolver(config) {
  this.config = config;
}

NoopResolver.prototype = {

  /**
   * @param {string} uri The absolute URI being requested.
   * @param {!Deferred} deferred The deferred promise that should be resolved if
   *     this resolver handles the URI.
   * @return {boolean} Whether the URI is handled by this resolver.
   */
  accept: function(uri, deferred) {
    if (!this.config.test) {
      if (uri.search(this.config) == -1) {
        return false;
      }
    } else if (!this.config.test(uri)) return false;

    deferred.resolve('');
    return true;
  }
};

module.exports = NoopResolver;
