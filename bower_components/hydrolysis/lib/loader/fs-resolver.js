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

var fs = require('fs');
var path = require('path');
var url = require('url');

function getFile(filepath, deferred) {
  fs.readFile(filepath, 'utf-8', function(err, content) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(content);
    }
  });
}

/*
 * Configuration:
 *   - host
 *     - Hostname to match for absolute urls
 *     - Default: ""
 *     - Also matches "/" by default
 *  - basePath
 *     - Prefix directory for components in url
 *     - Default: "/"
 *  - root
 *     - Filesystem root for components
 *     - Default: current working directory
 */
function FSResolver(config) {
  this.config = config;
}
FSResolver.prototype = {
  accept: function(uri, deferred) {
    var parsed = url.parse(uri);
    var host = this.config.host;
    var base = this.config.basePath;
    var root = this.config.root;

    var local;

    if (!parsed.hostname || parsed.hostname === host) {
      local = parsed.pathname;
    }

    if (local) {
      if (base) {
        local = path.relative(base, local);
      }

      if (root) {
        local = path.join(root, local);
      }

      getFile(local, deferred);
      return true;
    }

    return false;
  }
};

module.exports = FSResolver;
