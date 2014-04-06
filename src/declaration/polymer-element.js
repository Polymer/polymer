/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  // imports

  var extend = scope.extend;
  var api = scope.api;
  var queue = scope.queue;
  var whenPolymerReady = scope.whenPolymerReady;
  var getRegisteredPrototype = scope.getRegisteredPrototype;
  var waitingForPrototype = scope.waitingForPrototype;

  // declarative implementation: <polymer-element>

  var prototype = extend(Object.create(HTMLElement.prototype), {

    createdCallback: function() {
      if (this.getAttribute('name')) {
        this.init();
      }
    },

    init: function() {
      // fetch declared values
      this.name = this.getAttribute('name');
      this.extends = this.getAttribute('extends');
      // initiate any async resource fetches
      this.loadResources();
      // register when all constraints are met
      this.registerWhenReady();
    },

    registerWhenReady: function() {
     if (this.registered
       || this.waitingForPrototype(this.name)
       || this.waitingForQueue()
       || this.waitingForResources()) {
          return;
      }
      // TODO(sorvell): ends up calling '_register' by virtue
      // of `waitingForQueue` (see below)
      queue.go(this);
    },

    // TODO(sorvell): refactor, this method is private-ish, but it's being
    // called by the queue object.
    _register: function() {
      //console.log('registering', this.name);
      //console.group('registering', this.name);
      // warn if extending from a custom element not registered via Polymer
      if (isCustomTag(this.extends) && !isRegistered(this.extends)) {
        console.warn('%s is attempting to extend %s, an unregistered element ' +
            'or one that was not registered with Polymer.', this.name,
            this.extends);
      }
      this.register(this.name, this.extends);
      this.registered = true;
      //console.groupEnd();
    },

    waitingForPrototype: function(name) {
      if (!getRegisteredPrototype(name)) {
        // then wait for a prototype
        waitingForPrototype(name, this);
        // emulate script if user is not supplying one
        this.handleNoScript(name);
        // prototype not ready yet
        return true;
      }
    },

    handleNoScript: function(name) {
      // if explicitly marked as 'noscript'
      if (this.hasAttribute('noscript') && !this.noscript) {
        this.noscript = true;
        // TODO(sorvell): CustomElements polyfill awareness:
        // noscript elements should upgrade in logical order
        // script injection ensures this under native custom elements;
        // under imports + ce polyfills, scripts run before upgrades.
        // dependencies should be ready at upgrade time so register
        // prototype at this time.
        if (window.CustomElements && !CustomElements.useNative) {
          Polymer(name);
        } else {
          var script = document.createElement('script');
          script.textContent = 'Polymer(\'' + name + '\');';
          this.appendChild(script);
        }
      }
    },

    waitingForResources: function() {
      return this._needsResources;
    },

    // NOTE: Elements must be queued in proper order for inheritance/composition
    // dependency resolution. Previously this was enforced for inheritance,
    // and by rule for composition. It's now entirely by rule.
    waitingForQueue: function() {
      return queue.wait(this, this.registerWhenReady, this._register);
    },

    loadResources: function() {
      this._needsResources = true;
      this.loadStyles(function() {
        this._needsResources = false;
        this.registerWhenReady();
      }.bind(this));
    }

  });

  // semi-pluggable APIs 

  // TODO(sjmiles): should be fully pluggable (aka decoupled, currently
  // the various plugins are allowed to depend on each other directly)
  api.publish(api.declaration, prototype);

  // utility and bookkeeping

  function isRegistered(name) {
    return Boolean(HTMLElement.getPrototypeForTag(name));
  }

  function isCustomTag(name) {
    return (name && name.indexOf('-') >= 0);
  }

  // boot tasks

  whenPolymerReady(function() {
    document.body.removeAttribute('unresolved');
    document.dispatchEvent(
      new CustomEvent('polymer-ready', {bubbles: true})
    );
  });

  // register polymer-element with document

  document.registerElement('polymer-element', {prototype: prototype});

})(Polymer);
