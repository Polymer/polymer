/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(scope) {

  // copy own properties from 'api' to 'prototype, with name hinting for 'super'
  function extend(prototype, api) {
    if (prototype && api) {
      // use only own properties of 'api'
      Object.getOwnPropertyNames(api).forEach(function(n) {
        // acquire property descriptor
        var pd = Object.getOwnPropertyDescriptor(api, n);
        if (pd) {
          // clone property via descriptor
          Object.defineProperty(prototype, n, pd);
          // cache name-of-method for 'super' engine
          if (typeof pd.value == 'function') {
            // hint the 'super' engine
            pd.value.nom = n;
          }
        }
      });
    }
    return prototype;
  }


  // mixin

  // copy all properties from inProps (et al) to inObj
  function mixin(inObj/*, inProps, inMoreProps, ...*/) {
    var obj = inObj || {};
    for (var i = 1; i < arguments.length; i++) {
      var p = arguments[i];
      try {
        for (var n in p) {
          copyProperty(n, p, obj);
        }
      } catch(x) {
      }
    }
    return obj;
  }

  // copy property inName from inSource object to inTarget object
  function copyProperty(inName, inSource, inTarget) {
    var pd = getPropertyDescriptor(inSource, inName);
    Object.defineProperty(inTarget, inName, pd);
  }

  // get property descriptor for inName on inObject, even if
  // inName exists on some link in inObject's prototype chain
  function getPropertyDescriptor(inObject, inName) {
    if (inObject) {
      var pd = Object.getOwnPropertyDescriptor(inObject, inName);
      return pd || getPropertyDescriptor(Object.getPrototypeOf(inObject), inName);
    }
  }

  // exports

  scope.extend = extend;
  scope.mixin = mixin;

  // for bc
  Platform.mixin = mixin;

})(Polymer);
