/* 
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

  // TODO(sorvell): ideally path resolution is factored out of
  // HTMLImports polyfill
  var resolver = HTMLImports.path;

  var path = {
    resolveElementPaths: function(node) {
      resolver.resolvePathsInHTML(node);
    },
    addResolvePathApi: function() {
      var root = this.elementPath();
      // let assetpath attribute modify the resolve path
      var assetPath = this.getAttribute('assetpath') || '';
      var relPath = this.relPath;
      this.prototype.resolvePath = function(inPath, base) {
        if (base) {
          return this.element.urlToPath(base) + inPath;
        }
        var to = inPath;
        if (assetPath) {
          // assetPath is always a folder, drop the trailing '/'
          var from = assetPath.slice(0, -1);
          to = relPath(from, to);
        }
        return root + assetPath + to;
      };
    },
    elementPath: function() {
      return this.urlToPath(HTMLImports.getDocumentUrl(this.ownerDocument));
    },
    relPath: function(from, to) {
      var fromParts = from.split('/');
      var toParts = to.split('/');

      // chop to common length
      var common = false;
      while(fromParts.length && toParts.length && fromParts[0] === toParts[0]) {
        fromParts.shift();
        toParts.shift();
        common = true;
      }

      // if there were some commonalities, add '../' for differences
      if (common) {
        for (var i = 0; i < fromParts.length; i++) {
          toParts.unshift('..');
        }
      }
      return toParts.join('/');
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
