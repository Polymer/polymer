/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(scope) {

  var whenPolymerReady = scope.whenPolymerReady;

  function importElements(elementOrFragment, callback) {
    if (elementOrFragment) {
      document.head.appendChild(elementOrFragment);
      whenPolymerReady(callback);
    } else if (callback) {
      callback();
    }
  }

  function importUrls(urls, callback) {
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
  scope.import = importUrls;
  scope.importElements = importElements;

})(Polymer);
