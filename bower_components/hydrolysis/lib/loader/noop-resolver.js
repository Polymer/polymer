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
 * A resolver that no-ops files unless they match a particular criteria.
 *
 * `test` is provided the uri. If it returns true, the request is handled (and
 * no-opped). Otherwise the resolver passes the request on.
 *
 * @param {{test: function(string): boolean}} config
 */
function NoopResolver(config) {
  this.config = config;
}

NoopResolver.prototype = {

  /**
   * @param {string} uri The URI being requested **relative to baseURI!**
   * @param {!Deferred} deferred The deferred promise that should be resolved if
   *     this resolver handles the URI.
   * @return {boolean} Whether the URI is handled by this resolver.
   */
  accept: function(uri, deferred) {
    if (!this.config.test(uri)) return false;

    deferred.resolve('');
    return true;
  }
};

module.exports = NoopResolver;
