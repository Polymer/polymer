/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function() {
  var thisFile = 'lib/mocha-htmltest.js';
  var base = '';

  (function() {
    var s$ = document.querySelectorAll('script[src]');
    Array.prototype.forEach.call(s$, function(s) {
      var src = s.getAttribute('src');
      var re = new RegExp(thisFile + '[^\\\\]*');
      var match = src.match(re);
      if (match) {
        base = src.slice(0, -match[0].length);
      }
    });
  })();

  var next, iframe;

  var listener = function(event) {
    if (event.data === 'ok') {
      next();
    } else if (event.data && event.data.error) {
      throw event.data.error;
    }
  };

  function htmlSetup() {
    window.addEventListener("message", listener);
    iframe = document.createElement('iframe');
    iframe.style.cssText = 'position: absolute; left: -9000em; width:768px; height: 1024px';
    document.body.appendChild(iframe);
  }

  function htmlTeardown() {
    window.removeEventListener('message', listener);
    document.body.removeChild(iframe);
  }

  function htmlTest(src) {
    test(src, function(done) {
      next = done;
      iframe.src = base + src + "?" + Math.random();
    });
  };

  function htmlSuite(inName, inFn) {
    suite(inName, function() {
      setup(htmlSetup);
      teardown(htmlTeardown);
      inFn();
    });
  };

  window.htmlTest = htmlTest;
  window.htmlSuite = htmlSuite;
})();
