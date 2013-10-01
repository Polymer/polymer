/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  // imports
  
  var api = scope.api;
  var isBase = scope.isBase;
  var extend = scope.extend;

  // prototype api

  var prototype = {
    register: function(name, extendee) {
      // build prototype combining extendee, Polymer base, and named api
      this.prototype = this.buildPrototype(name, extendee);
      // back reference declaration element
      // TODO(sjmiles): replace `element` with `elementElement` or `declaration`
      this.prototype.element = this;
      // more declarative features
      this.desugar(name, extendee);
      // register our custom element with the platform
      this.registerPrototype(name, extendee);
      // reference constructor in a global named by 'constructor' attribute
      this.publishConstructor();
    },
    buildPrototype: function(name, extendee) {
      // get our custom prototype (before chaining)
      var prototype = scope.getRegisteredPrototype(name);
      // get basal prototype
      var base = this.generateBasePrototype(extendee);
      // transcribe `attributes` declarations onto own prototype's `publish`
      this.publishAttributes(prototype, base);
      // `publish` properties to the prototype and to attribute watch
      this.publishProperties(prototype, base);
      // infer observers for `observe` list based on method names
      this.inferObservers(prototype);
      // chain various meta-data objects to inherited versions
      this.inheritMetaData(prototype, base);
      // chain custom api to inherited
      prototype = this.chainObject(prototype, base);
      // build side-chained lists to optimize iterations
      this.optimizePropertyMaps(prototype);
      // x-platform fixup
      ensurePrototypeTraversal(prototype);
      return prototype;
    },
    inheritMetaData: function(prototype, base) {
      // chain observe object to inherited
      this.inheritObject('observe', prototype, base);
      // chain publish object to inherited
      this.inheritObject('publish', prototype, base);
      // chain our lower-cased publish map to the inherited version
      this.inheritObject('_publishLC', prototype, base);
      // chain our instance attributes map to the inherited version
      this.inheritObject('_instanceAttributes', prototype, base);
      // chain our event delegates map to the inherited version
      this.inheritObject('eventDelegates', prototype, base);
    },
    // implement various declarative features
    desugar: function(name, extendee) {
      // compile list of attributes to copy to instances
      this.accumulateInstanceAttributes();
      // parse on-* delegates declared on `this` element
      this.parseHostEvents();
      // parse on-* delegates declared in templates
      this.parseLocalEvents();
      // install external stylesheets as if they are inline
      this.installSheets();
      // TODO(sorvell): install a helper method this.resolvePath to aid in 
      // setting resource paths. e.g.
      // this.$.image.src = this.resolvePath('images/foo.png')
      // Potentially remove when spec bug is addressed.
      // https://www.w3.org/Bugs/Public/show_bug.cgi?id=21407
      this.addResolvePathApi();
      // under ShadowDOMPolyfill, transforms to approximate missing CSS features
      if (window.ShadowDOMPolyfill) {
        Platform.ShadowCSS.shimStyling(this.templateContent(), name, extendee);
      }
      // allow custom element access to the declarative context
      if (this.prototype.registerCallback) {
        this.prototype.registerCallback(this);
      }
    },
    // if a named constructor is requested in element, map a reference
    // to the constructor to the given symbol
    publishConstructor: function() {
      var symbol = this.getAttribute('constructor');
      if (symbol) {
        window[symbol] = this.ctor;
      }
    },
    // build prototype combining extendee, Polymer base, and named api
    generateBasePrototype: function(extnds) {
      var prototype = memoizedBases[extnds];
      if (!prototype) {
        // create a prototype based on tag-name extension
        var prototype = HTMLElement.getPrototypeForTag(extnds);
        // insert base api in inheritance chain (if needed)
        prototype = this.ensureBaseApi(prototype);
        // memoize this base
        memoizedBases[extnds] = prototype;
      }
      return prototype;
    },
    // install Polymer instance api into prototype chain, as needed 
    ensureBaseApi: function(prototype) {
      if (!prototype.PolymerBase) {
       prototype = Object.create(prototype);
       // we need a unique copy of base api for each base prototype
       // therefore we 'extend' here instead of simply chaining
       // we could memoize instead, especially for the common cases,
       // in particular, for base === HTMLElement.prototype
       for (var n in api.instance) {
         extend(prototype, api.instance[n]);
       }
      }
      // return buffed-up prototype
      return prototype;
    },
    // ensure prototype[name] inherits from a prototype.prototype[name]
    inheritObject: function(name, prototype, base) {
      // require an object
      var source = prototype[name] || {};
      // chain inherited properties onto a new object
      prototype[name] = this.chainObject(source, base[name]);
    },
    // register 'prototype' to custom element 'name', store constructor 
    registerPrototype: function(name, extendee) { 
      var info = {
        prototype: this.prototype
      }
      // native element must be specified in extends
      if (extendee && extendee.indexOf('-') < 0) {
        info.extends = extendee;
      }
      // register the custom type
      this.ctor = document.register(name, info);
      // constructor shenanigans
      this.prototype.constructor = this.ctor;
      // register the prototype with HTMLElement for name lookup
      HTMLElement.register(name, this.prototype);
    }
  };

  if (Object.__proto__) {
    prototype.chainObject = function(object, inherited) {
      if (object && inherited && object !== inherited) {
        object.__proto__ = inherited;
      }
      return object;
    }
  } else {
    prototype.chainObject = function(object, inherited) {
      if (object && inherited && object !== inherited) {
        var chained = Object.create(inherited);
        object = extend(chained, object);
      }
      return object;
    }
  }

  // memoize base prototypes
  memoizedBases = {};

  // On platforms that do not support __proto__ (version of IE), the prototype
  // chain of a custom element is simulated via installation of __proto__.
  // Although custom elements manages this, we install it here so it's
  // available during desugaring.
  function ensurePrototypeTraversal(prototype) {
    if (!Object.__proto__) {
      var ancestor = Object.getPrototypeOf(prototype);
      prototype.__proto__ = ancestor;
      if (isBase(ancestor)) {
        ancestor.__proto__ = Object.getPrototypeOf(ancestor);
      }
    }
  }

  // exports

  api.declaration.prototype = prototype;

})(Polymer);
