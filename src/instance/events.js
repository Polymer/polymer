/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

  // imports

  var log = window.logFlags || {};

  // magic words

  var EVENT_PREFIX = 'on-';
  var HANDLED_LIST = '__eventHandledList__';

  // instance events api

  var events = {
    // read-only
    EVENT_PREFIX: EVENT_PREFIX,
    // event name utilities
    hasEventPrefix: function (n) {
      return n && (n[0] === 'o') && (n[1] === 'n') && (n[2] === '-');
    },
    removeEventPrefix: function(n) {
      return n.slice(prefixLength);
    },
    // event listeners on host
    addHostListeners: function() {
      var events = this.eventDelegates;
      log.events && (Object.keys(events).length > 0) && console.log('[%s] addHostListeners:', this.localName, events);
      this.addNodeListeners(this, events, this.hostEventListener);
    },
    addNodeListeners: function(node, events, listener) {
      // note: conditional inside loop as optimization
      // for empty 'events' object
      var fn;
      for (var n in events) {
        if (!fn) {
          fn = listener.bind(this);
        }
        this.addNodeListener(node, n, fn);
      }
    },
    addNodeListener: function(node, event, listener) {
      node.addEventListener(event, listener);
    },
    hostEventListener: function(event) {
      if (!event.cancelBubble) {
        log.events && console.group("[%s]: hostEventListener(%s)", this.localName, event.type);
        var h = this.findEventDelegate(event);
        if (h) {
          log.events && console.log('[%s] found host handler name [%s]', this.localName, h);
          this.dispatchMethod(this, h, [event, event.detail, this]);
        }
        log.events && console.groupEnd();
      }
    },  
    // find the method name in delegates mapped to event.type
    findEventDelegate: function(event) {
      return this.eventDelegates[event.type];
    },
    // call 'methodName' method on 'node' with 'args', if the method exists
    dispatchMethod: function(node, methodName, args) {
      if (node) {
        log.events && console.group('[%s] dispatch [%s]', node.localName, methodName);
        var fn = this[methodName];
        if (fn) {
          fn[args ? 'apply' : 'call'](this, args);
        }
        log.events && console.groupEnd();
        Platform.flush();
      }
    },
    prepareBinding: function(path, name, node) {
      // if lhs an event prefix,
      if (events.hasEventPrefix(name)) {
        // provide an event-binding callback
        return function(model, name, node) {
          console.log('event: [%s].%s => [%s].%s()"', node.localName, name, model.localName, name);
          node.addEventListener(events.removeEventPrefix(name), 
            function(event) {
              var ctrlr = findController(node);
              if (ctrlr && ctrlr.dispatchMethod) {
                ctrlr.dispatchMethod(ctrlr, path, [event, event.detail, node]);
              }
            }
          );
        };
      }
    }
  };

  var prefixLength = EVENT_PREFIX.length;

  function findController(node) {
    while (node.parentNode) {
      node = node.parentNode;
    }
    return node.host;
  };

  // exports

  scope.api.instance.events = events;

})(Polymer);
