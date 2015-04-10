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

function getFile(url, deferred, config) {
  /* global XMLHttpRequest:false */
  var x = new XMLHttpRequest();
  x.onload = function() {
    var status = x.status || 0;
    if (status >= 200 && status < 300) {
      deferred.resolve(x.response);
    } else {
      deferred.reject('xhr status: ' + status);
    }
  };
  x.onerror = function(e) {
    deferred.reject(e);
  };
  x.open('GET', url, true);
  if (config && config.responseType) {
    x.responseType = config.responseType;
  }
  x.send();
}

/*
 * Configuration
 *   - responseType
 *      - Type of object to be returned by the XHR
 *      - Default: 'text'
 *      - Accepts: 'document', 'arraybuffer', 'json'
 */
function XHRResolver(config) {
  this.config = config;
}
XHRResolver.prototype = {
  accept: function(uri, deferred) {
    getFile(uri, deferred, this.config);
    return true;
  }
};

module.exports = XHRResolver;
