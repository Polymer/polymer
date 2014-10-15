/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(scope) {

  // imports

  var log = window.WebComponents ? WebComponents.flags.log : {};
  var EVENT_PREFIX = 'on-';

  // instance events api
  var events = {
    // read-only
    EVENT_PREFIX: EVENT_PREFIX,
    // event listeners on host
    addHostListeners: function() {
      var events = this.eventDelegates;
      log.events && (Object.keys(events).length > 0) && console.log('[%s] addHostListeners:', this.localName, events);
      // NOTE: host events look like bindings but really are not;
      // (1) we don't want the attribute to be set and (2) we want to support
      // multiple event listeners ('host' and 'instance') and Node.bind
      // by default supports 1 thing being bound.
      for (var type in events) {
        var methodName = events[type];
        PolymerGestures.addEventListener(this, type, this.element.getEventHandler(this, this, methodName));
      }
    },
    // call 'method' or function method on 'obj' with 'args', if the method exists
    dispatchMethod: function(obj, method, args) {
      if (obj) {
        log.events && console.group('[%s] dispatch [%s]', obj.localName, method);
        var fn = typeof method === 'function' ? method : obj[method];
        if (fn) {
          fn[args ? 'apply' : 'call'](obj, args);
        }
        log.events && console.groupEnd();
        // NOTE: dirty check right after calling method to ensure 
        // changes apply quickly; in a very complicated app using high 
        // frequency events, this can be a perf concern; in this case,
        // imperative handlers can be used to avoid flushing.
        Polymer.flush();
      }
    }
  };

  // exports

  scope.api.instance.events = events;

  /**
   * @class Polymer
   */

  /**
   * Add a gesture aware event handler to the given `node`. Can be used 
   * in place of `element.addEventListener` and ensures gestures will function
   * as expected on mobile platforms. Please note that Polymer's declarative
   * event handlers include this functionality by default.
   * 
   * @method addEventListener
   * @param {Node} node node on which to listen
   * @param {String} eventType name of the event
   * @param {Function} handlerFn event handler function
   * @param {Boolean} capture set to true to invoke event capturing
   * @type Function
   */
  // alias PolymerGestures event listener logic
  scope.addEventListener = function(node, eventType, handlerFn, capture) {
    PolymerGestures.addEventListener(wrap(node), eventType, handlerFn, capture);
  };

  /**
   * Remove a gesture aware event handler on the given `node`. To remove an
   * event listener, the exact same arguments are required that were passed
   * to `Polymer.addEventListener`.
   * 
   * @method removeEventListener
   * @param {Node} node node on which to listen
   * @param {String} eventType name of the event
   * @param {Function} handlerFn event handler function
   * @param {Boolean} capture set to true to invoke event capturing
   * @type Function
   */
  scope.removeEventListener = function(node, eventType, handlerFn, capture) {
    PolymerGestures.removeEventListener(wrap(node), eventType, handlerFn, capture);
  };

})(Polymer);
