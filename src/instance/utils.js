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
      var handle = timeout ? setTimeout(fn, timeout) :
          requestAnimationFrame(fn);
      // NOTE: switch on inverting handle to determine which time is used.
      return timeout ? handle : ~handle;
    },
    cancelAsync: function(handle) {
      if (handle < 0) {
        cancelAnimationFrame(~handle);
      } else {
        clearTimeout(handle);
      }
    },
    /**
      * Fire an event.
      * @method fire
      * @returns {Object} event
      * @param {string} type An event name.
      * @param {any} detail
      * @param {Node} onNode Target node.
      */
    fire: function(type, detail, onNode, bubbles, cancelable) {
      var node = onNode || this;
      var detail = detail || {};
      var event = new CustomEvent(type, {
        bubbles: (bubbles !== undefined ? bubbles : true), 
        cancelable: (cancelable !== undefined ? cancelable : true), 
        detail: detail
      });
      node.dispatchEvent(event);
      return event;
    },
    /**
      * Fire an event asynchronously.
      * @method asyncFire
      * @param {string} type An event name.
      * @param detail
      * @param {Node} toNode Target node.
      */
    asyncFire: function(/*inType, inDetail*/) {
      this.async("fire", arguments);
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

  // no-operation function for handy stubs
  var nop = function() {};

  // null-object for handy stubs
  var nob = {};

  // deprecated

  utils.asyncMethod = utils.async;

  // exports

  scope.api.instance.utils = utils;
  scope.nop = nop;
  scope.nob = nob;

})(Polymer);
