/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

 /*
	On supported platforms, platform.js is not needed. To retain compatibility
	with the polyfills, we stub out minimal functionality.
 */
if (!window.WebComponents) {

  WebComponents = {
  	flush: function() {},
    flags: {log: {}}
  };

  Platform = WebComponents;

  CustomElements = {
  	useNative: true,
    ready: true,
    takeRecords: function() {},
    instanceof: function(obj, base) {
      return obj instanceof base;
    }
  };
  
  HTMLImports = {
  	useNative: true
  };

  
  addEventListener('HTMLImportsLoaded', function() {
    document.dispatchEvent(
      new CustomEvent('WebComponentsReady', {bubbles: true})
    );
  });


  // ShadowDOM
  ShadowDOMPolyfill = null;
  wrap = unwrap = function(n){
    return n;
  };

}
