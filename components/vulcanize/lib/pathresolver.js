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
var constants = require('./constants.js');
var utils = require('./utils.js');
var setTextContent = utils.setTextContent;
var getTextContent = utils.getTextContent;

function resolvePaths($, input, output, abspath) {
  var assetPath;
  if (abspath) {
    assetPath = rebasePath(input, abspath);
  } else {
    assetPath = path.relative(output, input);
  }
  // make sure assetpath is a folder, but not root!
  if (assetPath) {
    assetPath = utils.unixPath(assetPath) + '/';
  }
  // resolve attributes
  $(constants.URL_ATTR_SEL).each(function() {
    var el = $(this);
    constants.URL_ATTR.forEach(function(a) {
      var val = el.attr(a);
      if (val) {
        if (val.search(constants.URL_TEMPLATE) < 0) {
          if (a === 'style') {
            el.attr(a, rewriteURL(input, output, val, abspath));
          } else {
            el.attr(a, rewriteRelPath(input, output, val, abspath));
          }
        }
      }
    });
  });
  $(constants.CSS).each(function() {
    var el = $(this);
    var text = rewriteURL(input, output, getTextContent(el), abspath);
    setTextContent(el, text);
  });
  $(constants.ELEMENTS).each(function() {
    $(this).attr('assetpath', assetPath);
  });
}

function rebasePath(absolutePath, baselinePath) {
  var absBase = new RegExp('^' + utils.escapeForRegExp(baselinePath));
  return absolutePath.replace(absBase, '');
}

function rewriteRelPath(inputPath, outputPath, rel, abspath) {
  if (constants.ABS_URL.test(rel)) {
    return rel;
  }

  var abs = path.resolve(inputPath, rel);

  if (abspath) {
    return utils.unixPath(rebasePath(abs, abspath));
  }

  var relPath = path.relative(outputPath, abs);
  return utils.unixPath(relPath);
}

function rewriteURL(inputPath, outputPath, cssText, abspath) {
  return cssText.replace(constants.URL, function(match) {
    var path = match.replace(/["']/g, "").slice(4, -1);
    path = rewriteRelPath(inputPath, outputPath, path, abspath);
    return 'url("' + path + '")';
  });
}

exports.resolvePaths = resolvePaths;
exports.rewriteRelPath = rewriteRelPath;
exports.rewriteURL = rewriteURL;
