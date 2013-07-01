/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

  // imports

  // logging flags

  var log = window.logFlags || {};

  // magic words

  var EVENT_PREFIX = 'on-';
  var DELEGATES = 'eventDelegates';

  // instance api for events

  var events = {
    // magic words
    EVENT_PREFIX: EVENT_PREFIX,
    DELEGATES: DELEGATES,
    // event listeners on host
    addHostListeners: function() {
      var events = this[DELEGATES];
      log.events && (Object.keys(events).length > 0) && console.log('[%s] addHostListeners:', this.localName, events);
      this.addNodeListeners(this, events, this.hostEventListener);
    },
    // event listeners inside a shadow-root
    addInstanceListeners: function(root, template) {
      var events = template.delegates;
      if (events) {
        log.events && (Object.keys(events).length > 0) && console.log('[%s:root] addInstanceListeners:', this.localName, events);
        this.addNodeListeners(root, events, this.instanceEventListener);
      }
    },
    addNodeListeners: function(node, events, listener) {
      var fn;
      for (var n in events) {
        if (!fn) {
          fn = listener.bind(this);
        }
        node.addEventListener(n, fn);
      }
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
      return this[DELEGATES][event.type];
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
      }
    },
    instanceEventListener: function(event) {
      listenLocal(this, event);
    }
  };

  // TODO(sjmiles): much of the below privatized only because of the vague 
  // notion that the below is too fiddly and we need to revisit the core
  // feature

  function listenLocal(host, event) {
    if (!event.cancelBubble) {
      event.on = EVENT_PREFIX + event.type;
      log.events && console.group("[%s]: listenLocal [%s]", host.localName, event.on);
      if (!event.path || window.ShadowDOMPolyfill) {
        _listenLocalNoEventPath(host, event);
      } else {
        _listenLocal(host, event);
      }
      log.events && console.groupEnd();
    }
  }

  function _listenLocal(host, event) {
    var c = null;
    // use `some` to stop iterating after the first matching target
    Array.prototype.some.call(event.path, function(t) {
      // if we hit host, stop
      if (t === host) {
        return true;
      }
      // find a controller for target `t`, unless we already found `host` 
      // as a controller
      c = (c === host) ? c : findController(t);
      // if we have a controller, dispatch the event, return 'true' if 
      // handler returns true
      if (c && handleEvent(c, t, event)) {
        return true;
      }
    }, this);
  }
  
  // TODO(sorvell): remove when ShadowDOM polyfill supports event path.
  // Note that findController will not return the expected 
  // controller when when the event target is a distributed node.
  // This because we cannot traverse from a composed node to a node 
  // in shadowRoot.
  // This will be addressed via an event path api 
  // https://www.w3.org/Bugs/Public/show_bug.cgi?id=21066
  function _listenLocalNoEventPath(host, event) {
    log.events && console.log('event.path() not supported for', event.type);
    var t = event.target, c = null;
   // if we hit dirt or host, stop
    while (t && t != host) {
      // find a controller for target `t`, unless we already found `host` 
      // as a controller
      c = (c === host) ? c : findController(t);
      // if we have a controller, dispatch the event, return 'true' if 
      // handler returns true
      if (c && handleEvent(c, t, event)) {
        return true;
      }
      t = t.parentNode;
    }
  }

  function findController(node) {
    while (node.parentNode) {
      node = node.parentNode;
    }
    return node.host;
    /*
    // find the shadow root with dispatching host that contains node
    while (node) {
      if (node.host && node.host.dispatchMethod) {
        return node.host
      }
      node = node.parentNode;
    }
    */
  };

  function handleEvent(ctrlr, node, event) {
    var h = node.getAttribute && node.getAttribute(event.on);
    if (h && handleIfNotHandled(node, event)) {
      log.events && console.log('[%s] found handler name [%s]', ctrlr.localName, h);
      ctrlr.dispatchMethod(node, h, [event, event.detail, node]);
    }
    return event.cancelBubble;
  };
  
  function handleIfNotHandled(node, event) {
    var list = eventHandledTable.get(event);
    if (!list) {
      eventHandledTable.set(event, list = []);
    }
    if (list.indexOf(node) < 0) {
      list.push(node);
      return true;
    }
  }

  var eventHandledTable = new SideTable('handledList');

  // exports

  scope.api.instance.events = events;

})(Polymer);