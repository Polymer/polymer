/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(scope) {

  // element api

  var observationBlacklist = ['attribute'];

  var properties = {
    inferObservers: function(prototype) {
      // called before prototype.observe is chained to inherited object
      var observe = prototype.observe, property;
      for (var n in prototype) {
        if (n.slice(-7) === 'Changed') {
          property = n.slice(0, -7);
          if (this.canObserveProperty(property)) {
            if (!observe) {
              observe  = (prototype.observe = {});
            }
            observe[property] = observe[property] || n;
          }
        }
      }
    },
    canObserveProperty: function(property) {
      return (observationBlacklist.indexOf(property) < 0);
    },
    explodeObservers: function(prototype) {
      // called before prototype.observe is chained to inherited object
      var o = prototype.observe;
      if (o) {
        var exploded = {};
        for (var n in o) {
          var names = n.split(' ');
          for (var i=0, ni; ni=names[i]; i++) {
            exploded[ni] = o[n];
          }
        }
        prototype.observe = exploded;
      }
    },
    optimizePropertyMaps: function(prototype) {
      if (prototype.observe) {
        // construct name list
        var a = prototype._observeNames = [];
        for (var n in prototype.observe) {
          var names = n.split(' ');
          for (var i=0, ni; ni=names[i]; i++) {
            a.push(ni);
          }
        }
      }
      if (prototype.publish) {
        // construct name list
        var a = prototype._publishNames = [];
        for (var n in prototype.publish) {
          a.push(n);
        }
      }
      if (prototype.computed) {
        // construct name list
        var a = prototype._computedNames = [];
        for (var n in prototype.computed) {
          a.push(n);
        }
      }
    },
    publishProperties: function(prototype, base) {
      // if we have any properties to publish
      var publish = prototype.publish;
      if (publish) {
        // transcribe `publish` entries onto own prototype
        this.requireProperties(publish, prototype, base);
        // warn and remove accessor names that are broken on some browsers
        this.filterInvalidAccessorNames(publish);
        // construct map of lower-cased property names
        prototype._publishLC = this.lowerCaseMap(publish);
      }
      var computed = prototype.computed;
      if (computed) {
        // warn and remove accessor names that are broken on some browsers
        this.filterInvalidAccessorNames(computed);
      }
    },
    // Publishing/computing a property where the name might conflict with a
    // browser property is not currently supported to help users of Polymer
    // avoid browser bugs:
    //
    // https://code.google.com/p/chromium/issues/detail?id=43394
    // https://bugs.webkit.org/show_bug.cgi?id=49739
    //
    // We can lift this restriction when those bugs are fixed.
    filterInvalidAccessorNames: function(propertyNames) {
      for (var name in propertyNames) {
        // Check if the name is in our blacklist.
        if (this.propertyNameBlacklist[name]) {
          console.warn('Cannot define property "' + name + '" for element "' +
            this.name + '" because it has the same name as an HTMLElement ' +
            'property, and not all browsers support overriding that. ' +
            'Consider giving it a different name.');
          // Remove the invalid accessor from the list.
          delete propertyNames[name];
        }
      }
    },
    //
    // `name: value` entries in the `publish` object may need to generate 
    // matching properties on the prototype.
    //
    // Values that are objects may have a `reflect` property, which
    // signals that the value describes property control metadata.
    // In metadata objects, the prototype default value (if any)
    // is encoded in the `value` property.
    //
    // publish: {
    //   foo: 5, 
    //   bar: {value: true, reflect: true},
    //   zot: {}
    // }
    //
    // `reflect` metadata property controls whether changes to the property
    // are reflected back to the attribute (default false). 
    //
    // A value is stored on the prototype unless it's === `undefined`,
    // in which case the base chain is checked for a value.
    // If the basal value is also undefined, `null` is stored on the prototype.
    //
    // The reflection data is stored on another prototype object, `reflect`
    // which also can be specified directly.
    //
    // reflect: {
    //   foo: true
    // }
    //
    requireProperties: function(propertyInfos, prototype, base) {
      // per-prototype storage for reflected properties
      prototype.reflect = prototype.reflect || {};
      // ensure a prototype value for each property
      // and update the property's reflect to attribute status
      for (var n in propertyInfos) {
        var value = propertyInfos[n];
        // value has metadata if it has a `reflect` property
        if (value && value.reflect !== undefined) {
          prototype.reflect[n] = Boolean(value.reflect);
          value = value.value;
        }
        // only set a value if one is specified
        if (value !== undefined) {
          prototype[n] = value;
        }
      }
    },
    lowerCaseMap: function(properties) {
      var map = {};
      for (var n in properties) {
        map[n.toLowerCase()] = n;
      }
      return map;
    },
    createPropertyAccessor: function(name, ignoreWrites) {
      var proto = this.prototype;

      var privateName = name + '_';
      var privateObservable  = name + 'Observable_';
      proto[privateName] = proto[name];

      Object.defineProperty(proto, name, {
        get: function() {
          var observable = this[privateObservable];
          if (observable)
            observable.deliver();

          return this[privateName];
        },
        set: function(value) {
          if (ignoreWrites) {
            return this[privateName];
          }

          var observable = this[privateObservable];
          if (observable) {
            observable.setValue(value);
            return;
          }

          var oldValue = this[privateName];
          this[privateName] = value;
          this.emitPropertyChangeRecord(name, value, oldValue);

          return value;
        },
        configurable: true
      });
    },
    createPropertyAccessors: function(prototype) {
      var n$ = prototype._computedNames;
      if (n$ && n$.length) {
        for (var i=0, l=n$.length, n, fn; (i<l) && (n=n$[i]); i++) {
          this.createPropertyAccessor(n, true);
        }
      }
      var n$ = prototype._publishNames;
      if (n$ && n$.length) {
        for (var i=0, l=n$.length, n, fn; (i<l) && (n=n$[i]); i++) {
          // If the property is computed and published, the accessor is created
          // above.
          if (!prototype.computed || !prototype.computed[n]) {
            this.createPropertyAccessor(n);
          }
        }
      }
    },
    // This list contains some property names that people commonly want to use,
    // but won't work because of Chrome/Safari bugs. It isn't an exhaustive
    // list. In particular it doesn't contain any property names found on
    // subtypes of HTMLElement (e.g. name, value). Rather it attempts to catch
    // some common cases.
    propertyNameBlacklist: {
      children: 1,
      'class': 1,
      id: 1,
      hidden: 1,
      style: 1,
      title: 1,
    }
  };

  // exports

  scope.api.declaration.properties = properties;

})(Polymer);
