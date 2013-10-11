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
      //
      // TODO(sjmiles):
      // we observe published properties so we can reflect them to attributes
      // ~100% of our team's applications would work without this reflection,
      // perhaps we can make it optional somehow
      //
      // add user's observers
      var n$ = this._observeNames, v$ = this._observeValues;
      if (n$) {
        for (var i=0, l=n$.length, n; i<l; i++) {
          n = n$[i];
          if (this.publish && (this.publish[n] !== undefined)) {
            this.observeBoth(n, v$[i]);
          } else {
            this.observeProperty(n, v$[i]);
          }
        }
      }
      // add observers for published properties
      var n$ = this._publishNames, v$ = this._publishValues;
      if (n$) {
        for (var i=0, l=n$.length, n; i<l; i++) {
          n = n$[i];
          if (!this.observe || (this.observe[n] === undefined)) {
            this.observeAttributeProperty(n, v$[i]);
          }
        }
      }
    },
    observeAttributeProperty: function(name) {
      var self = this;
      // construct an observer on 'name' that ...
      this._observe(name, function() {
        // reflects the value to an attribute
        self.relectPropertyToAttribute(name);
      });
    },
    observeProperty: function(name, methodName) {
      var self = this;
      // construct an observer on 'name' that ...
      this._observe(name, function(value, old) {
        // observes the value if it is an array
        self.observeArrayValue(name, value, old);
        // invokes user's side-effect method
        self.invokeMethod(methodName, [old]);
      });
    },
    observeBoth: function(name, methodName) {
      var self = this;
      // construct an observer on 'name' that ...
      this._observe(name, function(value, old) {
        // reflects the value to an attribute
        self.relectPropertyToAttribute(name);
        // observes the value if it is an array
        self.observeArrayValue(name, value, old);
        // invokes user's side-effect method
        self.invokeMethod(methodName, [old]);
      });
    },
    observeArrayValue: function(name, value, old) {
      // we only care if there are registered side-effects
      var callbackName = this.observe[name];
      if (callbackName) {
        // if we are observing the previous value, stop
        if (Array.isArray(old)) {
          log.observe && console.log('[%s] observeArrayValue: unregister observer [%s]', this.localName, name);
          unregisterObserver(this, name + '__array');
        }
        // if the new value is an array, being observing it
        if (Array.isArray(value)) {
          log.observe && console.log('[%s] observeArrayValue: register observer [%s]', this.localName, name, value);
          var self = this;
          var observer = new ArrayObserver(value, function(value, old) {
            self.invokeMethod(callbackName, [old]);
          });
          registerObserver(this, name + '__array', observer);
        }
      }
    },
    _observe: function(name, cb) {
      log.observe && console.log(LOG_OBSERVE, this.localName, name);
      registerObserver(this, name, new PathObserver(this, name, cb));
      // TODO(sjmiles): must use property descriptors otherwise we could
      // be invoking a getter
      var pd = Object.getOwnPropertyDescriptor(this.__proto__, name);
      if (pd && pd.value) {
        this.observeArrayValue(name, pd.value, null);
      }
    },
    bindProperty: function(property, model, path) {
      // apply Polymer two-way reference binding
      return bindProperties(this, property, model, path);
    },
    unbindProperty: function(name) {
      return unregisterObserver(this, name);
    },
    unbindAllProperties: function() {
      unregisterObservers(this);
    },
    invokeMethod: function(method, args) {
      var fn = this[method] || method;
      if (typeof fn === 'function') {
        fn.apply(this, args);
      }
    }
  };

  // property binding

  // bind a property in A to a path in B by converting A[property] to a
  // getter/setter pair that accesses B[...path...]
  function bindProperties(inA, inProperty, inB, inPath) {
    log.bind && console.log(LOG_BIND_PROPS, inB.localName || 'object', inPath, inA.localName, inProperty);
    // capture A's value if B's value is null or undefined,
    // otherwise use B's value
    var path = Path.get(inPath);
    var v = path.getValueFrom(inB);
    if (v === null || v === undefined) {
      path.setValueFrom(inB, inA[inProperty]);
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
