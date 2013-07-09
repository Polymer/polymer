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

  // register an 'own' prototype for tag `name`
  function element(name, prototype) {
    registry[name] = prototype;
  }
  
  // returns a prototype that chains to <tag> or HTMLElement
  function generatePrototype(tag) {
    return Object.create(HTMLElement.getPrototypeForTag(tag));
  }

  // declarative implementation: <polymer-element> 
 
  var prototype = generatePrototype();
  extend(prototype, {
    // custom element processing
    readyCallback: function() {
      // fetch our element name
      var name = this.getAttribute('name');
      // fetch our extendee name
      var extnds = this.getAttribute('extends');
      // build prototype combining extendee, Polymer base, and named api
      this.prototype = this.generateCustomPrototype(name, extnds);
      // questionable backref
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
        Platform.ShadowCSS.shimStyling(this.templateContent(), name, extnds);
      }
      // register our custom element
      this.register(name);
      // reference constructor in a global named by 'constructor' attribute    
      this.publishConstructor();
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
      return extend(prototype, registry[name]);
    },
    // make a fresh object that inherits from a prototype object
    inheritObject: function(prototype, name) {
      // copy inherited properties onto a new object
      prototype[name] = extend({}, prototype.__proto__[name]);
    },
    // register 'prototype' to custom element 'name', store constructor 
    register: function(name) { 
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
