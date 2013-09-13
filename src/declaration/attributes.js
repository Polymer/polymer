/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  // imports

  // magic words

  var ATTRIBUTES_ATTRIBUTE = 'attributes';

  // attributes api

  if (Object.__proto__) {
    var chainObject = function(object, inherited) {
      if (inherited && object !== inherited) {
        object.__proto__ = inherited;
      }
    }
  } else {
    chainObject = function(object, inherited) {
      throw "Fix chainObject for IE";
    }
  }

  var attributes = {
    inheritAttributesObjects: function(prototype) {
      // chain our LC property map to our inherited version
      chainObject(prototype._publishLC, prototype.__proto__._publishLC);
      prototype._instanceAttributes = {};
      chainObject(prototype._instanceAttributes, prototype.__proto__._instanceAttributes);
    },
    publishAttributes: function(prototype, base) {
      // merge names from 'attributes' attribute
      var attributes = this.getAttribute(ATTRIBUTES_ATTRIBUTE);
      if (attributes) {
        // get properties to publish
        var publish = prototype.publish || (prototype.publish = {});
        // names='a b c' or names='a,b,c'
        var names = attributes.split(attributes.indexOf(',') >= 0 ? ',' : ' ');
        // record each name for publishing
        for (var i=0, l=names.length, n; i<l; i++) {
          // remove excess ws
          n = names[i].trim();
          // do not override explicit entries
          if (publish[n] === undefined && base[n] === undefined) {
            publish[n] = null;
          }
        }
      }
    },
    // record clonable attributes from <element>
    accumulateInstanceAttributes: function() {
      // inherit instance attributes
      var clonable = this.prototype._instanceAttributes;
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
    // do not clone these attributes onto instances
    blackList: {name: 1, 'extends': 1, constructor: 1, noscript: 1}
  };

  // add ATTRIBUTES_ATTRIBUTE to the blacklist
  attributes.blackList[ATTRIBUTES_ATTRIBUTE] = 1;

  // exports

  scope.api.declaration.attributes = attributes;

})(Polymer);
