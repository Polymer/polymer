/* 
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function() {
  
  /*
  function parseAllBindingDeclarations(inRoot) {
    forEach(inRoot.childNodes, parsBindingDeclarations, this);
  };
  
  function parsBindingDeclarations(inNode) {
    // scan for bindings in attributes
    if (inNode.attributes) {
      forEach(inNode.attributes, function(a) {
        parseMustache.call(this, inNode, a.name, a.value);
      }, this);
    }
  };
  
  function parseMustache(inNode, inName, inValue) {
    var m = inValue.match(parseMustache.pattern);
    if (m) {
      //console.log(inName, inValue, m);
      bindProperties(inNode, inName, this, m[1]);
    }
  };
  parseMustache.pattern = /\{\{([^{}]*)}}/;
  */
 
  function bindProperties(inA, inProperty, inB, inPath) {
    console.log("[%s]: bindProperties: [%s] to [%s].[%s]", 
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
  
  //Toolkit.parseAllBindingDeclarations = parseAllBindingDeclarations;
  Toolkit.bindProperties = bindProperties;
  
})();