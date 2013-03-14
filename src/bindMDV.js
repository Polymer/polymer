/* 
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {
  
  // imports
  
  var log = window.logFlags || {};

  // model bindings
  //
  // convert {{macro}} strings in markup into MDV bindings
  //
  // MDV usually does this work but requires an additional
  // nested template and functions asynchronously

  function bindModel(inRoot) {
    log.bind && console.group("[%s] bindModel", this.localName);
    _bindModel.call(this, inRoot);
    log.bind && console.groupEnd();
  }

  function _bindModel(inRoot) {
    // establish model
    inRoot.model = this;
    // iterate
    forEach(inRoot.childNodes, bindNodeModel, this);
  }

  function bindNodeModel(inNode) {
    var n = inNode;
    // upgraded nodes can have stale wrappers in the virtual tree
    // TODO(sjmiles): https://github.com/toolkitchen/ShadowDOM/issues/27
    if (n.node) {
      n = wrap(n.node);
    } 
    // node's binding model is this component's model
    n.model = this;
    // text-node binding
    if (n.nodeName == '#text') {
      bindPattern.call(this, n, n.textContent);
    }
    // for all other non-template nodes
    else if (n.localName !== 'template') {
      // scan for bindings in attributes
      bindAttributes.call(this, n);
      // continue walking the LOCAL tree
      _bindModel.call(this, n);
    }
  }

  function bindAttributes(inNode) {
    // ad-hoc component test
    var binder = (inNode.ready || (inNode.node && inNode.node.ready)) ? 
        bindComponent : bindPattern;
    // scan for bindings in attributes
    if (inNode.attributes) {
      forEach(inNode.attributes, function(a) {
        binder.call(this, inNode, a.name, a.value);
      }, this);
    }  
  }

  function bindComponent(inNode, inName, inValue) {
    var m = inValue.match(bindPattern.pattern);
    if (m) {
      Toolkit.bindProperties(inNode, inName, this, m[1]);
    }
  }

  function bindPattern(inNode, inName, inValue) {
    if ((inValue || inName).search(bindPattern.pattern) >= 0) {
      addBinding.call(this, inNode, inName, inValue);
    }
  }
  
  bindPattern.pattern = /\{\{([^{}]*)}}/;
  
  function addBinding(inNode, inName, inValue) {
    if (inNode.localName == 'input') {
      addInputBinding(inNode, inName, inValue)
    } else {
      inNode.addBinding(inName, inValue);
    }    
    log.bind && console.log('[%s] addBinding: [%s].[%s] to [%s]',
        this.localName, (inNode.localName || '#text'), inName, inValue);
  }
  
  // support MDV 2-way bindings to inputs
  function addInputBinding(inNode, inName, inValue) {
    var m = inValue.match(bindPattern.pattern);
    if (m) {
      var v = m[1];
      if (inName == 'value') {
        inNode.addValueBinding(v);
      } else if (inName == 'checked') {
        inNode.addCheckedBinding(v);
      } else {
        inNode.addBinding(inName, inValue);
      }
    }
  }

  // exports
  
  Toolkit.bindModel = bindModel;
  Toolkit.bindPattern = bindPattern.pattern;
  
})();

