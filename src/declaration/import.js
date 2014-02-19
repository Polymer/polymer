/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
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
