/* 
 * Copyright 2013 The Polymer Authors. All rights reserved.
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

  // model bindings
  function bind(name, model, path) {
    var property = Polymer.propertyForAttribute.call(this, name);
    if (property) {
      registerBinding(this, property, path);
      Polymer.registerObserver(this, 'binding', property,
        Polymer.bindProperties(this, property, model, path)
      );
    } else {
      HTMLElement.prototype.bind.apply(this, arguments);
    }
  }
  
  function unbindModel(node) {
    node.unbindAll();
    for (var child = node.firstChild; child; child = child.nextSibling) {
      unbindModel(child);
    }
  }
  
  function unbind(name) {
    if (!Polymer.unregisterObserver(this, 'binding', name)) {
      HTMLElement.prototype.unbind.apply(this, arguments);
    }
  }
  
  function unbindAll() {
    Polymer.unregisterObserversOfType(this, 'property');
    HTMLElement.prototype.unbindAll.apply(this, arguments);
  }
  
  var mustachePattern = /\{\{([^{}]*)}}/;

  // exports
  
  Polymer.bind = bind;
  Polymer.unbind = unbind;
  Polymer.unbindAll = unbindAll;
  Polymer.getBinding = getBinding;
  Polymer.unbindModel = unbindModel;
  Polymer.bindPattern = mustachePattern;
  
})();

