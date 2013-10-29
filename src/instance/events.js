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
    // call 'method' or function method on 'obj' with 'args', if the method exists
    dispatchMethod: function(obj, method, args) {
      if (obj) {
        log.events && console.group('[%s] dispatch [%s]', obj.localName, method);
        var fn = typeof method === 'function' ? method : obj[method];
        if (fn) {
          fn[args ? 'apply' : 'call'](obj, args);
        }
        log.events && console.groupEnd();
        Platform.flush();
      }
    },
    /*
      Bind events via attributes of the form on-eventName.
      This method hooks into the model syntax and does adds event listeners as
      needed. By default, binding paths are always method names on the root
      model, the custom element in which the node exists. Adding a '@' in the
      path directs the event binding to use the model path as the event listener.
      In both cases, the actual listener is attached to a generic method which
      evaluates the bound path at event execution time. 
    */
    prepareBinding: function(path, name, node) {
      // if lhs an event prefix,
      if (events.hasEventPrefix(name)) {
        // provide an event-binding callback
        return function(model, node) {
          log.events && console.log('event: [%s].%s => [%s].%s()"', node.localName, model.localName, path);
          var listener = function(event) {
            var ctrlr = findController(node);
            if (ctrlr && ctrlr.dispatchMethod) {
              var obj = ctrlr, method = path;
              if (path[0] == '@') {
                obj = model;
                method = Path.get(path.slice(1)).getValueFrom(model);
              }
              ctrlr.dispatchMethod(obj, method, [event, event.detail, node]);
            }
          };
          var eventName = events.removeEventPrefix(name);
          node.addEventListener(eventName, listener, false);
          return {
            close: function() {
              log.events && console.log('event.remove: [%s].%s => [%s].%s()"', node.localName, name, model.localName, path);
              node.removeEventListener(eventName, listener, false);
            }
          }
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
