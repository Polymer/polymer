/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  // imports

  var syntax = new PolymerExpressions();
  syntax.resolveEventHandler = function(model, path, node) {
    var ctlr = findEventController(node);
    if (ctlr) {
      var fn = path.getValueFrom(ctlr);
      if (fn) {
        return fn.bind(ctlr);
      }
    }
  };

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
  }

  // declaration api supporting mdv
  var mdv = {
    syntax: syntax,
    fetchTemplate: function() {
      return this.querySelector('template');
    },
    templateContent: function() {
      var template = this.fetchTemplate();
      return template && Platform.templateContent(template);
    },
    installBindingDelegate: function(template) {
      if (template) {
        template.bindingDelegate = this.syntax;
      }
    }
  };

  // exports
  scope.api.declaration.mdv = mdv;

})(Polymer);
