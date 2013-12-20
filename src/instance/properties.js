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
    observeProperties: function() {
      var n$ = this._observeNames, pn$ = this._publishNames;
      if ((n$ && n$.length) || (pn$ && pn$.length)) {
        var self = this;
        var o = this._propertyObserver = new CompoundObserver();
        for (var i=0, l=n$.length, n; (i<l) && (n=n$[i]); i++) {
          o.addPath(this, n);
          // observer array properties
          var pd = Object.getOwnPropertyDescriptor(this.__proto__, n);
          if (pd && pd.value) {
            this.observeArrayValue(n, pd.value, null);
          }
        }
        for (var i=0, l=pn$.length, n; (i<l) && (n=pn$[i]); i++) {
          if (!this.observe || (this.observe[n] === undefined)) {
            o.addPath(this, n);
          }
        }
        o.open(this.notifyPropertyChanges, this);
      }
    },
    notifyPropertyChanges: function(newValues, oldValues, paths) {
      var name, method, called = {};
      for (var i in oldValues) {
        // note: paths is of form [object, path, object, path]
        name = paths[2 * i + 1];
        if (this.publish[name] !== undefined) {
          this.reflectPropertyToAttribute(name);
        }
        method = this.observe[name];
        if (method) {
          this.observeArrayValue(name, newValues[i], oldValues[i]);
          if (!called[method]) {
            called[method] = true;
            // observes the value if it is an array
            this.invokeMethod(method, [oldValues[i], newValues[i], arguments]);
          }
        }
      }
    },
    observeArrayValue: function(name, value, old) {
      // we only care if there are registered side-effects
      var callbackName = this.observe[name];
      if (callbackName) {
        // if we are observing the previous value, stop
        if (Array.isArray(old)) {
          log.observe && console.log('[%s] observeArrayValue: unregister observer [%s]', this.localName, name);
          this.unregisterObserver(name + '__array');
        }
        // if the new value is an array, being observing it
        if (Array.isArray(value)) {
          log.observe && console.log('[%s] observeArrayValue: register observer [%s]', this.localName, name, value);
          var observer = new ArrayObserver(value);
          observer.open(function(value, old) {
            this.invokeMethod(callbackName, [old]);
          }, this);
          this.registerObserver(name + '__array', observer);
        }
      }
    },
    bindProperty: function(property, observable) {
      // apply Polymer two-way reference binding
      return bindProperties(this, property, observable);
    },
    unbindAllProperties: function() {
      if (this._propertyObserver) {
        this._propertyObserver.close();
      }
      this.unregisterObservers();
    },
    unbindProperty: function(name) {
      return this.unregisterObserver(name);
    },
    invokeMethod: function(method, args) {
      var fn = this[method] || method;
      if (typeof fn === 'function') {
        fn.apply(this, args);
      }
    },
    // bookkeeping observers for memory management
    registerObserver: function(name, observer) {
      var o$ = this._observers || (this._observers = {});
      o$[name] = observer;
    },
    unregisterObserver: function(name) {
      var o$ = this._observers;
      if (o$ && o$[name]) {
        o$[name].close();
        o$[name] = null;
        return true;
      }
    },
    unregisterObservers: function() {
      if (this._observers) {
        var keys=Object.keys(this._observers);
        for (var i=0, l=keys.length, k, o; (i < l) && (k=keys[i]); i++) {
          o = this._observers[k];
          o.close();
        }
        this._observers = {};
      }
    }
  };

  // property binding
  // bind a property in A to a path in B by converting A[property] to a
  // getter/setter pair that accesses B[...path...]
  function bindProperties(inA, inProperty, observable) {
    log.bind && console.log(LOG_BIND_PROPS, inB.localName || 'object', inPath, inA.localName, inProperty);
    // capture A's value if B's value is null or undefined,
    // otherwise use B's value
    // TODO(sorvell): need to review, can do with ObserverTransform
    var v = observable.discardChanges();
    if (v === null || v === undefined) {
      observable.setValue(inA[inProperty]);
    }
    return Observer.defineComputedProperty(inA, inProperty, observable);
  }

  // logging
  var LOG_OBSERVE = '[%s] watching [%s]';
  var LOG_OBSERVED = '[%s#%s] watch: [%s] now [%s] was [%s]';
  var LOG_CHANGED = '[%s#%s] propertyChanged: [%s] now [%s] was [%s]';
  var LOG_BIND_PROPS = "[%s]: bindProperties: [%s] to [%s].[%s]";

  // exports

  scope.api.instance.properties = properties;

})(Polymer);
