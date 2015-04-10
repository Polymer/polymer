/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
'use strict';

// jshint node:true

var jsdoc = require('./jsdoc');

var serialize = require('dom5').serialize;

/**
 * Annotates Hydrolysis descriptors, recursively processing any `desc`
 * properties as JSDoc.
 *
 * You probably want to use a more specialized version of this, such as
 * `annotateElement`.
 *
 * Processed JSDoc values will be made available via the `jsdoc` property on a
 * descriptor node.
 *
 * @param {Object} descriptor The descriptor node to recursively process.
 * @return {Object} The descriptor that was given.
 */
function annotate(descriptor) {
  if (!descriptor) return descriptor;

  if (typeof descriptor.desc === 'string') {
    descriptor.jsdoc = jsdoc.parseJsdoc(descriptor.desc);
  }

  Object.keys(descriptor).forEach(function(key) {
    var value = descriptor[key];
    if (value && typeof value === 'object') {
      // Don't annotate parse5 nodes.
      if ('nodeName' in value) return;
      annotate(value);
    }
  });

  return descriptor;
}

/**
 * Annotates documentation found within a Hydrolysis element descriptor.
 *
 * If the element was processed via `hydrolize`, the element's documentation
 * will also be extracted via its <dom-module>.
 *
 * @param {Object} descriptor The element descriptor.
 * @return {Object} The descriptor that was given.
 */
function annotateElement(descriptor) {
  descriptor.desc = _findElementDocs(descriptor.is, descriptor.domModule);
  if (descriptor.desc) {
    descriptor.desc  = _unindent(descriptor.desc);
    descriptor.jsdoc = annotate(descriptor.desc);
  }

  // Descriptors that should have their `desc` properties parsed as JSDoc.
  descriptor.properties.forEach(annotate);

  return descriptor;
}

/**
 * Annotates documentation found within a Hydrolysis feature descriptor.
 *
 * @param {Object} descriptor The feature descriptor.
 * @return {Object} The descriptor that was given.
 */
function annotateFeature(descriptor) {
  if (descriptor.desc) {
    descriptor.desc  = _unindent(descriptor.desc);
    descriptor.jsdoc = annotate(descriptor.desc);
  }

  // Descriptors that should have their `desc` properties parsed as JSDoc.
  descriptor.properties.forEach(annotate);

  return descriptor;
}

/**
 * @param {string} elementId
 * @param {DocumentAST} domModule
 */
function _findElementDocs(elementId, domModule) {
  if (!domModule) {
    return null;
  }
  // Note that we concatenate docs from all sources if we find them.
  var found = [];

  // Do we have a HTML comment on the `<dom-module>`?
  //
  // Confusingly, with our current style, the comment will be attached to
  // `<head>`, rather than being a sibling to the `<dom-module>`
  var grandparent = domModule.parentNode && domModule.parentNode.parentNode;
  if (grandparent.nodeName === 'html') {
    var head = _findLastChildNamed('head', grandparent);
    if (head) {
      var comment = _findLastChildNamed('#comment', head);
      if (comment) {
        found.push(comment.data);
      }
    }
  }

  // What about a `<template is="doc-summary">`?
  for (var i = 0, child; i < domModule.childNodes.length; i++) {
    child = domModule.childNodes[i];
    if (child.tagName === 'template' &&
        _getNodeAttribute(child, 'is') === 'doc-summary') {
      var fragment = child.childNodes[0];
      found.push(serialize(fragment));
      break;
    }
  }

  if (!found.length) return null;
  return found.map(_unindent).join('\n');
}

function _findLastChildNamed(name, parent) {
  var children = parent.childNodes;
  for (var i = children.length - 1, child; i < children.length; i--) {
    child = children[i];
    if (child.nodeName === name) return child;
  }
  return null;
}

function _unindent(docText) {
  var lines  = docText.replace(/\t/g, '  ').split('\n');
  var indent = lines.reduce(function(prev, line) {
    if (/^\s*$/.test(line)) return prev;  // Completely ignore blank lines.

    var lineIndent = line.match(/^(\s*)/)[0].length;
    if (prev === null) return lineIndent;
    return lineIndent < prev ? lineIndent : prev;
  }, null);

  return lines.map(function(l) { return l.substr(indent); }).join('\n');
}

// TODO(nevir): parse5-utils!
function _getNodeAttribute(node, name) {
  for (var i = 0, attr; i < node.attrs.length; i++) {
    attr = node.attrs[i];
    if (attr.name === name) {
      return attr.value;
    }
  }
}

module.exports = {
  annotate:        annotate,
  annotateElement: annotateElement,
  annotateFeature: annotateFeature,
};
