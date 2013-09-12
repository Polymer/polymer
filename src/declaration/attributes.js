/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  // imports

  var api = scope.api.instance.attributes;

  //var PUBLISHED = api.PUBLISHED;
  var INSTANCE_ATTRIBUTES = api.INSTANCE_ATTRIBUTES;

  // magic words

  var PUBLISH = 'publish';
  var ATTRIBUTES = 'attributes';

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
      prototype[INSTANCE_ATTRIBUTES] = {};
      chainObject(prototype[INSTANCE_ATTRIBUTES], prototype.__proto__[INSTANCE_ATTRIBUTES]);
      //this.inheritObject(prototype, PUBLISHED);
      //this.inheritObject(prototype, INSTANCE_ATTRIBUTES);
    },
    //
    parsePublished: function(prototype) {
      // transcribe `attributes` declarations onto own prototype's `publish`
      var publish = this.publishAttributes(prototype);
      // if we have any properties to publish
      if (publish) {
        // transcribe `publish` entries onto own prototype
        this.publishProperties(publish, prototype);
        // construct map of lower-cased property names
        prototype._publishLC = this.lowerCaseMap(publish);
      }
    },
    publishAttributes: function(prototype) {
      // merge names from 'attributes' attribute
      var attributes = this.getAttribute(ATTRIBUTES);
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
          if (publish[n] === undefined) {
            publish[n] = null;
          }
        }
      }
      return prototype.publish;
    },
    publishProperties: function(published, prototype) {
      // ensure a prototype value for each one
      for (var n in published) {
        if (prototype[n] === undefined) {
          prototype[n] = published[n];
        }
      }
    },
    lowerCaseMap: function(published) {
      var map = {};
      for (var n in published) {
        map[n.toLowerCase()] = n;
      }
      return map;
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
    // do not clone these attributes onto instances
    blackList: {name: 1, 'extends': 1, constructor: 1, noscript: 1}
  };

  // add ATTRIBUTES symbol to blacklist
  attributes.blackList[ATTRIBUTES] = 1;

  // exports

  scope.api.declaration.attributes = attributes;

})(Polymer);
