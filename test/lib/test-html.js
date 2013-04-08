/* 
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {
  var listener, next, iframe;
  
  function htmlSetup() {
    listener = window.addEventListener("message", function(event) {
      if (event.data === 'ok') {
        next();
      } else {
        throw event.data;
      }
    });
    iframe = document.createElement('iframe');
    iframe.style.cssText = 'position: absolute; left: -9000em; width:768px; height: 1024px';
    document.body.appendChild(iframe);
  }

  function htmlTeardown() {
    window.removeEventListener(listener);
    document.body.removeChild(iframe);
  }

  function htmlTest(src) {
    test(src, function(done) {
      next = done;
      iframe.src = src + "?" + Math.random();
    });
  };
  
  function htmlSuite(inName, inFn) {
    suite('bindProperties-declarative', function() {
      setup(htmlSetup);
      teardown(htmlTeardown);
      inFn();
    });
  };
  
  window.htmlTest = htmlTest;
  window.htmlSuite = htmlSuite;
})();
