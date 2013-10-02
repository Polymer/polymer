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
        var o = this._propertyObserver = new CompoundPathObserver(function(
            newValues, oldValues, changedBits, paths) {
          self.notifyPropertyChanges(newValues, oldValues, changedBits, paths);
        }, this, undefined, undefined);
        var p = this._propertyObserverNames = [];
        for (var i=0, l=n$.length, n; (i<l) && (n=n$[i]); i++) {
          o.addPath(this, n);
        }
        for (var i=0, l=pn$.length, n; (i<l) && (n=pn$[i]); i++) {
          if (!this.observe || (this.observe[n] === undefined)) {
            o.addPath(this, n);
          }
        }
        o.start();
      }
    },
    notifyPropertyChanges: function(newValues, oldValues, changedBits, paths) {
      for (var i=0, l=changedBits.length, n; i<l; i++) {
        if (changedBits[i]) {
          // note: paths is of form [object, path, object, path]
          n = paths[2 * i + 1];
          if (this.publish[n] !== undefined) {
            this.relectPropertyToAttribute(n);
          }
          if (this.observe[n]) {
            invoke.call(this, this.observe[n], [oldValues[i]]);
          }
        }
      }
    },
    // set up property observers
    bindProperty: function(property, model, path) {
      // apply Polymer two-way reference binding
      return bindProperties(this, property, model, path);
    },
    unbindAllProperties: function() {
      if (this._propertyObserver) {
        this._propertyObserver.close();
      }
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
    var path = Path.get(inPath);
    var v = path.getValueFrom(inB);
    if (v === null || v === undefined) {
      path.setValueFrom(inB, inA[inProperty]);
    }
    return PathObserver.defineProperty(inA, inProperty,
      {object: inB, path: inPath});
  }

  // logging
  var LOG_OBSERVE = '[%s] watching [%s]';
  var LOG_OBSERVED = '[%s#%s] watch: [%s] now [%s] was [%s]';
  var LOG_CHANGED = '[%s#%s] propertyChanged: [%s] now [%s] was [%s]';
  var LOG_BIND_PROPS = "[%s]: bindProperties: [%s] to [%s].[%s]";

  // exports

  scope.api.instance.properties = properties;

})(Polymer);
