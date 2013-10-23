/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

  // imports

  var api = scope.api.instance.events;
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
        if (api.hasEventPrefix(a.name)) {
          // if so, add the info to delegates
          delegates[api.removeEventPrefix(a.name)] = a.value.replace('{{', '')
              .replace('}}', '').trim();
        }
      }
    },
    event_translations: {
      webkitanimationstart: 'webkitAnimationStart',
      webkitanimationend: 'webkitAnimationEnd',
      webkittransitionend: 'webkitTransitionEnd',
      domfocusout: 'DOMFocusOut',
      domfocusin: 'DOMFocusIn'
    }
  };

  // exports

  scope.api.declaration.events = events;

})(Polymer);