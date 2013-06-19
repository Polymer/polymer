/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  var utils = {
    /**
      * Invokes a function asynchronously. The context of the callback
      * function is bound to 'this' automatically.
      * @method async
      * @param {Function|String} method
      * @param {any|Array} args
      * @param {number} timeout
      */
    async: function(method, args, timeout) {
      // when polyfilling Object.observe, ensure changes 
      // propagate before executing the async method
      Platform.flush();
      // second argument to `apply` must be an array
      args = (args && args.length) ? args : [args];
      // function to invoke
      var fn = function() {
        (this[method] || method).apply(this, args);
      }.bind(this);
      // execute `fn` sooner or later
      return timeout ? setTimeout(fn, timeout) : requestAnimationFrame(fn);
    },    
    /**
      * Fire an event.
      * @method fire
      * @param {string} type An event name.
      * @param detail
      * @param {Node} toNode Target node.
      */
    fire: function(type, detail, toNode, bubbles) {
      var node = toNode || this;
      //log.events && console.log('[%s]: sending [%s]', node.localName, inType);
      node.dispatchEvent(
        new CustomEvent(type, {
          bubbles: (bubbles !== undefined ? false : true), 
          detail: detail
        }));
      return detail;
    },
    /**
      * Fire an event asynchronously.
      * @method asyncFire
      * @param {string} type An event name.
      * @param detail
      * @param {Node} toNode Target node.
      */
    asyncFire: function(/*inType, inDetail*/) {
      this.asyncMethod("fire", arguments);
    },
    /**
      * Remove class from old, add class to anew, if they exist
      * @param classFollows
      * @param anew A node.
      * @param old A node
      * @param className
      */
    classFollows: function(anew, old, className) {
      if (old) {
        old.classList.remove(className);
      }
      if (anew) {
        anew.classList.add(className);
      }
    }
  };

  // deprecated

  utils.asyncMethod = utils.async;

  // exports

  scope.api.instance.utils = utils;

})(Polymer);
