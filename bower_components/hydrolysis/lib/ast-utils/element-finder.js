/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// jshint node: true
'use strict';
var estraverse = require('estraverse');

var esutil    = require('./esutil');
var findAlias = require('./find-alias');

var elementFinder = function elementFinder() {
  /**
   * The list of elements exported by each traversed script.
   */
  var elements = [];

  /**
   * The element being built during a traversal;
   */
  var element;

  /**
   * a set of special case properties. these should only be called
   * when we know we're inside an element definition.
   * @type {Object}
   */
  var propertyHandlers = {
    is: function(node) {
      if (node.type == 'Literal') {
        element.is = node.value;
      }
    },
    publish: function(node) {
      this.properties(node);
    },
    properties: function(node) {
      if (node.type != 'ObjectExpression') {
        return undefined;
      }
      for (var i = 0; i < node.properties.length; i++) {
        var property = node.properties[i];
        var prop = {published: true};
        prop.name = esutil.objectKeyToString(property.key);
        prop.desc = esutil.getAttachedComment(property);
        prop.type = esutil.closureType(property.value);
        if (prop.type) {
          element.properties.push(prop);
          continue;
        }
        if (property.value.type != 'ObjectExpression') {
          throw {
            message: 'Unable to determine name for property key.',
            location: node.loc.start
          };
        }
        /**
         * Parse the expression inside a property object block.
         * property: {
         *   key: {
         *     type: String,
         *     notify: true
         *   }
         * }
         */
        for (var j = 0; j < property.value.properties.length; j++) {
          var propertyArg = property.value.properties[j];
          var propertyKey = esutil.objectKeyToString(propertyArg.key);
          if (propertyKey == 'type') {
            prop.type = esutil.objectKeyToString(propertyArg.value);
            if (!prop.type) {
              throw {
                message: 'Invalid type in property object.',
                location: propertyArg.loc.start
              };
            }
            continue;
          }
          if (propertyKey == 'notify') {
            var val = propertyArg.value;
            if (val.type != 'Literal' || val.value === undefined) {
              throw {
                message: 'Notify expects a conditional.',
                location: propertyArg.loc.start
              };
            }
            prop.notify = val.value;
          }
        }
        element.properties.push(prop);
      }
    }
  };

  var visitors = {
    enterCallExpression: function enterCallExpression(node, parent) {
      var callee = node.callee;
      if (callee.type == 'Identifier') {
        if (callee.name == 'Polymer') {
          element = {};
        }
      }
    },
    leaveCallExpression: function leaveCallExpression(node, parent) {
      var callee = node.callee;
      if (callee.type == 'Identifier') {
        if (callee.name == 'Polymer') {
          if (element) {
            elements.push(element);
            element = undefined;
          }
        }
      }
    },
    enterObjectExpression: function enterObjectExpression(node, parent) {
      if (element && !element.properties) {
        element.properties = [];
        for (var i = 0; i < node.properties.length; i++) {
          var prop = node.properties[i];
          var name = esutil.objectKeyToString(prop.key);
          if (!name) {
            throw {
              message: 'Cant determine name for property key.',
              location: node.loc.start
            };
          }

          if (name in propertyHandlers) {
            propertyHandlers[name](prop.value);
            continue;
          }
          var property = {};
          property.name = name;
          property.desc = esutil.getAttachedComment(prop);
          property.type = esutil.closureType(prop.value);
          element.properties.push(property);
        }
        return estraverse.VisitorOption.Skip;
      }
    }
  };
  return {visitors: visitors, elements: elements};
};

module.exports = elementFinder;
