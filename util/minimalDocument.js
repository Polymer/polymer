/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http:polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http:polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http:polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http:polymer.github.io/PATENTS.txt
 */

// jshint node: true
'use strict';

var dom5 = require('dom5');
var through2 = require('through2');

var p = dom5.predicates;

function isBlankTextNode(node) {
  return node && dom5.isTextNode(node) && !/\S/.test(dom5.getTextContent(node));
}

function replaceWithChildren(node) {
  if (!node) {
    return;
  }
  var parent = node.parentNode;
  var idx = parent.childNodes.indexOf(node);
  var children = node.childNodes;
  children.forEach(function(n) {
    n.parentNode = parent;
  });
  var til = idx + 1;
  var next = parent.childNodes[til];
  // remove newline text node as well
  while (isBlankTextNode(next)) {
    til++;
    next = parent.childNodes[til];
  }
  parent.childNodes = parent.childNodes.slice(0, idx).concat(children, parent.childNodes.slice(til));
}

module.exports = function() {
  return through2.obj(function(file, enc, cb) {
    var doc = dom5.parse(String(file.contents));
    var head = dom5.query(doc, p.hasTagName('head'));
    var body = dom5.query(doc, p.hasTagName('body'));
    var vulc = dom5.query(body, p.AND(p.hasTagName('div'), p.hasAttr('by-vulcanize'), p.hasAttr('hidden')));
    var charset = dom5.query(doc, p.AND(p.hasTagName('meta'), p.hasAttrValue('charset', 'UTF-8')));

    if (charset) {
      dom5.remove(charset);
    }

    replaceWithChildren(head);
    replaceWithChildren(vulc);
    replaceWithChildren(body);

    var scripts = dom5.queryAll(doc, p.hasTagName('script'));
    var collector = scripts[0];
    var contents = [];
    for (var i = 0, s; i < scripts.length; i++) {
      s = scripts[i];
      if (i > 0) {
        dom5.remove(s);
      }
      contents.push(dom5.getTextContent(s));
    }
    dom5.setTextContent(collector, contents.join(''));

    var html = dom5.query(doc, p.hasTagName('html'));
    replaceWithChildren(html);

    file.contents = new Buffer(dom5.serialize(doc));

    cb(null, file);
  });
};
