/* 
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {
  
  var path = {
    addResolvePathApi: function() {
      var root = this.elementPath();
      this.prototype.resolvePath = function(inPath) {
        return root + inPath;
      }
    },
    elementPath: function() {
      return this.urlToPath(HTMLImports.getDocumentUrl(this.ownerDocument));
    },
    urlToPath: function(url) {
      if (!url) {
        return '';
      } else {
        var parts = url.split('/');
        parts.pop();
        parts.push('');
        return parts.join('/');
      }
    }
  };
  
  // exports
  scope.api.declaration.path = path;

})(Polymer);