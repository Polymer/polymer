/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  // imports
  
  var extend = Polymer.extend;
  var apis = scope.api.declaration;

  // imperative implementation: Polymer()
  
  // maps tag names to prototypes
  var registry = {};

  function getRegisteredPrototype(name) {
    return registry[name];
  }

  // elements waiting for prototype, by name
  var waitPrototype = {};

  // specify an 'own' prototype for tag `name`
  function element(name, prototype) {
    // cache the prototype
    registry[name] = prototype || {};
    // notify the registrar waiting for 'name', if any
    notifyPrototype(name);
  }

  function notifyPrototype(name) {
    if (waitPrototype[name]) {
      waitPrototype[name].define();
    }
  }

  // elements waiting for super, by name
  var waitSuper = {};

  function notifySuper(name) {
    var waiting = waitSuper[name];
    if (waiting) {
      waiting.forEach(function(w) {
        w.define();
      });
    }
  }

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
      if (scope.isBase(ancestor)) {
        ancestor.__proto__ = Object.getPrototypeOf(ancestor);
      }
    }
  }

  // declarative implementation: <polymer-element>

  var prototype = generatePrototype();

  extend(prototype, {
    // TODO(sjmiles): temporary BC
    readyCallback: function() {
      this._createdCallback();
    },
    createdCallback: function() {
      this._createdCallback();
    },
    // custom element processing
    _createdCallback: function() {
      // fetch our element name
      this.name = this.getAttribute('name');
      if (getRegisteredPrototype(this.name)) {
        this.define();
      } else {
        waitPrototype[this.name] = this;
      }
    },
    define: function() {
      // fetch our extendee name
      var extnds = this.getAttribute('extends');
      // if extending a custom element...
      if (extnds && extnds.indexOf('-') >= 0) {
        // wait for the extendee to be registered first
        if (!getRegisteredPrototype(extnds)) {
          (waitSuper[extnds] = (waitSuper[extnds] || [])).push(this);
          return;
        }
      }
      this.register(this.name, extnds);
    },
    register: function(name, extnds) {
      // build prototype combining extendee, Polymer base, and named api
      this.prototype = this.generateCustomPrototype(name, extnds);
      // backref
      this.prototype.element = this;
      // TODO(sorvell): install a helper method this.resolvePath to aid in 
      // setting resource paths. e.g. 
      // this.$.image.src = this.resolvePath('images/foo.png')
      // Potentially remove when spec bug is addressed.
      // https://www.w3.org/Bugs/Public/show_bug.cgi?id=21407
      this.addResolvePathApi();
      ensurePrototypeTraversal(this.prototype);
      // declarative features
      this.desugar();
      // under ShadowDOMPolyfill, transforms to approximate missing CSS features
      if (window.ShadowDOMPolyfill) {
        Platform.ShadowCSS.shimStyling(this.templateContent(), name, extnds);
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
    // prototype marshaling
    // build prototype combining extendee, Polymer base, and named api
    generateCustomPrototype: function (name, extnds) {
      // basal prototype
      var prototype = this.generateBasePrototype(extnds);
      // mixin registered custom api
      return this.addNamedApi(prototype, name);
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
        Object.keys(scope.api.instance).forEach(function(n) {
          extend(prototype, scope.api.instance[n]);
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
      return extend(prototype, getRegisteredPrototype(name));
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

  Object.keys(apis).forEach(function(n) {
    extend(prototype, apis[n]);
  });

  // register polymer-element with document

  document.register('polymer-element', {prototype: prototype});
  
  // namespace shenanigans

  // TODO(sjmiles): find a way to do this that is less terrible
  // copy window.Polymer properties onto `element()`
  extend(element, window.Polymer);
  // make window.Polymer reference `element()`
  window.Polymer = element;

})(Polymer);
