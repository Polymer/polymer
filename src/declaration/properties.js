/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {
  
  // imports

  // magic words

  var OBSERVE_SUFFIX = 'Changed';

  // element api
  
  var empty = [];

  var properties = {
    cacheProperties: function() {
      this.prototype.customPropertyNames = this.getCustomPropertyNames(this.prototype);
    },
    // fetch an array of all property names in our prototype chain 
    // above PolymerBase
    // TODO(sjmiles): perf: reflection is slow, relatively speaking
    //  If an element may take 6us to create, getCustomPropertyNames might
    //  cost 1.6us more.
    getCustomPropertyNames: function(p) {
      var properties = {}, some;
      while (p && !scope.isBase(p)) {
        var names = Object.getOwnPropertyNames(p);
        for (var i=0, l=names.length, n; (i<l) && (n=names[i]); i++) {
          properties[n] = true;
          some = true;
        }
      // TODO(sjmiles): __proto__ is simulated on non-supporting platforms
        p = p.__proto__;
      }  
      return some ? Object.keys(properties) : empty;
    }
  };

  // exports

  scope.api.declaration.properties = properties;
  
})(Polymer);
