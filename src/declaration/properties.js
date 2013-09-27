/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  // element api

  var properties = {
    inferObservers: function(prototype) {
      var observe = prototype.observe;
      for (var n in prototype) {
        if (n.slice(-7) === 'Changed') {
          if (!observe) {
            observe  = (prototype.observe = {});
          }
          observe[n.slice(0, -7)] = n;
        }
      }
    },
    optimizePropertyMaps: function(prototype) {
      if (prototype.observe) {
        // construct name list
        var a = prototype._observeNames = [];
        for (var n in prototype.observe) {
          a.push(n);
        }
        // build value list
        prototype._observeValues = valuesForNames(prototype._observeNames, prototype.observe);
      }
      if (prototype.publish) {
        // construct name list
        var a = prototype._publishNames = [];
        for (var n in prototype.publish) {
          a.push(n);
        }
        // build value list
        prototype._publishValues = valuesForNames(prototype._publishNames, prototype.publish);
      }
    },
    publishProperties: function(prototype, base) {
      // if we have any properties to publish
      var publish = prototype.publish;
      if (publish) {
        // transcribe `publish` entries onto own prototype
        this.requireProperties(publish, prototype, base);
        // construct map of lower-cased property names
        prototype._publishLC = this.lowerCaseMap(publish);
      }
    },
    requireProperties: function(properties, prototype, base) {
      // ensure a prototype value for each one
      for (var n in properties) {
        if (prototype[n] === undefined && base[n] === undefined) {
          prototype[n] = properties[n];
        }
      }
    },
    lowerCaseMap: function(properties) {
      var map = {};
      for (var n in properties) {
        map[n.toLowerCase()] = n;
      }
      return map;
    }
  };

  function valuesForNames(names, map) {
    var values = [];
    for (var i=0, l=names.length; i<l; i++) {
      values[i] = map[names[i]];
    }
    return values;
  }

  // exports

  scope.api.declaration.properties = properties;

})(Polymer);
