/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {

  // imports

  var log = window.logFlags || {};

  //
  // automagic event mapping
  //

  var prefix = "on-";

  var parseHostEvents = function(inAttributes, inPrototype) {
//    inDefinition.eventDelegates = mixin(inDefinition.eventDelegates,
//      parseEvents(inAttributes));
    inPrototype.eventDelegates = parseEvents(inAttributes);
  };

  var parseEvents = function(inAttributes) {
    var events = {};
    if (inAttributes) {
      for (var i=0, a; a=inAttributes[i]; i++) {
        if (a.name.slice(0, prefix.length) == prefix) {
          events[a.name.slice(prefix.length)] = a.value;
        }
      }
    }
    return events;
  };

  var accumulateEvents = function(inNode, inEvents) {
    var events = inEvents || {};
    accumulateNodeEvents(inNode, events);
    accumulateChildEvents(inNode, events);
    accumulateTemplatedEvents(inNode, events);
    return events;
  };

  var accumulateNodeEvents = function(inNode, inEvents) {
    var a$ = inNode.attributes;
    if (a$) {
      for (var i=0, a; (a=a$[i]); i++) {
        if (a.name.slice(0, prefix.length) === prefix) {
          accumulateEvent(a.name.slice(prefix.length), inEvents);
        }
      }
    }
  };

  var event_translations = {
    webkitanimationstart: 'webkitAnimationStart',
    webkitanimationend: 'webkitAnimationEnd',
    webkittransitionend: 'webkitTransitionEnd',
    domfocusout: 'DOMFocusOut',
    domfocusin: 'DOMFocusIn'
  };

  var accumulateEvent = function(inName, inEvents) {
    var n = event_translations[inName] || inName;
    inEvents[n] = 1;
  };

  var accumulateChildEvents = function(inNode, inEvents) {
    var cn$ = inNode.childNodes;
    for (var i=0, n; (n=cn$[i]); i++) {
      // TODO(sjmiles): unify calling convention (.call or not .call)
      accumulateEvents(n, inEvents);
      //if (n.$protected) {
       // accumulateHostEvents.call(n.$protected, inEvents);
      //}
    }
  };

  var accumulateTemplatedEvents = function(inNode, inEvents) {
    if (inNode.localName == 'template') {
      var content = getTemplateContent(inNode);
      if (content) {
        accumulateChildEvents(content, inEvents);
      }
    }
  }

  // TODO(sorvell): Currently in MDV, there is no way to get a template's
  // effective content. A template can have a ref property
  // that points to the template from which this one has been cloned.
  // Remove this when the MDV api is improved
  // (https://github.com/toolkitchen/mdv/issues/15).
  var getTemplateContent = function(inTemplate) {
    return inTemplate.ref ? inTemplate.ref.content : inTemplate.content;
  }

  var accumulateHostEvents = function(inEvents) {
    // TODO(sjmiles): we walk the prototype tree to operate on the union of
    // eventDelegates maps; it might be better to merge maps when extending
    var p = Object.getPrototypeOf(this);
    //while (p) {
      if (p.hasOwnProperty('eventDelegates')) {
        for (var n in p.eventDelegates) {
          accumulateEvent(n, inEvents);
        }
      }
      //p = p.__proto__;
    //}
  };

  function bindAccumulatedEvents(inEvents) {
    var fn = listen.bind(this);
    for (var n in inEvents) {
      log.events && console.log('[%s] bindAccumulatedEvents: addEventListener("%s", listen)', this.localName, n);
      //if (ShadowDOM.shim) {
        this.addEventListener(n, fn);
      //} else {
        //bindShadowEvent(this, n, fn);
      //}
    }
  };

  // TODO(sorvell): experimental native shadowDOM event binding.
  function bindShadowEvent(inNode, inEvent, inFn) {
    var shadow = inNode.webkitShadowRoot;
    while (shadow) {
      shadow.addEventListener(inEvent, inFn);
      shadow = shadow.olderSubtree;
    }
  }

  // experimental delegating declarative event handler

  // TODO(sjmiles):
  // we wanted to simply look for nearest ancestor
  // with a 'controller' property to be WLOG
  // but we need to honor ShadowDOM, so we had to
  // customize this search

  var findController = function(inNode) {
    // find the shadow root that contains inNode
    var n = inNode;
    while (n.parentNode && n.localName !== 'shadow-root') {
      n = n.parentNode;
    }
    return n.host;
  };

  var dispatch = function(inNode, inHandlerName, inArguments) {
    if (inNode) {
      log.events && console.group('[%s] dispatch [%s]', inNode.localName, inHandlerName);
      inNode.dispatch(inHandlerName, inArguments);
      log.events && console.groupEnd();
    }
  };

  //
  // new experimental late bound events
  //

  // TODO(sjmiles): lots of work on the code here as we bash out a design
  // we like, cruftiness increasing in the process. Will be cleaned up when
  // design solidifies.
  function listen(inEvent) {
    if (inEvent.cancelBubble) {
      return;
    }
    inEvent.on = prefix + inEvent.type;
    //var on = prefix + inEvent.type;
    log.events && console.group("[%s]: __ [%s]", this.localName, inEvent.on);
    var t = wrap(inEvent.target);
    while (t && t !== this) {
      var c = findController(t);
      if (c === this) {
        log.events && console.log('node [%s]', t.localName);
        if (handleHostEvent.call(this, t, inEvent)) {
          return;
        } else if (handleEvent.call(this, t, inEvent)) {
          return;
        }
      }
      t = t.parentNode;
    }
    // if we are a top-level component, we have to fire our own host events
    if (t === this && !findController(t)) {
      handleHostEvent.call(this, t, inEvent);
    }
    log.events && console.groupEnd();
  };

  function handleEvent(inNode, inEvent) {
    if (inNode.attributes) {
      var h = inNode.getAttribute(inEvent.on);
      if (h) {
        log.events && console.log('[%s] found handler name [%s]', this.localName, h);
        dispatch(this, h, [inEvent, inEvent.detail, inNode]);
      }
    }
    return inEvent.cancelBubble;
  };

  function handleHostEvent(inNode, inEvent) {
    var h = findHostHandler.call(inNode, inEvent.type);
    if (h) {
      log.events && console.log('[%s] found host handler name [%s]', inNode.localName, h);
      dispatch(inNode, h, [inEvent, inEvent.detail, inNode]);
    }
    return inEvent.cancelBubble;
  };

  // find the method name (handler) in eventDelegates mapped to inEventName
  var findHostHandler = function(inEventName) {
    // TODO(sjmiles): walking the tree again is inefficient; combine with code
    // in accumulateHostEvents into something more sane
    var p = this;
    while (p) {
      if (p.hasOwnProperty('eventDelegates')) {
        var h = p.eventDelegates[inEventName]
            || p.eventDelegates[inEventName.toLowerCase()];
        if (h) {
          return h;
        }
      }
      p = p.__proto__;
    }
  };

// exports

Toolkit.parseHostEvents = parseHostEvents;
Toolkit.accumulateEvents = accumulateEvents;
Toolkit.accumulateHostEvents = accumulateHostEvents;
Toolkit.bindAccumulatedEvents = bindAccumulatedEvents;

})();