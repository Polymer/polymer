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
          //console.log('inferring observe entry for', n);
        }
      }
    }
  };

  // exports

  scope.api.declaration.properties = properties;

})(Polymer);
