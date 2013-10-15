/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {
  var preparingElements = 0;

  var base = {
    PolymerBase: true,
    job: Polymer.job,
    super: Polymer.super,
    // TODO(sorvell): bc, created is currently a synonym for 'ready'.
    // We should call this in createdCallback instead of at ready time or
    // eliminate it.
    created: function() {
    },
    // user entry point for element has shadowRoot and is ready for
    // api interaction
    ready: function() {
    },
    createdCallback: function() {
      if (this.ownerDocument.defaultView || this.alwaysPrepare ||
          preparingElements > 0) {
        this.prepareElement();
      }
    },
    // system entry point, do not override
    prepareElement: function() {
      this._elementPrepared = true;
      // install property observers
      this.observeProperties();
      // install boilerplate attributes
      this.copyInstanceAttributes();
      // process input attributes
      this.takeAttributes();
      // add event listeners
      this.addHostListeners();
      // guarantees that while preparing, any
      // sub-elements are also prepared
      preparingElements++;
      // process declarative resources
      this.parseDeclarations(this.__proto__);
      // decrement semaphore
      preparingElements--;
      // user entry point
      this.ready();
      // TODO(sorvell): bc
      this.created();
    },
    enteredViewCallback: function() {
      if (!this._elementPrepared) {
        this.prepareElement();
      }
      this.cancelUnbindAll(true);
      // invoke user action
      if (this.enteredView) {
        this.enteredView();
      }
      // TODO(sorvell): bc
      if (this.enteredDocument) {
        this.enteredDocument();
      }
    },
    // TODO(sorvell): bc
    enteredDocumentCallback: function() {
      this.enteredViewCallback();
    },
    leftViewCallback: function() {
      if (!this.preventDispose) {
        this.asyncUnbindAll();
      }
      // invoke user action
      if (this.leftView) {
        this.leftView();
      }
      // TODO(sorvell): bc
      if (this.leftDocument) {
        this.leftDocument();
      }
    },
    // TODO(sorvell): bc
    leftDocumentCallback: function() {
      this.leftViewCallback();
    },
    // recursive ancestral <element> initialization, oldest first
    parseDeclarations: function(p) {
      if (p && p.element) {
        this.parseDeclarations(p.__proto__);
        p.parseDeclaration.call(this, p.element);
      }
    },
    // parse input <element> as needed, override for custom behavior
    parseDeclaration: function(elementElement) {
      var template = this.fetchTemplate(elementElement);
      if (template) {
        if (this.element.hasAttribute('lightdom')) {
          this.lightFromTemplate(template);
        } else {
          this.shadowFromTemplate(template);
        }
      }
    },
    // return a shadow-root template (if desired), override for custom behavior
    fetchTemplate: function(elementElement) {
      return elementElement.querySelector('template');
    },
    // utility function that creates a shadow root from a <template>
    shadowFromTemplate: function(template) {
      if (template) {
        // cache elder shadow root (if any)
        var elderRoot = this.shadowRoot;
        // make a shadow root
        var root = this.createShadowRoot();
        // migrate flag(s)
        root.applyAuthorStyles = this.applyAuthorStyles;
        root.resetStyleInheritance = this.resetStyleInheritance;
        // stamp template
        // which includes parsing and applying MDV bindings before being 
        // inserted (to avoid {{}} in attribute values)
        // e.g. to prevent <img src="images/{{icon}}"> from generating a 404.
        var dom = this.instanceTemplate(template);
        // append to shadow dom
        root.appendChild(dom);
        // perform post-construction initialization tasks on shadow root
        this.shadowRootReady(root, template);
        // return the created shadow root
        return root;
      }
    },
    // utility function that stamps a <template> into light-dom
    lightFromTemplate: function(template) {
      if (template) {
        // stamp template
        // which includes parsing and applying MDV bindings before being 
        // inserted (to avoid {{}} in attribute values)
        // e.g. to prevent <img src="images/{{icon}}"> from generating a 404.
        var dom = this.instanceTemplate(template);
        // append to shadow dom
        this.appendChild(dom);
        // perform post-construction initialization tasks on ahem, light root
        this.shadowRootReady(this, template);
        // return the created shadow root
        return dom;
      }
    },
    shadowRootReady: function(root, template) {
      // locate nodes with id and store references to them in this.$ hash
      this.marshalNodeReferences(root);
      // add local events of interest...
      this.addInstanceListeners(root, template);
      // set up pointer gestures
      PointerGestures.register(root);
    },
    // locate nodes with id and store references to them in this.$ hash
    marshalNodeReferences: function(root) {
      // establish $ instance variable
      var $ = this.$ = this.$ || {};
      // populate $ from nodes with ID from the LOCAL tree
      if (root) {
        var n$ = root.querySelectorAll("[id]");
        for (var i=0, l=n$.length, n; (i<l) && (n=n$[i]); i++) {
          $[n.id] = n;
        };
      }
    },
    attributeChangedCallback: function(name, oldValue) {
      // TODO(sjmiles): adhoc filter
      if (name !== 'class' && name !== 'style') {
        this.attributeToProperty(name, this.getAttribute(name));
      }
      if (this.attributeChanged) {
        this.attributeChanged.apply(this, arguments);
      }
    },
    onMutation: function(node, listener) {
      var observer = new MutationObserver(function(mutations) {
        listener.call(this, observer, mutations);
        observer.disconnect();
      }.bind(this));
      observer.observe(node, {childList: true, subtree: true});
    }
  };

  // true if object has own PolymerBase api
  function isBase(object) {
    return object.hasOwnProperty('PolymerBase') 
  }

  // name a base constructor for dev tools

  function PolymerBase() {};
  PolymerBase.prototype = base;
  base.constructor = PolymerBase;
  
  // exports

  scope.Base = PolymerBase;
  scope.isBase = isBase;
  scope.api.instance.base = base;
  
})(Polymer);
