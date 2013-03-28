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
        inB.localName, inPath, inA.localName, inProperty);
    var parts = inPath.split(".");
    var property = parts.pop();
    var path = parts.length ? '.' + parts.join('.') : '';
    // TODO(sjmiles): we can't do this under CSP, maybe MDV provides
    // a utility
    var getObject = new Function(['inObject'], 'return inObject' + path + ';');
    Object.defineProperty(inA, inProperty, {
      // TODO(sjmiles): right now we are null-checking the penultimate object
      // we may need to check each part of the path or wrap the entire accessor
      // in a try/catch block
      get: function() {
        var src = getObject(inB);
        return src && src[property];
      },
      set: function(inValue) {
        var tgt = getObject(inB);
        if (tgt) {
          tgt[property] = inValue;
        }
      },
      configurable: true,
      enumerable: true
    });
  }
 
  // exports

  Toolkit.bindProperties = bindProperties;

})();