/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  var base = {
    PolymerBase: true,
    job: function(job, callback, wait) {
      if (typeof job === 'string') {
        var n = '___' + job;
        this[n] = Polymer.job.call(this, this[n], callback, wait);
      } else {
        return Polymer.job.call(this, job, callback, wait);
      }
    },
    super: Polymer.super,
    // user entry point for element has had its createdCallback called
    created: function() {
    },
    // user entry point for element has shadowRoot and is ready for
    // api interaction
    ready: function() {
    },
    createdCallback: function() {
      if (this.templateInstance && this.templateInstance.model) {
        console.warn('Attributes on ' + this.localName + ' were data bound ' +
            'prior to Polymer upgrading the element. This may result in ' +
            'incorrect binding types.');
      }
      this.created();
      this.prepareElement();
    },
    // system entry point, do not override
    prepareElement: function() {
      this._elementPrepared = true;
      // install shadowRoots storage
      this.shadowRoots = {};
      // storage for closeable observers.
      this._observers = [];
      // install property observers
      this.observeProperties();
      // install boilerplate attributes
      this.copyInstanceAttributes();
      // process input attributes
      this.takeAttributes();
      // add event listeners
      this.addHostListeners();
      // process declarative resources
      this.parseDeclarations(this.__proto__);
      // TODO(sorvell): CE polyfill uses unresolved attribute to simulate
      // :unresolved; remove this attribute to be compatible with native
      // CE.
      this.removeAttribute('unresolved');
      // user entry point
      this.ready();
    },
    attachedCallback: function() {
      this.cancelUnbindAll();
      // invoke user action
      if (this.attached) {
        this.attached();
      }
      // TODO(sorvell): bc
      if (this.enteredView) {
        this.enteredView();
      }
      // NOTE: domReady can be used to access elements in dom (descendants, 
      // ancestors, siblings) such that the developer is enured to upgrade
      // ordering. If the element definitions have loaded, domReady
      // can be used to access upgraded elements.
      if (!this.hasBeenAttached) {
        this.hasBeenAttached = true;
        if (this.domReady) {
          this.async('domReady');
        }
      }
    },
    detachedCallback: function() {
      if (!this.preventDispose) {
        this.asyncUnbindAll();
      }
      // invoke user action
      if (this.detached) {
        this.detached();
      }
      // TODO(sorvell): bc
      if (this.leftView) {
        this.leftView();
      }
    },
    // TODO(sorvell): bc
    enteredViewCallback: function() {
      this.attachedCallback();
    },
    // TODO(sorvell): bc
    leftViewCallback: function() {
      this.detachedCallback();
    },
    // TODO(sorvell): bc
    enteredDocumentCallback: function() {
      this.attachedCallback();
    },
    // TODO(sorvell): bc
    leftDocumentCallback: function() {
      this.detachedCallback();
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
        var root = this.shadowFromTemplate(template);
        this.shadowRoots[elementElement.name] = root;
      }
    },
    // return a shadow-root template (if desired), override for custom behavior
    fetchTemplate: function(elementElement) {
      return elementElement.querySelector('template');
    },
    // utility function that creates a shadow root from a <template>
    shadowFromTemplate: function(template) {
      if (template) {
        // make a shadow root
        var root = this.createShadowRoot();
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
    lightFromTemplate: function(template, refNode) {
      if (template) {
        // TODO(sorvell): mark this element as a lightDOMController so that
        // event listeners on bound nodes inside it will be called on it.
        // Note, the expectation here is that events on all descendants 
        // should be handled by this element.
        this.lightDomController = true;
        // stamp template
        // which includes parsing and applying MDV bindings before being 
        // inserted (to avoid {{}} in attribute values)
        // e.g. to prevent <img src="images/{{icon}}"> from generating a 404.
        var dom = this.instanceTemplate(template);
        // append to shadow dom
        if (refNode) {
          this.insertBefore(dom, refNode);          
        } else {
          this.appendChild(dom);
        }
        // perform post-construction initialization tasks on ahem, light root
        this.shadowRootReady(this);
        // return the created shadow root
        return dom;
      }
    },
    shadowRootReady: function(root) {
      // locate nodes with id and store references to them in this.$ hash
      this.marshalNodeReferences(root);
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
