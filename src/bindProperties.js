/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function() {

  var log = window.logFlags || {};

  function bindProperties(inA, inProperty, inB, inPath) {
    log.bind && console.log("[%s]: bindProperties: [%s] to [%s].[%s]",
        inB.localName, inPath, inA.localName, inProperty);
    var parts = inPath.split(".");
    var property = parts.pop();
    var path = parts.length ? '.' + parts.join('.') : '';
    var getObject = new Function(['inObject'], 'return inObject' + path + ';');
    //console.log(getObject(inB), getObject(inB)[property]);
    Object.defineProperty(inA, inProperty, {
      get: function() {
        return getObject(inB)[property];
      },
      set: function(inValue) {
        getObject(inB)[property] = inValue;
      },
      configurable: true,
      enumerable: true
    });
  }

  // exports

  Toolkit.bindProperties = bindProperties;

})();