/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

  // imports

  var log = window.logFlags || {};
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
      // We do, however, leverage the event hookup code in PolymerExpressions
      // so that we have a common code path for handling declarative events.
      var self = this, bindable, eventName;
      for (var n in events) {
        eventName = EVENT_PREFIX + n;
        bindable = PolymerExpressions.prepareEventBinding(
          Path.get(events[n]),
          eventName, 
          {
            resolveEventHandler: function(model, path, node) {
              var fn = path.getValueFrom(self);
              if (fn) {
                return fn.bind(self);
              }
            }
          }
        );
        bindable(this, this, false);
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
        Platform.flush();
      }
    }
  };

  // exports

  scope.api.instance.events = events;

})(Polymer);
