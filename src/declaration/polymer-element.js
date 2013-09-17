/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  // imports

  var extend = scope.extend;
  var apis = scope.api.declaration;

  // imperative implementation: Polymer()

  // specify an 'own' prototype for tag `name`
  function element(name, prototype) {
    //console.log('registering [' + name + ']');
    // cache the prototype
    prototypesByName[name] = prototype || {};
    // notify the registrar waiting for 'name', if any
    notifyPrototype(name);
  }

  // declarative implementation: <polymer-element>

  var prototype = extend(Object.create(HTMLElement.prototype), {
    createdCallback: function() {
      // fetch the element name
      this.name = this.getAttribute('name');
      // install element definition, if ready
      this.registerWhenReady();
    },
    registerWhenReady: function() {
      // if we have no prototype, wait
      if (this.waitingForPrototype(this.name)) {
        return;
      }
      // fetch our extendee name
      var extendee = this.getAttribute('extends');
      if (this.waitingForExtendee(extendee)) {
        //console.warn(this.name + ': waitingForExtendee:' + extendee);
        return;
      }
      // TODO(sjmiles): HTMLImports polyfill awareness:
      // elements in the main document are likely to parse
      // in advance of elements in imports because the
      // polyfill parser is simulated
      // therefore, wait for imports loaded before
      // finalizing elements in the main document
      if (document.contains(this)) {
        whenImportsLoaded(function() {
          this._register(extendee);
        }.bind(this));
      } else {
        this._register(extendee);
      }
    },
    _register: function(extendee) {
      //console.group('registering', this.name);
      this.register(this.name, extendee);
      //console.groupEnd();
      // subclasses may now register themselves
      notifySuper(this.name);
    },
    waitingForPrototype: function(name) {
      if (!getRegisteredPrototype(name)) {
        // then wait for a prototype
        waitPrototype[name] = this;
        // if explicitly marked as 'noscript'
        if (this.hasAttribute('noscript')) {
          // TODO(sorvell): CustomElements polyfill awareness:
          // noscript elements should upgrade in logical order
          // script injection ensures this under native custom elements;
          // under imports + ce polyfills, scripts run before upgrades.
          // dependencies should be ready at upgrade time so register
          // prototype at this time.
          if (window.CustomElements && !CustomElements.useNative) {
            element(name);
          } else {
            var script = document.createElement('script');
            script.textContent = 'Polymer(\'' + name + '\');';
            this.appendChild(script);
          }
        }
        return true;
      }
    },
    waitingForExtendee: function(extendee) {
      // if extending a custom element...
      if (extendee && extendee.indexOf('-') >= 0) {
        // wait for the extendee to be registered first
        if (!isRegistered(extendee)) {
          (waitSuper[extendee] = (waitSuper[extendee] || [])).push(this);
          return true;
        }
      }
    }
  });

  // semi-pluggable APIs 
  // TODO(sjmiles): should be fully pluggable (aka decoupled, currently
  // the various plugins are allowed to depend on each other directly)
  Object.keys(apis).forEach(function(n) {
    extend(prototype, apis[n]);
  });

  // register polymer-element with document

  document.register('polymer-element', {prototype: prototype});

  // utility and bookkeeping
  
  // maps tag names to prototypes
  var prototypesByName = {};

  function getRegisteredPrototype(name) {
    return prototypesByName[name];
  }

  // elements waiting for prototype, by name
  var waitPrototype = {};

  function notifyPrototype(name) {
    if (waitPrototype[name]) {
      waitPrototype[name].registerWhenReady();
      delete waitPrototype[name];
    }
  }

  // elements waiting for super, by name
  var waitSuper = {};

  function notifySuper(name) {
    registered[name] = true;
    var waiting = waitSuper[name];
    if (waiting) {
      waiting.forEach(function(w) {
        w.registerWhenReady();
      });
      delete waitSuper[name];
    }
  }

  // track document.register'ed tag names

  var registered = {};

  function isRegistered(name) {
    return registered[name];
  }

  function whenImportsLoaded(doThis) {
    if (window.HTMLImports && !HTMLImports.readyTime) {
      addEventListener('HTMLImportsLoaded', doThis);
    } else {
      doThis();
    }
  }

  // exports
  
  scope.getRegisteredPrototype = getRegisteredPrototype;
  
  // namespace shenanigans so we can expose our scope on the registration 
  // function

  // TODO(sjmiles): find a way to do this that is less terrible
  // copy window.Polymer properties onto `element()`
  extend(element, scope);
  // make window.Polymer reference `element()`
  window.Polymer = element;

})(Polymer);
