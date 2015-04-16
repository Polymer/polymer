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

/**
 * An annotated JSDoc block tag, all fields are optionally processed except for
 * the tag:
 *
 *     @TAG {TYPE} NAME DESC
 *
 * `line` and `col` indicate the position of the first character of text that
 * the tag was extracted from - relative to the first character of the comment
 * contents (e.g. the value of `desc` on a descriptor node). Lines are
 * 1-indexed.
 *
 * @typedef {{
 *   tag:   string,
 *   type: ?string,
 *   name: ?string,
 *   body: ?string,
 * }}
 */
var JsdocTag;

/**
 * The parsed representation of a JSDoc comment.
 *
 * @typedef {{
 *   body: ?string,
 *   tags: Array<JsdocTag>,
 * }}
 */
var JsdocAnnotation;

var IS_TAG_LINE  = /^[ \t]*@/;
var DOC_SPLITTER = /(?=[ \t]*\*?[ \t]?@)/;

/**
 * Given a JSDoc string (minus opening/closing comment delimiters), extract its
 * body and tags.
 *
 * @param {string} docs
 * @return {?JsdocAnnotation}
 */
function parseJsdoc(docs) {
  var body = null;
  var tags = [];

  // We build up content (minus line prefixes), and dispatch that content
  // appropriately (as body or tags).
  function flushContent(content) {
    if (content === '') return;
    if (body === null && !IS_TAG_LINE.test(content)) {
      body = content;
    } else {
      tags = tags.concat(parseTag(content));
    }
  }

  // We split the JSDoc string into the body text and each block tag section.
  var buffer = '';
  docs.split(/\r?\n/).forEach(function(line) {
    line = _stripPrefix(line);
    // Hit a block tag; flush the previous buffer.
    if (IS_TAG_LINE.test(line)) {
      flushContent(buffer);
      buffer = '';
    }
    buffer = buffer + (buffer && '\n' || '') + line;
  });
  flushContent(buffer);

  body = unindent(body);
  return {
    body: body === '' ? null : body,
    tags: tags,
  };
}

/**
 * Removes a leading `*` character, and whitespace before it.
 *
 * @param {string} line
 * @return {string}
 */
function _stripPrefix(line) {
  var match = line.match(/^[ \t]*\*(.*)$/);
  if (!match) return line;
  return match[1];
}

var SPLIT_BLOCK_TAGS  = /^[ \t]*(@\S+(?:[\s\n]+@\S+)*)+([\s\S]*)$/m;
// Note that the content (match[2] above) will always have leading whitespace,
// or be an empty string.
//
// TODO(nevir): Do a real parser so that this properly handles matching braces,
// rather than just relying on greedy matching.
var BLOCK_TAG_CONTENT = /^(?:[\s\n]+\{(.*)\})?(?:[\s\n]+(\S+))?(?:[\s\n]+([\s\S]*))?$/m;

/**
 * @param {string} source Original text for the block tag(s).
 * @return {Array<JsdocTag>} The parsed tag(s).
 */
function parseTag(source) {
  var split   = source.match(SPLIT_BLOCK_TAGS);
  var tags    = split[1].split(/[\s\n]+/m).map(function(t) { return t.substr(1); });
  var content = split[2];

  // Note that the content
  var match = content.match(BLOCK_TAG_CONTENT);
  return tags.map(function(tag) {
    return {
      tag:  tag,
      type: match[1] || null,
      name: match[2] || null,
      body: match[3] || null,
    };
  });
}

// Utility

/**
 * @param {JsdocAnnotation} jsdoc
 * @param {string} tagName
 * @return {boolean}
 */
function hasTag(jsdoc, tagName) {
  if (!jsdoc || !jsdoc.tags) return false;
  return jsdoc.tags.some(function(tag) { return tag.tag === tagName; });
}

/**
 * Finds the first JSDoc tag matching `name` and returns its value at `key`.
 *
 * @param {JsdocAnnotation} jsdoc
 * @param {string} tagName
 * @param {string=} key If omitted, the entire tag object is returned.
 * @return {?string|Object}
 */
function getTag(jsdoc, tagName, key) {
  if (!jsdoc || !jsdoc.tags) return false;
  for (var i = 0, tag; tag = jsdoc.tags[i]; i++) {
    if (tag.tag === tagName) {
      return key ? tag[key] : tag;
    }
  }
  return null;
}

/**
 * @param {?string} text
 * @return {?string}
 */
function unindent(text) {
  if (!text) return text;
  var lines  = text.replace(/\t/g, '  ').split('\n');
  var indent = lines.reduce(function(prev, line) {
    if (/^\s*$/.test(line)) return prev;  // Completely ignore blank lines.

    var lineIndent = line.match(/^(\s*)/)[0].length;
    if (prev === null) return lineIndent;
    return lineIndent < prev ? lineIndent : prev;
  }, null);

  return lines.map(function(l) { return l.substr(indent); }).join('\n');
}

module.exports = {
  getTag:     getTag,
  hasTag:     hasTag,
  parseJsdoc: parseJsdoc,
  parseTag:   parseTag,
  unindent:   unindent,
};
