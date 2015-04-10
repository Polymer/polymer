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
var dom5 = require('dom5');

function isImportNode(node) {
  if (node.tagName.toLowerCase() === 'link') {
    var attrs = node.attrs;
    for (var i = 0, attr; i < attrs.length; i++) {
      attr = attrs[i];
      if (attr.name.toLowerCase() === 'rel' &&
          attr.value.toLowerCase() === 'import') {
        return true;
      }
    }
  }
  return false;
}

function addNode(node, registry) {
  if (registry.hasOwnProperty(node.tagName)) {
    registry[node.tagName].push(node);
  } else if (isImportNode(node)) {
    registry.import.push(node);
  }
}

/**
* Parse5's representation of a parsed html document.
* @typedef {Object} DocumentAST
*/

/**
* The ASTs of the HTML elements needed to represent Polymer elements.
* @typedef {Object} ParsedImport
* @property {Array<DocumentAST>} template The entry points to the AST at each outermost template tag.
* @property {Array<DocumentAST>} script The entry points to the AST at each script tag not inside a template.
* @property {Array<DocumentAST>} style The entry points to the AST at style tag outside a template.
* @property {Array<DocumentAST>} dom-module The entry points to the AST at each outermost dom-module element.
* @property {DocumentAST} ast The full parse5 ast for the document.
*/

/**
* Parse html into ASTs.
* @param  {[type]} htmlString A utf8, html5 document containing polymer element or module definitons.
* @return {ParsedImport}
*/
var importParse = function importParse(htmlString) {
  var doc;
  try {
    doc = dom5.parse(htmlString);
  } catch (err) {
    console.log(err);
    return null;
  }

  var registry = {
      base: [],
      template: [],
      script: [],
      style: [],
      import: [],
      'dom-module': []};

  var queue = [].concat(doc.childNodes);
  var nextNode;
  while (queue.length > 0) {
    nextNode = queue.shift();
    if (nextNode && nextNode.tagName) {
      queue = queue.concat(nextNode.childNodes);
      addNode(nextNode, registry);
    }
  }
  registry.ast = doc;
  return registry;
};

module.exports = importParse;
