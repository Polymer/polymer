/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {
  
  // imports

  var log = window.logFlags || {};
  
  // magic words

  var OBSERVE_SUFFIX = 'Changed';

  // element api
  
  var properties = {
    // fetch an array of all property names in our prototype chain
    // above PolymerBase
    getCustomPropertyNames: function() {
      var properties = {};
      // TODO(sjmiles): __proto__ is simulated on non-supporting platforms
      var p = this.__proto__;
      while (p && !scope.isBase(p)) {
        Object.getOwnPropertyNames(p).forEach(function(n) {
          properties[n] = true;
        });
        p = p.__proto__;
      }  
      return Object.keys(properties);
    },
    bindProperty: function(property, model, path) {
      // apply Polymer two-way reference binding
      var observer = bindProperties(this, property, model, path);
      // bookkeep this observer for memory management
      registerObserver(this, 'binding', property, observer);
    },
    unbindProperty: function(type, name) {
      return unregisterObserver(this, type, name);
    },
    unbindAllProperties: function() {
      unregisterObserversOfType(this, 'property');
    },
    // set up property observers 
    observeProperties: function() {
      this.getCustomPropertyNames().forEach(this.observeProperty, this);
    },
    // observe property if shouldObserveProperty 
    observeProperty: function(name) {
      if (this.shouldObserveProperty(name)) {
        log.watch && console.log(LOG_OBSERVE, this.localName, name);
        var propertyChanged = function(neo, old) {
            log.watch && console.log(LOG_OBSERVED, this.localName, this.id || '', name, this[name], old);
            this.propertyChanged(name, old);
          }.bind(this);
        var observer = new PathObserver(this, name, propertyChanged);
        registerObserver(this, 'property', name, observer);
      }
    },
    // property should be observed if it has an observation callback
    shouldObserveProperty: function(name) {
      return Boolean(this[name + OBSERVE_SUFFIX]);
    },
    propertyChanged: function(name, oldValue) {
      invoke.call(this, name + OBSERVE_SUFFIX, [oldValue]);
    }
  };
  
  function invoke(method, args) {
    var fn = this[method] || method;
    if (typeof fn === 'function') {
      fn.apply(this, args);
    }
  }

  // property binding
  
  // bind a property in A to a path in B by converting A[property] to a
  // getter/setter pair that accesses B[...path...]
  function bindProperties(inA, inProperty, inB, inPath) {
    log.bind && console.log(LOG_BIND_PROPS, inB.localName || 'object', inPath, inA.localName, inProperty);
    // capture A's value if B's value is null or undefined,
    // otherwise use B's value
    var v = PathObserver.getValueAtPath(inB, inPath);
    if (v === null || v === undefined) {
      PathObserver.setValueAtPath(inB, inPath, inA[inProperty]);
    }
    return PathObserver.defineProperty(inA, inProperty, 
        {object: inB, path: inPath});
  }

  // bookkeeping observers for memory management

  var observers = new SideTable();
  
  function registerObserver(element, type, name, observer) {
    var o$ = getObserversOfType(element, type, true);
    o$[name.toLowerCase()] = observer;
  }
  
  function unregisterObserver(element, type, name) {
    var lcName = name.toLowerCase();
    var o$ = getObserversOfType(element, type);
    if (o$ && o$[lcName]) {
      o$[lcName].close();
      o$[lcName] = null;
      return true;
    }
  }
  
  function unregisterObserversOfType(element, type) {
    var $o = getObserversOfType(element, type);
    if ($o) {
      Object.keys($o).forEach(function(key) {
        unregisterObserver(element, type, key);
      });
    }
  }
  
  function getObserversOfType(element, type, force) {
    var b$ = observers.get(element);
    if (force) {
      if (!b$) {
        observers.set(element, b$ = {});
      }
      if (!b$[type]) {
        b$[type] = {};   
      }
    }
    return b$ && b$[type];
  }

  // logging
  
  var LOG_OBSERVE = '[%s] watching [%s]';
  var LOG_OBSERVED = '[%s#%s] watch: [%s] now [%s] was [%s]';
  var LOG_CHANGED = '[%s#%s] propertyChanged: [%s] now [%s] was [%s]';
  var LOG_BIND_PROPS = "[%s]: bindProperties: [%s] to [%s].[%s]";

  // exports

  scope.api.instance.properties = properties;
  
})(Polymer);
