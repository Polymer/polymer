/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  var base = {
    PolymerBase: true,
    job: Polymer.job,
    super: Polymer.super,
    // user entry point for constructor-like initialization
    created: function() {
    },
    // TODO(sorvell): temporary BC
    ready: function() {
    },
    createdCallback: function() {
      if (this.ownerDocument.defaultView || this.forceReady ||
          Polymer.preparingElements) {
        this.prepare();
      }
    },
    // system entry point, do not override
    prepare: function() {
      if (this._prepared) {
        return;
      }
      this._prepared = true;
      //this.style.display = 'inline-block';
      // install property observers
      // install boilerplate attributes
      this.copyInstanceAttributes();
      // process input attributes
      this.takeAttributes();
      // do this first so we can observe changes during initialization
      //this.observeProperties();
      // add event listeners
      this.addHostListeners();
      // forces sub-elements to be prepared
      Polymer.preparingElements = true;
      // process declarative resources
      this.parseElements(this.__proto__);
      Polymer.preparingElements = false;
      this.observeProperties();
      //Platform.endOfMicrotask(this.initializeProperties.bind(this));
      // unless this element is inserted into the main document
      // (or the user otherwise specifically prevents it)
      // bindings will self destruct after a short time; this is 
      // necessary to make elements collectable as garbage
      // when polyfilling Object.observe
      //this.asyncUnbindAll();
      // user initialization
      // TODO(sorvell): bc
      //console.log('created', this);
      this.ready();
      this.created();
      // TODO(sorvell): refactor so this doesn't depend on properties already
      // having been observed
      this.initializeProperties();
    },
    enteredDocumentCallback: function() {
      if (!this.forceReady) {
        this.prepare();
      }
      this.cancelUnbindAll(true);
      // invoke user action
      if (this.enteredDocument) {
        this.enteredDocument();
      }
    },
    leftDocumentCallback: function() {
      this.asyncUnbindAll();
      // invoke user action
      if (this.leftDocument) {
        this.leftDocument();
      }
    },
    // recursive ancestral <element> initialization, oldest first
    parseElements: function(p) {
      if (p && p.element) {
        this.parseElements(p.__proto__);
        p.parseElement.call(this, p.element);
      }
    },
    // parse input <element> as needed, override for custom behavior
    parseElement: function(elementElement) {
      this.shadowFromTemplate(this.fetchTemplate(elementElement));
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
      this.attributeToProperty(name, this.getAttribute(name));
      if (this.attributeChanged) {
        this.attributeChanged.apply(this, arguments);
      }
    },
    onMutation: function(node, listener) {
      var observer = new MutationObserver(function() {
        listener.call(this, observer);
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
