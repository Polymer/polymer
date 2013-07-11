/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  // imports

  var api = scope.api.instance.attributes;

  var PUBLISHED = api.PUBLISHED;
  var INSTANCE_ATTRIBUTES = api.INSTANCE_ATTRIBUTES;

  // magic words

  var PUBLISH = 'publish';
  var ATTRIBUTES = 'attributes';

  // attributes api

  var attributes = {
    inheritAttributesObjects: function(prototype) {
      this.inheritObject(prototype, PUBLISHED);
      this.inheritObject(prototype, INSTANCE_ATTRIBUTES);
    },
    parseAttributes: function() {
      this.publishAttributes(this.prototype);
      this.publishProperties(this.prototype);
      this.accumulateInstanceAttributes();
    },
    publishAttributes: function(prototype) {
      // get published properties
      var published = prototype[PUBLISHED];
      // merge attribute names from 'attributes' attribute
      var attributes = this.getAttribute(ATTRIBUTES);
      if (attributes) {
        // attributes='a b c' or attributes='a,b,c'
        var names = attributes.split(attributes.indexOf(',') >= 0 ? ',' : ' ');
        // record each name for publishing
        names.forEach(function(p) {
          p = p.trim();
          if (p && !(p in published)) {
            published[p] = null;
          }
        });
      }
      // install 'attributes' as properties on the prototype, 
      // but don't override
      Object.keys(published).forEach(function(p) {
        if (!(p in prototype)) {
          prototype[p] = published[p];
        }
      });
    },
    publishProperties: function(prototype) {
      this.publishPublish(prototype);
    },
    publishPublish: function(prototype) {
      // process only the PUBLISH block on this prototype, not the chain
      if (!prototype.hasOwnProperty(PUBLISH)) {
        return;
      }
      // acquire properties published imperatively
      var imperative = prototype[PUBLISH];
      if (imperative) {
        // install imperative properties, overriding defaults
        Object.keys(imperative).forEach(function(p) {
          prototype[p] = imperative[p];
        });
        // combine with other published properties
        Platform.mixin(
          prototype[PUBLISHED],
          imperative
        );
      }
    },
    // record clonable attributes from <element>
    accumulateInstanceAttributes: function() {
      // inherit instance attributes
      var clonable = this.prototype[INSTANCE_ATTRIBUTES];
      // merge attributes from element
      this.attributes.forEach(function(a) {
        if (this.isInstanceAttribute(a.name)) {
          clonable[a.name] = a.value;
        }
      }, this);
    },
    isInstanceAttribute: function(name) {
      return !this.blackList[name] && name.slice(0,3) !== 'on-';
    },
    blackList: {name: 1, 'extends': 1, constructor: 1}
  };

  // add ATTRIBUTES symbol to blacklist
  attributes.blackList[ATTRIBUTES] = 1;

  // exports

  scope.api.declaration.attributes = attributes;
  
})(Polymer);
