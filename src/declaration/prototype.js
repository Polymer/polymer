/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  // imports
  
  var api = scope.api;
  var isBase = scope.isBase;
  var extend = scope.extend;
  
  // returns a prototype that chains to <tag> or HTMLElement
  function generatePrototype(tag) {
    return Object.create(HTMLElement.getPrototypeForTag(tag));
  }

  // On platforms that do not support __proto__ (IE10), the prototype chain
  // of a custom element is simulated via installation of __proto__.
  // Although custom elements manages this, we install it here so it's 
  // available during desugaring.
  function ensurePrototypeTraversal(prototype) {
    if (!Object.__proto__) {
      var ancestor = Object.getPrototypeOf(prototype);
      prototype.__proto__ = ancestor;
      if (isBase(ancestor)) {
        ancestor.__proto__ = Object.getPrototypeOf(ancestor);
      }
    }
  }

  // declarative implementation: <polymer-element>

  var prototype = generatePrototype();
  
  // prototype api

  var prototype = {
    // prototype marshaling
    // build prototype combining extendee, Polymer base, and named api
    generateCustomPrototype: function (name, extnds) {
      // basal prototype
      var prototype = this.generateBasePrototype(extnds);
      // mixin registered custom api
      this.addNamedApi(prototype, name);
      // x-platform fixups
      ensurePrototypeTraversal(prototype);
      return prototype;
    },
    // build prototype combining extendee, Polymer base, and named api
    generateBasePrototype: function(extnds) {
      // create a prototype based on tag-name extension
      var prototype = generatePrototype(extnds);
      // insert base api in inheritance chain (if needed)
      return this.ensureBaseApi(prototype);
    },
    // install Polymer instance api into prototype chain, as needed 
    ensureBaseApi: function(prototype) { 
      if (!prototype.PolymerBase) {
        Object.keys(api.instance).forEach(function(n) {
          extend(prototype, api.instance[n]);
        });
        prototype = Object.create(prototype);
      }
      // inherit publishing meta-data
      this.inheritAttributesObjects(prototype);
      // inherit event delegates
      this.inheritDelegates(prototype);
      // return buffed-up prototype
      return prototype;
    },
    // mix api registered to 'name' into 'prototype' 
    addNamedApi: function(prototype, name) { 
      // combine custom api into prototype
      return extend(prototype, scope.getRegisteredPrototype(name));
    },
    // make a fresh object that inherits from a prototype object
    inheritObject: function(prototype, name) {
      // copy inherited properties onto a new object
      prototype[name] = extend({}, Object.getPrototypeOf(prototype)[name]);
    },
    // register 'prototype' to custom element 'name', store constructor 
    registerPrototype: function(name) { 
      // register the custom type
      this.ctor = document.register(name, {
        prototype: this.prototype
      });
      // constructor shenanigans
      this.prototype.constructor = this.ctor;
      // register the prototype with HTMLElement for name lookup
      HTMLElement.register(name, this.prototype);
    }
  };
  
  // exports

  api.declaration.prototype = prototype;
  
})(Polymer);
