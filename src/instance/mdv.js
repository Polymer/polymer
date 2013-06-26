/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  // imports

  var log = window.logFlags || 0;

  // use an MDV syntax
    
  var mdv_syntax = new ExpressionSyntax();

  // element api supporting mdv

  var mdv = {
    instanceTemplate: function(template) {
      return template.createInstance(this, mdv_syntax);
    },
    // custom MDV entry point (overrides [at least] `HTMLElement.prototype.bind`)
    bind: function(name, model, path) {
      // is the bind target a published property?
      var property = this.propertyForAttribute(name);
      if (property) {
        // use n-way Polymer binding
        this.bindProperty(property, model, path);
        // bookkeep the binding
        registerBinding(this, property, path);
      } else {
        this.super(arguments);
      }
    },
    // custom MDV entry point (overrides [at least] `HTMLElement.prototype.unbind`)
    unbind: function(name) {
      if (this.unbindProperty('binding', name)) {
        // bookkeep the binding
        unregisterBinding(this, name);
      } else {
        this.super(arguments);
      }
    },
    asyncUnbindAll: function() {
      if (!this._unbound) {
        log.unbind && console.log('[%s] asyncUnbindAll', this.localName);
        this._unbindAllJob = this.job(this._unbindAllJob, this.unbindAll, 0);
      }
    },
    unbindAll: function() {
      if (!this._unbound) {
        this.unbindAllProperties();
        this.super(); 
        // unbind shadowRoot
        unbindNodeTree(this.shadowRoot);
        // TODO(sjmiles): must also unbind inherited shadow roots
        this._unbound = true;
      }
    },
    cancelUnbindAll: function(preventCascade) {
      if (this._unbound) {
        log.unbind && console.warn('[%s] already unbound, cannot cancel unbindAll', this.localName);
        return;
      }
      log.unbind && console.log('[%s] cancelUnbindAll', this.localName);
      if (this._unbindAllJob) {
        this._unbindAllJob = this._unbindAllJob.stop();
      }
      // cancel unbinding our shadow tree iff we're not in the process of
      // cascading our tree (as we do, for example, when the element is inserted).
      if (!preventCascade) {
        forNodeTree(this.shadowRoot, function(n) {
          if (n.cancelUnbindAll) {
            n.cancelUnbindAll();
          }
        });
      }
    },
    insertedCallback: function() {
      this.cancelUnbindAll(true);
      // invoke user 'inserted'
      if (this.inserted) {
        this.inserted();
      }
    },
    removedCallback: function() {
      this.asyncUnbindAll();
      // invoke user 'removed'
      if (this.removed) {
        this.removed();
      }
    }
  };

  function unbindNodeTree(node) {
    forNodeTree(node, _nodeUnbindAll);
  }
  
  function _nodeUnbindAll(node) {
    node.unbindAll();
  }
  
  function forNodeTree(node, callback) {
    if (node) {
      callback(node);
      for (var child = node.firstChild; child; child = child.nextSibling) {
        forNodeTree(child, callback);
      }
    }
  }
  
  // bookkeep bindings for reflection

  // bind tracking
  var bindings = new SideTable();

  function registerBinding(element, name, path) {
    var b$ = bindings.get(element);
    if (!b$) {
      bindings.set(element, b$ = {});
    }
    b$[name.toLowerCase()] = path;
  }

  function unregisterBinding(element, name) {
    var b$ = bindings.get(element);
    if (b$) {
      delete b$[name.toLowerCase()];
    }
  }

  function overrideBinding(ctor) {
    var proto = ctor.prototype;
    var originalBind = proto.bind;
    var originalUnbind = proto.unbind;

    proto.bind = function(name, model, path) {
      originalBind.apply(this, arguments);
      // note: must do this last because mdv may unbind before binding
      registerBinding(this, name, path);
    }

    proto.unbind = function(name) {
      originalUnbind.apply(this, arguments);
      unregisterBinding(this, name);
    }
  };

  [Node, Element, Text, HTMLInputElement].forEach(overrideBinding);
  
  var emptyBindings = {};

  function getBindings(element) {
    return element && bindings.get(element) || emptyBindings;
  }

  function getBinding(element, name) {
    return getBindings(element)[name.toLowerCase()];
  }

  var mustachePattern = /\{\{([^{}]*)}}/;
   
  // exports

  scope.bindPattern = mustachePattern;
  scope.getBinding = getBinding;
  scope.api.instance.mdv = mdv;
  
})(Polymer);
