/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

  // imports

  var EVENT_PREFIX = scope.api.instance.events.EVENT_PREFIX;
  var log = window.logFlags || {};

  // polymer-element declarative api: events feature

  var events = { 
    parseHostEvents: function() {
      // our delegates map
      var delegates = this.prototype.eventDelegates;
      // extract data from attributes into delegates
      this.addAttributeDelegates(delegates);
    },
    addAttributeDelegates: function(delegates) {
      // for each attribute
      for (var i=0, a; a=this.attributes[i]; i++) {
        // does it have magic marker identifying it as an event delegate?
        if (hasEventPrefix(a.name)) {
          // if so, add the info to delegates
          delegates[removeEventPrefix(a.name)] = a.value;
        }
      }
    },
    parseLocalEvents: function() {
      // extract data from all templates into delegates
      var t$ = this.querySelectorAll('template');
      for (var i=0, l=t$.length, t; (i<l) && (t=t$[i]); i++) {
        // store delegate information directly on template
        t.delegates = {};
        // acquire delegates from entire subtree at t
        this.accumulateTemplatedEvents(t, t.delegates);
        log.events && console.log('[%s] parseLocalEvents:', this.attributes.name.value, t.delegates);
      };
    },
    accumulateTemplatedEvents: function(node, events) {
      if (node.localName === 'template') {
        var content = getTemplateContent(node);
        if (content) {
          this.accumulateChildEvents(content, events);
        }
      }
    },
    accumulateChildEvents: function(node, events) {
      var n$ = node.childNodes;
      for (var i=0, l=n$.length, n; (i<l) && (n=n$[i]); i++) {
        this.accumulateEvents(n, events);
      }
    },
    accumulateEvents: function(node, events) {
      this.accumulateAttributeEvents(node, events);
      this.accumulateChildEvents(node, events);
      this.accumulateTemplatedEvents(node, events);
      return events;
    },
    accumulateAttributeEvents: function(node, events) {
      var a$ = node.attributes;
      if (a$) {
        for (var i=0, l=a$.length, a; (i<l) && (a=a$[i]); i++) {  
          if (hasEventPrefix(a.name)) {
            this.accumulateEvent(removeEventPrefix(a.name), events);
          }
        }
      }
    },
    accumulateEvent: function(name, events) {
      name = this.event_translations[name] || name;
      events[name] = events[name] || 1;
    },
    event_translations: {
      webkitanimationstart: 'webkitAnimationStart',
      webkitanimationend: 'webkitAnimationEnd',
      webkittransitionend: 'webkitTransitionEnd',
      domfocusout: 'DOMFocusOut',
      domfocusin: 'DOMFocusIn'
    }
  };

  var prefixLength = EVENT_PREFIX.length;

  function hasEventPrefix(n) {
    return n.slice(0, prefixLength) === EVENT_PREFIX;
  }

  function removeEventPrefix(n) {
    return n.slice(prefixLength);
  }

  // TODO(sorvell): Currently in MDV, there is no way to get a template's
  // effective content. A template can have a ref property
  // that points to the template from which this one has been cloned.
  // Remove this when the MDV api is improved
  // (https://github.com/polymer-project/mdv/issues/15).
  function getTemplateContent(template) {
    return template.ref ? template.ref.content : template.content;
  }

  // exports

  scope.api.declaration.events = events;

})(Polymer);