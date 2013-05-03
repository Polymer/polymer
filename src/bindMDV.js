/* 
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {
  
  // imports
  
  var log = window.logFlags || {};

  // bind tracking
  
  var bindings = new SideTable();
  
  function registerBinding(element, name, path) {
    var b$ = bindings.get(element);
    if (!b$) {
      bindings.set(element, b$ = {});
    }
    b$[name] = path;   
  }
  
  function unregisterBinding(element, name) {
    var b$ = bindings.get(element);
    if (b$) {
      delete b$[name];
    }
  }
  
  var originalBind = Element.prototype.bind;
  var originalUnbind = Element.prototype.unbind;
  
  Element.prototype.bind = function(name, model, path) {
    registerBinding(this, name, path);
    originalBind.apply(this, arguments);
  }
  
  Element.prototype.unbind = function(name) {
    unregisterBinding(this, name);
    originalUnbind.apply(this, arguments);
  }
  
  var emptyBindings = {};
  
  function getBindings(element) {
    return bindings.get(element) || emptyBindings;
  }
  
  function getBinding(element, name) {
    return getBindings(element)[name.toLowerCase()];
  }

  // model bindings
  //
  // convert {{macro}} strings in markup into MDV bindings
  //
  // MDV usually does this work but requires an additional
  // nested template and functions asynchronously

  function bindModel(inRoot) {
    log.bind && console.group("[%s] bindModel", this.localName);
    // TODO(sjmiles): allow 'this' to supply a 'delegate'
    HTMLTemplateElement.bindAllMustachesFrom_(inRoot, this)
    log.bind && console.groupEnd();
  }

  function bind(name, model, path) {
    var property = Toolkit.propertyForAttribute.call(this, name);
    if (property) {
      registerBinding(this, property, path);
      Toolkit.bindProperties(this, property, model, path);
    } else {
      HTMLElement.prototype.bind.apply(this, arguments);
    }
  }
  
  function unbind(name) {
    var property = Toolkit.propertyForAttribute.call(this, name);
    if (property) {
      unregisterBinding(this, name);
      Object.defineProperty(this, name, {
        value: this[name],
        enumerable: true,
        writable: true,
        configurable: true
      });
    } else {
      HTMLElement.prototype.unbind.apply(this, arguments);
    }
  }
  
  var mustachePattern = /\{\{([^{}]*)}}/;

  // exports
  
  Toolkit.bind = bind;
  Toolkit.unbind = unbind;
  Toolkit.getBinding = getBinding;
  Toolkit.bindModel = bindModel;
  Toolkit.bindPattern = mustachePattern;
  
})();

