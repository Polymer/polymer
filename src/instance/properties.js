/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(scope) {

  /**
   * @class polymer-base
   */

  // imports

  var log = window.WebComponents ? WebComponents.flags.log : {};

  // magic words

  var OBSERVE_SUFFIX = 'Changed';

  // element api

  var empty = [];

  var updateRecord = {
    object: undefined,
    type: 'update',
    name: undefined,
    oldValue: undefined
  };

  var numberIsNaN = Number.isNaN || function(value) {
    return typeof value === 'number' && isNaN(value);
  };

  function areSameValue(left, right) {
    if (left === right)
      return left !== 0 || 1 / left === 1 / right;
    if (numberIsNaN(left) && numberIsNaN(right))
      return true;
    return left !== left && right !== right;
  }

  // capture A's value if B's value is null or undefined,
  // otherwise use B's value
  function resolveBindingValue(oldValue, value) {
    if (value === undefined && oldValue === null) {
      return value;
    }
    return (value === null || value === undefined) ? oldValue : value;
  }

  var properties = {

    // creates a CompoundObserver to observe property changes
    // NOTE, this is only done there are any properties in the `observe` object
    createPropertyObserver: function() {
      var n$ = this._observeNames;
      if (n$ && n$.length) {
        var o = this._propertyObserver = new CompoundObserver(true);
        this.registerObserver(o);
        // TODO(sorvell): may not be kosher to access the value here (this[n]);
        // previously we looked at the descriptor on the prototype
        // this doesn't work for inheritance and not for accessors without
        // a value property
        for (var i=0, l=n$.length, n; (i<l) && (n=n$[i]); i++) {
          o.addPath(this, n);
          this.observeArrayValue(n, this[n], null);
        }
      }
    },

    // start observing property changes
    openPropertyObserver: function() {
      if (this._propertyObserver) {
        this._propertyObserver.open(this.notifyPropertyChanges, this);
      }
    },

    // handler for property changes; routes changes to observing methods
    // note: array valued properties are observed for array splices
    notifyPropertyChanges: function(newValues, oldValues, paths) {
      var name, method, called = {};
      for (var i in oldValues) {
        // note: paths is of form [object, path, object, path]
        name = paths[2 * i + 1];
        method = this.observe[name];
        if (method) {
          var ov = oldValues[i], nv = newValues[i];
          // observes the value if it is an array
          this.observeArrayValue(name, nv, ov);
          if (!called[method]) {
            // only invoke change method if one of ov or nv is not (undefined | null)
            if ((ov !== undefined && ov !== null) || (nv !== undefined && nv !== null)) {
              called[method] = true;
              // TODO(sorvell): call method with the set of values it's expecting;
              // e.g. 'foo bar': 'invalidate' expects the new and old values for
              // foo and bar. Currently we give only one of these and then
              // deliver all the arguments.
              this.invokeMethod(method, [ov, nv, arguments]);
            }
          }
        }
      }
    },

    // call method iff it exists.
    invokeMethod: function(method, args) {
      var fn = this[method] || method;
      if (typeof fn === 'function') {
        fn.apply(this, args);
      }
    },

    /**
     * Force any pending property changes to synchronously deliver to
     * handlers specified in the `observe` object.
     * Note, normally changes are processed at microtask time.
     *
     * @method deliverChanges
     */
    deliverChanges: function() {
      if (this._propertyObserver) {
        this._propertyObserver.deliver();
      }
    },

    observeArrayValue: function(name, value, old) {
      // we only care if there are registered side-effects
      var callbackName = this.observe[name];
      if (callbackName) {
        // if we are observing the previous value, stop
        if (Array.isArray(old)) {
          log.observe && console.log('[%s] observeArrayValue: unregister observer [%s]', this.localName, name);
          this.closeNamedObserver(name + '__array');
        }
        // if the new value is an array, being observing it
        if (Array.isArray(value)) {
          log.observe && console.log('[%s] observeArrayValue: register observer [%s]', this.localName, name, value);
          var observer = new ArrayObserver(value);
          observer.open(function(splices) {
            this.invokeMethod(callbackName, [splices]);
          }, this);
          this.registerNamedObserver(name + '__array', observer);
        }
      }
    },

    emitPropertyChangeRecord: function(name, value, oldValue) {
      var object = this;
      if (areSameValue(value, oldValue)) {
        return;
      }
      // invoke property change side effects
      this._propertyChanged(name, value, oldValue);
      // emit change record
      if (!Observer.hasObjectObserve) {
        return;
      }
      var notifier = this._objectNotifier;
      if (!notifier) {
        notifier = this._objectNotifier = Object.getNotifier(this);
      }
      updateRecord.object = this;
      updateRecord.name = name;
      updateRecord.oldValue = oldValue;
      notifier.notify(updateRecord);
    },

    _propertyChanged: function(name, value, oldValue) {
      if (this.reflect[name]) {
        this.reflectPropertyToAttribute(name);
      }
    },

    // creates a property binding (called via bind) to a published property.
    bindProperty: function(property, observable, oneTime) {
      if (oneTime) {
        this[property] = observable;
        return;
      }
      var computed = this.element.prototype.computed;
      // Binding an "out-only" value to a computed property. Note that
      // since this observer isn't opened, it doesn't need to be closed on
      // cleanup.
      if (computed && computed[property]) {
        var privateComputedBoundValue = property + 'ComputedBoundObservable_';
        this[privateComputedBoundValue] = observable;
        return;
      }
      return this.bindToAccessor(property, observable, resolveBindingValue);
    },

    // NOTE property `name` must be published. This makes it an accessor.
    bindToAccessor: function(name, observable, resolveFn) {
      var privateName = name + '_';
      var privateObservable  = name + 'Observable_';
      // Present for properties which are computed and published and have a
      // bound value.
      var privateComputedBoundValue = name + 'ComputedBoundObservable_';
      this[privateObservable] = observable;
      var oldValue = this[privateName];
      // observable callback
      var self = this;
      function updateValue(value, oldValue) {
        self[privateName] = value;
        var setObserveable = self[privateComputedBoundValue];
        if (setObserveable && typeof setObserveable.setValue == 'function') {
          setObserveable.setValue(value);
        }
        self.emitPropertyChangeRecord(name, value, oldValue);
      }
      // resolve initial value
      var value = observable.open(updateValue);
      if (resolveFn && !areSameValue(oldValue, value)) {
        var resolvedValue = resolveFn(oldValue, value);
        if (!areSameValue(value, resolvedValue)) {
          value = resolvedValue;
          if (observable.setValue) {
            observable.setValue(value);
          }
        }
      }
      updateValue(value, oldValue);
      // register and return observable
      var observer = {
        close: function() {
          observable.close();
          self[privateObservable] = undefined;
          self[privateComputedBoundValue] = undefined;
        }
      };
      this.registerObserver(observer);
      return observer;
    },

    createComputedProperties: function() {
      if (!this._computedNames) {
        return;
      }
      for (var i = 0; i < this._computedNames.length; i++) {
        var name = this._computedNames[i];
        var expressionText = this.computed[name];
        try {
          var expression = PolymerExpressions.getExpression(expressionText);
          var observable = expression.getBinding(this, this.element.syntax);
          this.bindToAccessor(name, observable);
        } catch (ex) {
          console.error('Failed to create computed property', ex);
        }
      }
    },

    // property bookkeeping
    registerObserver: function(observer) {
      if (!this._observers) {
        this._observers = [observer];
        return;
      }
      this._observers.push(observer);
    },

    closeObservers: function() {
      if (!this._observers) {
        return;
      }
      // observer array items are arrays of observers.
      var observers = this._observers;
      for (var i = 0; i < observers.length; i++) {
        var observer = observers[i];
        if (observer && typeof observer.close == 'function') {
          observer.close();
        }
      }
      this._observers = [];
    },

    // bookkeeping observers for memory management
    registerNamedObserver: function(name, observer) {
      var o$ = this._namedObservers || (this._namedObservers = {});
      o$[name] = observer;
    },

    closeNamedObserver: function(name) {
      var o$ = this._namedObservers;
      if (o$ && o$[name]) {
        o$[name].close();
        o$[name] = null;
        return true;
      }
    },

    closeNamedObservers: function() {
      if (this._namedObservers) {
        for (var i in this._namedObservers) {
          this.closeNamedObserver(i);
        }
        this._namedObservers = {};
      }
    }

  };

  // logging
  var LOG_OBSERVE = '[%s] watching [%s]';
  var LOG_OBSERVED = '[%s#%s] watch: [%s] now [%s] was [%s]';
  var LOG_CHANGED = '[%s#%s] propertyChanged: [%s] now [%s] was [%s]';

  // exports

  scope.api.instance.properties = properties;

})(Polymer);
