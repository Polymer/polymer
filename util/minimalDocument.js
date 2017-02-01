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

const dom5 = require('dom5');
const {Transform} = require('stream');

const p = dom5.predicates;

function isBlankTextNode(node) {
  return node && dom5.isTextNode(node) && !/\S/.test(dom5.getTextContent(node));
}

function replaceWithChildren(node) {
  if (!node) {
    return;
  }
  let parent = node.parentNode;
  let idx = parent.childNodes.indexOf(node);
  let children = node.childNodes;
  children.forEach(function(n) {
    n.parentNode = parent;
  });
  let til = idx + 1;
  let next = parent.childNodes[til];
  // remove newline text node as well
  while (isBlankTextNode(next)) {
    til++;
    next = parent.childNodes[til];
  }
  parent.childNodes = parent.childNodes.slice(0, idx).concat(children, parent.childNodes.slice(til));
}

class MinimalDocTransform extends Transform {
  constructor() {
    super({objectMode: true});
  }
  _transform(file, enc, cb) {
    let doc = dom5.parse(String(file.contents));
    let head = dom5.query(doc, p.hasTagName('head'));
    let body = dom5.query(doc, p.hasTagName('body'));
    let vulc = dom5.query(body, p.AND(p.hasTagName('div'), p.hasAttr('by-vulcanize'), p.hasAttr('hidden')));
    let charset = dom5.query(doc, p.AND(p.hasTagName('meta'), p.hasAttrValue('charset', 'UTF-8')));

    if (charset) {
      dom5.remove(charset);
    }

    replaceWithChildren(head);
    replaceWithChildren(vulc);
    replaceWithChildren(body);

    let scripts = dom5.queryAll(doc, p.hasTagName('script'));
    let collector = scripts[0];
    let contents = [dom5.getTextContent(collector)];
    for (let i = 1, s; i < scripts.length; i++) {
      s = scripts[i];
      dom5.remove(s);
      contents.push(dom5.getTextContent(s));
    }
    dom5.setTextContent(collector, contents.join(''));

    let html = dom5.query(doc, p.hasTagName('html'));
    replaceWithChildren(html);

    file.contents = new Buffer(dom5.serialize(doc));

    cb(null, file);
  }
}

module.exports = () => new MinimalDocTransform();
