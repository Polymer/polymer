/* 
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

  var typeHandlers = {
    'string': function(value) {
      return value;
    },
    'date': function(value) {
      return new Date(Date.parse(value) || Date.now());
    },
    'boolean': function(value) {
      if (value === '') {
        return true;
      }
      return value === 'false' ? false : !!value;
    },
    'number': function(value) {
      var floatVal = parseFloat(value);
      return (String(floatVal) === value) ? floatVal : value;
    },
    'object': function(value, defaultValue) {
      if (!defaultValue) {
        return value;
      }
      try {
        // If the string is an object, we can parse is with the JSON library.
        // include convenience replace for single-quotes. If the author omits
        // quotes altogether, parse will fail.
        return JSON.parse(value.replace(/'/g, '"'));
      } catch(e) {
        // The object isn't valid JSON, return the raw value
        return value;
      }
    }
  };

  function deserializeValue(value, defaultValue) {
    // attempt to infer type from default value
    var inferredType = typeof defaultValue;
    // invent 'date' type value for Date
    if (defaultValue instanceof Date) {
      inferredType = 'date';
    }
    // delegate deserialization via type string
    return typeHandlers[inferredType](value, defaultValue);
  }

  // exports

  scope.deserializeValue = deserializeValue;

})(Polymer);
