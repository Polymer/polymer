/* 
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {

  // imports

  var bindPattern = Toolkit.bindPattern;

  // constants

  var published$ = '__published';
  var attributes$ = 'attributes';
  var attrProps$ = 'publish';
  //var attrProps$ = 'attributeDefaults';

  var publishAttributes = function(inElement, inPrototype) {
    var published = {};
    // merge attribute names from 'attributes' attribute
    var attributes = inElement.getAttribute(attributes$);
    if (attributes) {
      // attributes='a b c' or attributes='a,b,c'
      var names = attributes.split(attributes.indexOf(',') >= 0 ? ',' : ' ');
      // record each name for publishing
      names.forEach(function(p) {
        p = p.trim();
        if (p) {
          published[p] = null;
        }
      });
    }
    // our suffix prototype chain (inPrototype is 'own')
    var inherited = inElement.options.prototype;
    // install 'attributes' properties on the prototype, unless they
    // are already defaulted
    Object.keys(published).forEach(function(p) {
      if (!(p in inPrototype) && !(p in inherited)) {
        inPrototype[p] = published[p];
      }
    });
    // acquire properties published imperatively
    var imperative = inPrototype[attrProps$];
    if (imperative) {
      // install imperative properties, overriding defaults
      Object.keys(imperative).forEach(function(p) {
        inPrototype[p] = imperative[p];
      });
      // combine declaratively and imperatively published properties
      published = mixin(published, imperative);
    }
    // combine with inherited published properties
    inPrototype[published$] = mixin(
      {},
      inherited[published$],
      published
    );
  };

  function takeAttributes() {
    // for each attribute
    forEach(this.attributes, function(a) {
      // try to match this attribute to a property (attributes are
      // all lower-case, so this is case-insensitive search)
      var name = propertyForAttribute.call(this, a.name);
      if (name) {
        // filter out 'mustached' values, these are to be
        // replaced with bound-data and are not yet values
        // themselves
        if (a.value.search(bindPattern) >= 0) {
          return;
        }
        // get original value
        var defaultValue = this[name];
        // deserialize Boolean or Number values from attribute
        var value = deserializeValue(a.value, defaultValue);
        // only act if the value has changed
        if (value !== defaultValue) {
          // install new value (has side-effects)
          this[name] = value;
        }
      }
    }, this);
  }

  // return the published property matching name, or undefined
  function propertyForAttribute(name) {
    // matchable properties must be published
    var properties = Object.keys(this[published$]);
    // search for a matchable property
    return properties[properties.map(lowerCase).indexOf(name.toLowerCase())];
  }

  var lowerCase = String.prototype.toLowerCase.call.bind(
    String.prototype.toLowerCase);

  var typeHandlers = {
    'string': function(value) {
      return value;
    },
    'date': function(value) {
      return new Date(Date.parse(value) || Date.now());
    },
    'boolean': function(value) {
      if (value === '') {
        return true;
      }

      return value === 'false' ? false : !!value;
    },
    'object': function(value, defaultValue) {
      try {
        // If the string is an object, we can parse is with the JSON library.
        value = JSON.parse(value);
      } catch(e) {
        // If the value is a comma-delimited string, convert to Array.
        var splitValue = value.replace(/\s+/g, '').split(',');
        
        // Otherwise, return the value as-is.
        if (splitValue.length > 1)
        {
          value = splitValue;
        }
      }

      // unless otherwise typed, convert eponymous floats to float values
      var floatVal = parseFloat(value);
      return (String(floatVal) === value) ? floatVal : value;
    }
  };

  function deserializeValue(value, defaultValue) {
    // attempt to infer type from default value
    var inferredType = typeof defaultValue;
    if (defaultValue instanceof Date) {
      inferredType = 'date';
    }

    return typeHandlers[inferredType](value, defaultValue);
  }

  // exports

  Toolkit.takeAttributes = takeAttributes;
  Toolkit.publishAttributes = publishAttributes;
  Toolkit.propertyForAttribute = propertyForAttribute;

})();