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
      var name = this.name;
      // if we have no prototype
      if (!getRegisteredPrototype(name)) {
        // then wait for a prototype
        waitPrototype[name] = this;
        // if explicitly marked as 'noscript'
        if (this.hasAttribute('noscript')) {
          // TODO(sorvell): CustomElements polyfill awareness:
          // noscript elements should upgrade in logical order
          // script injection ensures this under native custom elements;
          // under imports + ce polyfill, scripts run before upgrades
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
        return;
      }
      // fetch our extendee name
      var extendee = this.getAttribute('extends');
      // if extending a custom element...
      if (extendee && extendee.indexOf('-') >= 0) {
        // wait for the extendee to be registered first
        if (!isRegistered(extendee)) {
          (waitSuper[extendee] = (waitSuper[extendee] || [])).push(this);
          return;
        }
      }
      // TODO(sjmiles): HTMLImports polyfill awareness:
      // elements in the main document are likely to parse
      // in advance of elements in imports because the
      // polyfill parser is simulated
      // therefore, wait for imports loaded before
      // finalizing elements in the main document
      if (document.contains(this)) {
        whenImportsLoaded(function() {
          this.register(name, extendee);
        }.bind(this));
      } else {
        this.register(name, extendee);
      }
    },
    register: function(name, extendee) {
      // build prototype combining extendee, Polymer base, and named api
      this.prototype = this.generateCustomPrototype(name, extendee);
      // backref
      this.prototype.element = this;
      // TODO(sorvell): install a helper method this.resolvePath to aid in 
      // setting resource paths. e.g. 
      // this.$.image.src = this.resolvePath('images/foo.png')
      // Potentially remove when spec bug is addressed.
      // https://www.w3.org/Bugs/Public/show_bug.cgi?id=21407
      this.addResolvePathApi();
      // declarative features
      this.desugar();
      // under ShadowDOMPolyfill, transforms to approximate missing CSS features
      if (window.ShadowDOMPolyfill) {
        Platform.ShadowCSS.shimStyling(this.templateContent(), name, extendee);
      }
      // register our custom element
      this.registerPrototype(name);
      // reference constructor in a global named by 'constructor' attribute
      this.publishConstructor();
      // subclasses may now register themselves
      notifySuper(name);
    },
    // implement various declarative features
    desugar: function(prototype) {
      // parse `attribute` attribute and `publish` object
      this.parseAttributes();
      // parse on-* delegates declared on `this` element
      this.parseHostEvents();
      // parse on-* delegates declared in templates
      this.parseLocalEvents();
      // install external stylesheets as if they are inline
      this.installSheets();
      // allow custom element access to the declarative context
      if (this.prototype.registerCallback) {
        this.prototype.registerCallback(this);
      }
      // cache the list of custom prototype names for faster reflection
      this.cacheProperties();
    },
    // if a named constructor is requested in element, map a reference
    // to the constructor to the given symbol
    publishConstructor: function() {
      var symbol = this.getAttribute('constructor');
      if (symbol) {
        window[symbol] = this.ctor;
      }
    }
  });

  // semi-pluggable APIs 
  // TODO(sjmiles): should be fully pluggable
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
