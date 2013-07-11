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
  
  var empty = [];

  var properties = {
    // set up property observers 
    observeProperties: function() {
      var names = this.getCustomPropertyNames();
      for (var i=0, l=names.length, n; (i<l) && (n=names[i]); i++) {
        this.observeProperty(n);
      }
    },
    // fetch an pre-constructor array of all property names in our prototype
    // chain above PolymerBase
    getCustomPropertyNames: function() {
      return this.customPropertyNames;
    },
    // observe property if shouldObserveProperty 
    observeProperty: function(name) {
      if (this.shouldObserveProperty(name)) {
        log.watch && console.log(LOG_OBSERVE, this.localName, name);
        var propertyChanged = function(neo, old) {
            log.watch && console.log(LOG_OBSERVED, this.localName, this.id || '', name, this[name], old);
            this.dispatchPropertyChange(name, old);
          }.bind(this);
        var observer = new PathObserver(this, name, propertyChanged);
        registerObserver(this, name, observer);
      }
    },
    bindProperty: function(property, model, path) {
      // apply Polymer two-way reference binding
      return bindProperties(this, property, model, path);
    },
    unbindProperty: function(type, name) {
      return unregisterObserver(this, type, name);
    },
    unbindAllProperties: function() {
      unregisterObservers(this);
    },
    // property should be observed if it has an observation callback
    shouldObserveProperty: function(name) {
      return Boolean(this[name + OBSERVE_SUFFIX]);
    },
    dispatchPropertyChange: function(name, oldValue) {
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
  
  function registerObserver(element, name, observer) {
    var o$ = getElementObservers(element);
    o$[name] = observer;
  }
  
  function unregisterObserver(element, name) {
    var o$ = getElementObservers(element);
    if (o$ && o$[name]) {
      o$[name].close();
      o$[name] = null;
      return true;
    }
  }
  
  function unregisterObservers(element) {
    var $o = getElementObservers(element);
    Object.keys($o).forEach(function(key) {
      $o[key].close();
      $o[key] = null;
    });
  }
  
  function getElementObservers(element) {
    var b$ = observers.get(element);
    if (!b$) {
      observers.set(element, b$ = {});
    }
    return b$;
  }

  // logging
  
  var LOG_OBSERVE = '[%s] watching [%s]';
  var LOG_OBSERVED = '[%s#%s] watch: [%s] now [%s] was [%s]';
  var LOG_CHANGED = '[%s#%s] propertyChanged: [%s] now [%s] was [%s]';
  var LOG_BIND_PROPS = "[%s]: bindProperties: [%s] to [%s].[%s]";

  // exports

  scope.api.instance.properties = properties;
  
})(Polymer);
