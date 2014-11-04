/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var path = require('path');

module.exports = {
  // directly update the textnode child of <style>
  // equivalent to <style>.textContent
  setTextContent: function(node, text) {
    var unwrapped = node.get(0);
    var child = unwrapped.children[0];
    if (child) {
      child.data = text;
    } else {
      unwrapped.children[0] = {
        data: text,
        type: 'text',
        next: null,
        prev: null,
        parent: unwrapped
      };
    }
  },
  getTextContent: function(node) {
    var unwrapped = node.get(0);
    var child = unwrapped.children[0];
    return child ? child.data : '';
  },
  // escape a string to be used in new RegExp
  escapeForRegExp: function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  },
  unixPath: function(inpath, optSep) {
    var sep = optSep || path.sep;
    if (sep !== '/') {
      inpath = inpath.split(sep).join('/');
    }
    return inpath;
  },
  processPolymerInvocation: function(elementName, invocation) {
    var name = invocation[1] || '';
    var split = invocation[2] || '';
    var trailing = invocation[3];
    var nameIsString = /^['"]/.test(name);
    if (!split) {
      // assume "name" is actually the prototype if it is not a string literal
      if (!name || (name && !nameIsString)) {
        trailing = name + trailing;
        name = '\'' + elementName + '\'';
      }
      if (trailing !== ')') {
        split = ',';
      }
    }
    return 'Polymer(' + name + split + trailing;
  }
};
