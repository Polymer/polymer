/* 
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {
  
  // imports
  
  var bindPattern = Toolkit.bindPattern;

  function takeAttributes() {
    // for each attribute
    forEach(this.attributes, function(a) {
      // try to match this attribute to a property (attributess are
      // all lower-case, so this is case-insensitive search)
      var name = propertyForAttribute.call(this, a.name);
      if (name) {
        // filter out 'mustached' values, these are to be
        // replaced with bound-data and are not yet values
        // themselves
        if (a.value.search(bindPattern) >= 0) {
          return;
        }
        // get original value
        var defaultValue = this[name];
        // deserialize Boolean or Number values from attribute
        var value = deserializeValue(a.value, defaultValue);
        //console.log('takeAttributes: ', a.name, a.value);
        // only act if the value has changed
        if (value !== defaultValue) {
          // install new value (has side-effects)
          this[name] = value;
        }
      }
    }, this);
  };

  // find the public property identified by inAttributeName
  function propertyForAttribute(inAttributeName) {
    // TODO(sjmiles): I'm reluctant to search the entire namespace
    // but this set is too small. Perhaps in 'full public' mode, one
    // must declare 'attributable properties'. 
    var properties = Object.keys(Object.getPrototypeOf(this));
    for (var i=0, n; (n=properties[i]); i++) {
      if (n.toLowerCase() == inAttributeName) {
        return n;
      }
    }
  };

  function deserializeValue(inValue, inDefaultValue) {
    var inferredType = typeof inDefaultValue;
    switch (inValue) {
      case '':
      case 'true':
        return inferredType == 'boolean' ? true : inValue;
      case 'false':
        return inferredType == 'boolean' ? false : inValue;
      }
      return isNaN(inValue) ? inValue : parseFloat(inValue);
  }

  // exports
  
  Toolkit.takeAttributes = takeAttributes;
  
})();