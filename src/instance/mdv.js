/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  // imports

  var log = window.logFlags || 0;
  var events = scope.api.instance.events;

  var syntax = new PolymerExpressions();
  syntax.resolveEventHandler = function(model, path, node) {
    var ctlr = findEventController(node);
    if (ctlr) {
      var fn = path.getValueFrom(ctlr);
      if (fn) {
        return fn.bind(ctlr);
      }
    }
  }

  // An event controller is the host element for the shadowRoot in which 
  // the node exists, or the first ancestor with a 'lightDomController'
  // property.
  function findEventController(node) {
    while (node.parentNode) {
      if (node.lightDomController) {
        return node;
      }
      node = node.parentNode;
    }
    return node.host;
  };

  // element api supporting mdv

  var mdv = {
    syntax: syntax,
    instanceTemplate: function(template) {
      var dom = template.createInstance(this, this.syntax);
      this.registerObservers(dom.bindings_);
      return dom;
    },
    bind: function(name, observable, oneTime) {
      var property = this.propertyForAttribute(name);
      if (!property) {
        // TODO(sjmiles): this mixin method must use the special form
        // of `super` installed by `mixinMethod` in declaration/prototype.js
        return this.mixinSuper(arguments);
      } else {
        // use n-way Polymer binding
        var observer = this.bindProperty(property, observable);
        this.reflectPropertyToAttribute(property);
        // NOTE: reflecting binding information is typically required only for
        // tooling. It has a performance cost so it's opt-in in Node.bind.
        if (Platform.enableBindingsReflection) {
          observer.path = observable.path_;
          this.bindings_ = this.bindings_ || {};
          this.bindings_[name] = observer;
        }
        return observer;
      }
    },
    // TODO(sorvell): unbind/unbindAll has been removed, as public api, from
    // TemplateBinding. We still need to close/dispose of observers but perhaps
    // we should choose a more explicit name.
    asyncUnbindAll: function() {
      if (!this._unbound) {
        log.unbind && console.log('[%s] asyncUnbindAll', this.localName);
        this._unbindAllJob = this.job(this._unbindAllJob, this.unbindAll, 0);
      }
    },
    unbindAll: function() {
      if (!this._unbound) {
        this.closeObservers();
        this.closeNamedObservers();
        this._unbound = true;
      }
    },
    cancelUnbindAll: function() {
      if (this._unbound) {
        log.unbind && console.warn('[%s] already unbound, cannot cancel unbindAll', this.localName);
        return;
      }
      log.unbind && console.log('[%s] cancelUnbindAll', this.localName);
      if (this._unbindAllJob) {
        this._unbindAllJob = this._unbindAllJob.stop();
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
