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

var esutil = require('./esutil');

var numFeatures = 0;

module.exports = function featureFinder(attachAST) {
  /** @type {!Array<FeatureDescriptor>} The features we've found. */
  var features = [];

  var visitors = {

    enterCallExpression: function enterCallExpression(node, parent) {
      if (!esutil.matchesCallExpression(node.callee, ['Polymer', 'Base', 'addFeature'])) {
        return;
      }
      /** @type {!FeatureDescriptor} */
      var feature = {};
      this._extractDesc(feature, node, parent);
      this._extractProperties(feature, node, parent);

      features.push(feature);
    },

    _extractDesc: function _extractDesc(feature, node, parent) {
      feature.desc = esutil.getAttachedComment(parent);
    },

    _extractProperties: function _extractProperties(feature, node, parent) {
      var featureNode = node.arguments[0];
      if (featureNode.type !== 'ObjectExpression') {
        console.warn(
            'Expected first argument to Polymer.Base.addFeature to be an object.',
            'Got', featureNode.type, 'instead.');
        return;
      }
      if (!featureNode.properties) return;

      feature.properties = featureNode.properties.map(esutil.toPropertyDescriptor);
    },

  };

  return {visitors: visitors, features: features};
};
