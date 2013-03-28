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
    // TODO(sjmiles): allow 'this' to supply a 'delegate'
    HTMLTemplateElement.bindTree(inRoot, this)
    log.bind && console.groupEnd();
  }

  var mustachePattern = /\{\{([^{}]*)}}/;

  // exports
  
  Toolkit.bindModel = bindModel;
  Toolkit.bindPattern = mustachePattern;
  
})();

