/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  // imports

  var log = window.logFlags || 0;

  // use an MDV syntax
    
  var mdv_syntax = new PolymerExpressions();

  // element api supporting mdv

  var mdv = {
    instanceTemplate: function(template) {
      return template.createInstance(this, mdv_syntax);
    },
    bind: function(name, model, path) {
      // note: binding is a prepare signal. This allows us to be sure that any
      // property changes that occur as a result of binding will be observed.
      if (!this._elementPrepared) {
        this.prepareElement();
      }
      var property = this.propertyForAttribute(name);
      if (property) {
        this.unbind(name);
        // use n-way Polymer binding
        var observer = this.bindProperty(property, model, path);
        // stick path on observer so it's available via this.bindings
        observer.path = path;
        // reflect bound property to attribute when binding
        // to ensure binding is not left on attribute if property
        // does not update due to not changing.
        this.relectPropertyToAttribute(name);
        return this.bindings[name] = observer;
      } else {
        return this.super(arguments);
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
        var root = this.shadowRoot;
        while (root) {
          unbindNodeTree(root);
          root = root.olderShadowRoot;
        }
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
  
  var mustachePattern = /\{\{([^{}]*)}}/;
   
  // exports

  scope.bindPattern = mustachePattern;
  scope.api.instance.mdv = mdv;
  
})(Polymer);
