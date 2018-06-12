/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

const dom5 = require('dom5');
const parse5 = require('parse5');
const {Transform} = require('stream');

const p = dom5.predicates;

function onlyOneLicense(doc) {
  let comments = dom5.nodeWalkAll(doc, dom5.isCommentNode);
  let hasLicense = false;
  for (let i = 0; i < comments.length; i++) {
    let c = comments[i];
    let text = dom5.getTextContent(c);
    if (text.indexOf('@license') === -1 || hasLicense) {
      dom5.remove(c);
    } else {
      hasLicense = true;
    }
  }
}

const blankRx = /^\s+$/;

const isBlankNode = p.AND(dom5.isTextNode, (t) => blankRx.test(dom5.getTextContent(t)));

class MinimalDocTransform extends Transform {
  constructor() {
    super({objectMode: true});
  }
  _transform(file, enc, cb) {
    let doc = parse5.parse(String(file.contents), {locationInfo: true});
    let vulc = dom5.query(doc, p.AND(p.hasTagName('div'), p.hasAttr('by-polymer-bundler'), p.hasAttr('hidden')));
    let charset = dom5.query(doc, p.AND(p.hasTagName('meta'), p.hasAttrValue('charset', 'UTF-8')));

    if (charset) {
      dom5.remove(charset);
    }

    dom5.removeNodeSaveChildren(vulc);

    let scripts = dom5.queryAll(doc, p.hasTagName('script'));
    let collector = scripts[0];
    let contents = [dom5.getTextContent(collector)];
    for (let i = 1, s; i < scripts.length; i++) {
      s = scripts[i];
      dom5.remove(s);
      contents.push(dom5.getTextContent(s));
    }
    dom5.setTextContent(collector, contents.join(''));

    onlyOneLicense(doc);

    dom5.removeFakeRootElements(doc);

    dom5.nodeWalkAll(doc, isBlankNode).forEach((t) => dom5.remove(t));

    file.contents = new Buffer(parse5.serialize(doc));

    cb(null, file);
  }
}

module.exports = () => new MinimalDocTransform();
