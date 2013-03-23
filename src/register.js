/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {

  // imports

  var log = window.logFlags || {};

  function register(inElement, inPrototype) {
    // in the main document, parser runs script in <element> tags in the wrong
    // context, filter that out here
    if (inElement == window) {
      return;
    }
    // we don't yet support intermediate prototypes in calls to
    // HTMLElementElement.prototype.register, so we have to mix them
    // together
    var prototype = mixin({}, base, inPrototype);
    // install custom callbacks
    prototype.installTemplate = function() {
      this.super();
      installTemplate.call(this, inElement);
    };
    prototype.readyCallback = function() {
      // TODO(sjmiles):
      // polyfill has unwrapped 'this' because it thinks readyCallback
      // is an internal method
      // I believe is a general problem: there is native API that
      // needs unwrapped 'this', but all custom API needs wrapped objects
      var instance = wrap(this);
      // invoke boilerplate 'installTemplate'
      instance.installTemplate();
      // invoke boilerplate 'instanceReady'
      instanceReady.call(instance);
    }
    // parse declared on-* delegates into imperative form
    Toolkit.parseHostEvents(inElement.attributes, prototype);
    //
    Toolkit.installSheets(inElement);
    // invoke element.register
    inElement.register({prototype: prototype});
    // logging
    console.log("initialized component " + inElement.options.name);
  };

  function installTemplate(inElement) {
    var template = inElement.querySelector('template');
    if (template) {
      var root = this.webkitCreateShadowRoot();
      // TODO(sorvell): host not set per spec; we set it for convenience
      // so we can traverse from root to host.
      root.host = this;
      root.appendChild(templateContent(template).cloneNode(true));
      rootCreated.call(this, root);
      return root;
    }
  };

  function rootCreated(inRoot) {
    // upgrade elements in shadow root
    document.upgradeElements(inRoot);
    // parse and apply MDV bindings
    Toolkit.bindModel.call(this, inRoot);
    // locate nodes with id and store references to them in this.$ hash
    Toolkit.marshalNodeReferences.call(this, inRoot);
    // add local events of interest...
    var rootEvents = Toolkit.accumulateEvents(inRoot);
    Toolkit.bindAccumulatedLocalEvents.call(this, inRoot, rootEvents);
  };

  function instanceReady(inElement) {
    // install property observation side effects
    // do this first so we can observe changes during initialization
    Toolkit.observeProperties.call(this);
    // process input attributes
    Toolkit.takeAttributes.call(this);
    // add host-events...
    var hostEvents = Toolkit.accumulateHostEvents.call(this);
    Toolkit.bindAccumulatedHostEvents.call(this, hostEvents);
    // invoke user 'ready'
    this.ready();
  };

  var base = {
    ready: function() {
    },
    super: $super,
    asyncMethod: function(inMethod, inArgs, inTimeout) {
      var args = (inArgs && inArgs.length) ? inArgs : [inArgs];
      return window.setTimeout(function() {
        this[inMethod].apply(this, args);
      }.bind(this), inTimeout || 0);
    },
    dispatch: function(inMethodName, inArguments) {
      if (this[inMethodName]) {
        this[inMethodName].apply(this, inArguments);
      }
    },
    send: function(inType, inDetail, inToNode) {
      var node = inToNode || this;
      log.events && console.log('[%s]: sending [%s]', node.localName, inType);
      node.dispatchEvent(
          new CustomEvent(inType, {bubbles: true, detail: inDetail}));
    },
    asend: function(/*inType, inDetail*/) {
      this.asyncMethod("send", arguments);
    },
    findDistributedTarget: function(inTarget, inNodes) {
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
  };

  // exports

  window.Toolkit = {
    register: register
  };

})();