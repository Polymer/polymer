/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

  // imports

  var log = window.logFlags || {};

  var base = {
    super: $super,
    isToolkitElement: true,
    // MDV binding
    bind: function() {
      Toolkit.bind.apply(this, arguments);
    },
    unbind: function() {
      Toolkit.unbind.apply(this, arguments);
    },
    job: function() {
      return Toolkit.job.apply(this, arguments);
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
    send: function(inType, inDetail, inToNode) {
      var node = inToNode || this;
      log.events && console.log('[%s]: sending [%s]', node.localName, inType);
      node.dispatchEvent(
          new CustomEvent(inType, {bubbles: true, detail: inDetail}));
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
  
  // exports
  
  scope.base = base;
  
})(window.Toolkit);
