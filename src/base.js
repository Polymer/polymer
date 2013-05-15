/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

  // imports

  var log = window.logFlags || {};

  var base = {
    super: $super,
    isPolymerElement: true,
    // MDV binding
    bind: function() {
      Polymer.bind.apply(this, arguments);
    },
    unbind: function() {
      Polymer.unbind.apply(this, arguments);
    },
    job: function() {
      return Polymer.job.apply(this, arguments);
    },
    asyncMethod: function(inMethod, inArgs, inTimeout) {
      var args = (inArgs && inArgs.length) ? inArgs : [inArgs];
      return window.setTimeout(function() {
        (this[inMethod] || inMethod).apply(this, args);
      }.bind(this), inTimeout || 0);
    },
    dispatch: function(inMethodName, inArguments) {
      if (this[inMethodName]) {
        this[inMethodName].apply(this, inArguments);
      }
    },
    fire: function(inType, inDetail, inToNode) {
      var node = inToNode || this;
      log.events && console.log('[%s]: sending [%s]', node.localName, inType);
      node.dispatchEvent(
          new CustomEvent(inType, {bubbles: true, detail: inDetail}));
      return inDetail;
    },
    asend: function(/*inType, inDetail*/) {
      this.asyncMethod("send", arguments);
    },
    // remove class from old, add class to anew, if they exist
    classFollows: function(anew, old, className) {
      if (old) {
        old.classList.remove(className);
      }
      if (anew) {
        anew.classList.add(className);
      }
    }
  };
 
  // TODO(sjmiles): backward-compat for deprecated syntax
  
  base.send = base.fire;
  
  // exports
  
  scope.base = base;
  
})(window.Polymer);
