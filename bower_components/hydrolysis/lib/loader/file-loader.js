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

// jshint -W079
// Promise polyfill
var Promise = global.Promise || require('es6-promise').Promise;
// jshint +W079

function Deferred() {
  var self = this;
  this.promise = new Promise(function(resolve, reject) {
    self.resolve = resolve;
    self.reject = reject;
  });
}

function FileLoader() {
  this.resolvers = [];
  // map url -> Deferred
  this.requests = {};
}
FileLoader.prototype = {
  /*
   * Add an instance of a Resolver class to the list of url resolvers
   *
   * Ordering of resolvers is most to least recently added
   * The first resolver to "accept" the url wins
   */
  addResolver: function(resolver) {
    this.resolvers.push(resolver);
  },
  /*
   * Return a promise for an absolute url
   *
   * Url requests are deduplicated by the loader, returning the same Promise for
   * identical urls
   */
  request: function(uri) {
    var promise;

    if (!(uri in this.requests)) {
      var handled = false;
      var deferred = new Deferred();
      this.requests[uri] = deferred;

      // loop backwards through resolvers until one "accepts" the request
      for (var i = this.resolvers.length - 1, r; i >= 0; i--) {
        r = this.resolvers[i];
        if (r.accept(uri, deferred)) {
          handled = true;
          break;
        }
      }

      if (!handled) {
        deferred.reject('no resolver found');
      }

      promise = deferred.promise;
    } else {
      promise = this.requests[uri].promise;
    }

    return promise;
  }
};

module.exports = FileLoader;
