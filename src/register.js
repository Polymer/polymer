/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {

  // imports

  var log = window.logFlags || {};

  // api

  function register(inElement, inPrototype) {
    // in the main document, parser runs script in <element> tags in the wrong
    // context, filter that out here
    if (inElement == window) {
      return;
    }
    // catch common mistake of omitting 'this' in call to register
    if (!inElement || !(inElement instanceof HTMLElement)) {
      throw "First argument to Polymer.register must be an HTMLElement";
    }
    // TODO(sjmiles): it's not obvious at this point whether inElement 
    // will chain to another polymer element, so we just copy base boilerplate 
    // anyway
    // this can result in multiple copies of boilerplate methods on a custom
    // element chain, which is inefficient and has ramifications for 'super'
    // also, we don't yet support intermediate prototypes in calls to
    // HTMLElementElement.prototype.register, so we have to use mixin
    var prototype = mixin({}, Polymer.base, inPrototype);
    // capture defining element
    prototype.elementElement = inElement;
    // TODO(sorvell): install a helper method this.resolvePath to aid in 
    // setting resource paths. e.g. 
    // this.$.image.src = this.resolvePath('images/foo.png')
    // Potentially remove when spec bug is addressed.
    // https://www.w3.org/Bugs/Public/show_bug.cgi?id=21407
    Polymer.addResolvePath(prototype, inElement);
    // install instance method that closes over 'inElement'
    prototype.installTemplate = function() {
      this.super();
      staticInstallTemplate.call(this, inElement);
    };
    // install readyCallback
    prototype.readyCallback = readyCallback;
    // parse declared on-* delegates into imperative form
    Polymer.parseHostEvents(inElement.attributes, prototype);
    // parse attribute-attributes
    Polymer.publishAttributes(inElement, prototype);
    // install external stylesheets as if they are inline
    Polymer.installSheets(inElement);
    Polymer.shimStyling(inElement);
    // invoke element.register
    inElement.register({prototype: prototype});
    // logging
    logFlags.comps && 
          console.log("Polymer: element registered" + inElement.options.name);
  };

  function readyCallback() {
    // invoke 'installTemplate' closure
    this.installTemplate();
    // invoke boilerplate 'instanceReady'
    instanceReady.call(this);
  };

  function staticInstallTemplate(inElement) {
    var template = inElement.querySelector('template');
    if (template) {
      var root = this.webkitCreateShadowRoot();
      // TODO(sjmiles): must be settable ex post facto
      root.applyAuthorStyles = this.applyAuthorStyles;
      // TODO(sjmiles): override createShadowRoot to do this automatically
      CustomElements.watchShadow(this);
      // TODO(sorvell): host not set per spec; we set it for convenience
      // so we can traverse from root to host.
      root.host = this;
      //root.appendChild(templateContent(template).cloneNode(true));
      root.appendChild(template.createInstance());
      // set up gestures
      PointerGestures.register(root);
      PointerEventsPolyfill.setTouchAction(root, 
          this.getAttribute('touch-action'));
      rootCreated.call(this, root);
      return root;
    }
  };

  function rootCreated(inRoot) {
    // to resolve this node synchronously we must process CustomElements 
    // in the subtree immediately
    CustomElements.takeRecords();
    // upgrade elements in shadow root
    //document.upgradeElements(inRoot);
    //document.watchDOM(inRoot);
    // parse and apply MDV bindings
    Polymer.bindModel.call(this, inRoot);
    // locate nodes with id and store references to them in this.$ hash
    Polymer.marshalNodeReferences.call(this, inRoot);
    // add local events of interest...
    var rootEvents = Polymer.accumulateEvents(inRoot);
    Polymer.bindAccumulatedLocalEvents.call(this, inRoot, rootEvents);
  };

  function instanceReady(inElement) {
    // install property observation side effects
    // do this first so we can observe changes during initialization
    Polymer.observeProperties.call(this);
    // process input attributes
    Polymer.takeAttributes.call(this);
    // add host-events...
    var hostEvents = Polymer.accumulateHostEvents.call(this);
    Polymer.bindAccumulatedHostEvents.call(this, hostEvents);
    // invoke user 'ready'
    if (this.ready) {
      this.ready();
    }
  };

  // user utility 

  function findDistributedTarget(inTarget, inNodes) {
    // find first ancestor of target (including itself) that
    // is in inNodes, if any
    var n = inTarget;
    while (n && n != this) {
      var i = Array.prototype.indexOf.call(inNodes, n);
      if (i >= 0) {
        return i;
      }
      n = n.parentNode;
    }
  }

  // exports

  window.Polymer = {
    register: register,
    findDistributedTarget: findDistributedTarget,
    instanceReady: instanceReady
  };

})();
