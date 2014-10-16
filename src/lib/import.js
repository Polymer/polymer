/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(scope) {

/**
 * @class Polymer
 */

var whenReady = scope.whenReady;

/**
 * Loads the set of HTMLImports contained in `node`. Notifies when all
 * the imports have loaded by calling the `callback` function argument.
 * This method can be used to lazily load imports. For example, given a 
 * template:
 *     
 *     <template>
 *       <link rel="import" href="my-import1.html">
 *       <link rel="import" href="my-import2.html">
 *     </template>
 *
 *     Polymer.importElements(template.content, function() {
 *       console.log('imports lazily loaded'); 
 *     });
 * 
 * @method importElements
 * @param {Node} node Node containing the HTMLImports to load.
 * @param {Function} callback Callback called when all imports have loaded.
 */
function importElements(node, callback) {
  if (node) {
    document.head.appendChild(node);
    whenReady(callback);
  } else if (callback) {
    callback();
  }
}

/**
 * Loads an HTMLImport for each url specified in the `urls` array.
 * Notifies when all the imports have loaded by calling the `callback` 
 * function argument. This method can be used to lazily load imports. 
 * For example,
 *
 *     Polymer.import(['my-import1.html', 'my-import2.html'], function() {
 *       console.log('imports lazily loaded'); 
 *     });
 * 
 * @method import
 * @param {Array} urls Array of urls to load as HTMLImports.
 * @param {Function} callback Callback called when all imports have loaded.
 */
function _import(urls, callback) {
  if (urls && urls.length) {
      var frag = document.createDocumentFragment();
      for (var i=0, l=urls.length, url, link; (i<l) && (url=urls[i]); i++) {
        link = document.createElement('link');
        link.rel = 'import';
        link.href = url;
        frag.appendChild(link);
      }
      importElements(frag, callback);
  } else if (callback) {
    callback();
  }
}

// exports
scope.import = _import;
scope.importElements = importElements;

})(Polymer);
