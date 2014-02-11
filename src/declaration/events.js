/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

  // imports

  var log = window.logFlags || {};
  var api = scope.api.instance.events;
  var EVENT_PREFIX = api.EVENT_PREFIX;
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
        if (this.hasEventPrefix(a.name)) {
          // if so, add the info to delegates
          delegates[this.removeEventPrefix(a.name)] = a.value.replace('{{', '')
              .replace('}}', '').trim();
        }
      }
    },
    // starts with 'on-'
    hasEventPrefix: function (n) {
      return n && (n[0] === 'o') && (n[1] === 'n') && (n[2] === '-');
    },
    removeEventPrefix: function(n) {
      return n.slice(prefixLength);
    }
  };

  var prefixLength = EVENT_PREFIX.length;

  // exports
  scope.api.declaration.events = events;

})(Polymer);