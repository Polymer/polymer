/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function() {

  var log = window.logFlags || {};

  // bind a property in A to a path in B by converting A[property] to a
  // getter/setter pair that accesses B[...path...]
  function bindProperties(inA, inProperty, inB, inPath) {
    log.bind && console.log("[%s]: bindProperties: [%s] to [%s].[%s]",
        inB.localName || 'object', inPath, inA.localName, inProperty);
    // capture A's value if B's value is null or undefined, 
    // otherwise use B's value
    var v = ChangeSummary.getValueAtPath(inB, inPath);
    if (v == null || v === undefined) {
      ChangeSummary.setValueAtPath(inB, inPath, inA[inProperty]);
    }
    // redefine A's property as an accessor on path in B
    Object.defineProperty(inA, inProperty, {
      get: function() {
        return ChangeSummary.getValueAtPath(inB, inPath);
      },
      set: function(inValue) {
        ChangeSummary.setValueAtPath(inB, inPath, inValue);
      },
      configurable: true,
      enumerable: true
    });
  }

  // exports
  Toolkit.bindProperties = bindProperties;

})();