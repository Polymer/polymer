/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// jshint node: true

var cleancss = require('clean-css');
var fs = require('fs');
var path = require('path');
var uglify = require('uglify-js');
var url = require('url');
var whacko = require('whacko');

var constants = require('./constants.js');
var optparser = require('./optparser.js');
var pathresolver = require('./pathresolver');
var utils = require('./utils');
var setTextContent = utils.setTextContent;
var getTextContent = utils.getTextContent;

var read = {};
var options = {};

// validate options with boolean return
function setOptions(optHash, callback) {
  optparser.processOptions(optHash, function(err, o) {
    if (err) {
      return callback(err);
    }
    options = o;
    callback();
  });
}

function exclude(regexes, href) {
  return regexes.some(function(r) {
    return r.test(href);
  });
}

function excludeImport(href) {
  return exclude(options.excludes.imports, href);
}

function excludeScript(href) {
  return exclude(options.excludes.scripts, href);
}

function excludeStyle(href) {
  return exclude(options.excludes.styles, href);
}

function readFile(file) {
  var content = fs.readFileSync(file, 'utf8');
  return content.replace(/^\uFEFF/, '');
}

// inline relative linked stylesheets into <style> tags
function inlineSheets($, inputPath, outputPath) {
  $('link[rel="stylesheet"]').each(function() {
    var el = $(this);
    var href = el.attr('href');
    if (href && !excludeStyle(href)) {

      var rel = href;
      var inputPath = path.dirname(options.input);
      if (constants.ABS_URL.test(rel)) {
          var abs = path.resolve(inputPath, path.join(options.abspath, rel));
          rel = path.relative(options.outputDir, abs);
      }

      var filepath = path.resolve(options.outputDir, rel);
      // fix up paths in the stylesheet to be relative to the location of the style
      var content = pathresolver.rewriteURL(path.dirname(filepath), outputPath, readFile(filepath));
      var styleEl = whacko('<style>' + content + '</style>');
      // clone attributes
      styleEl.attr(el.attr());
      // don't set href or rel on the <style>
      styleEl.attr('href', null);
      styleEl.attr('rel', null);
      el.replaceWith(whacko.html(styleEl));
    }
  });
}

function inlineScripts($, dir) {
  $(constants.JS_SRC).each(function() {
    var el = $(this);
    var src = el.attr('src');
    if (src && !excludeScript(src)) {

      var rel = src;
      var inputPath = path.dirname(options.input);
      if (constants.ABS_URL.test(rel)) {
          var abs = path.resolve(inputPath, path.join(options.abspath, rel));
          rel = path.relative(options.outputDir, abs);
      }

      var filepath = path.resolve(dir, rel);
      var content = readFile(filepath);
      // NOTE: reusing UglifyJS's inline script printer (not exported from OutputStream :/)
      content = content.replace(/<\x2fscript([>\/\t\n\f\r ])/gi, "<\\/script$1");
      el.replaceWith('<script>' + content + '</script>');
    }
  });
}

function concat(filename) {
  if (!read[filename]) {
    read[filename] = true;
    var $ = whacko.load(readFile(filename));
    var dir = path.dirname(filename);
    pathresolver.resolvePaths($, dir, options.outputDir, options.abspath);
    processImports($);
    inlineSheets($, dir, options.outputDir);
    return $;
  } else if (options.verbose) {
    console.log('Dependency deduplicated');
  }
}

function processImports($, mainDoc) {
  var bodyContent = [];
  $(constants.IMPORTS).each(function() {
    var el = $(this);
    var href = el.attr('href');
    if (!excludeImport(href)) {
      var rel = href;
      var inputPath = path.dirname(options.input);
      if (constants.ABS_URL.test(rel)) {
        var abs = path.resolve(inputPath, path.join(options.abspath, rel));
        rel = path.relative(options.outputDir, abs);
      }
      var $$ = concat(path.resolve(options.outputDir, rel));
      if (!$$) {
        // remove import link
        el.remove();
        return;
      }
      // append import document head to main document head
      el.replaceWith($$('head').html());
      var bodyHTML = $$('body').html();
      // keep the ordering of the import body in main document, before main document's body
      bodyContent.push(bodyHTML);
    } else if (!options.keepExcludes) {
      // if the path is excluded for being absolute, then the import link must remain
      var absexclude = options.abspath ? constants.REMOTE_ABS_URL : constants.ABS_URL;
      if (!absexclude.test(href)) {
        el.remove();
      }
    }
  });
  // prepend the import document body contents to the main document, in order
  var content = bodyContent.join('\n');
  // hide import body content in the main document
  if (mainDoc && content) {
    content = '<div hidden>' + content + '</div>';
  }
  $('body').prepend(content);
}

function findScriptLocation($) {
  var pos = $('body').last();
  if (!pos.length) {
    pos = $.root();
  }
  return pos;
}

// arguments are (index, node), where index is unnecessary
function isCommentOrEmptyTextNode(_, node) {
  if (node.type === 'comment'){
    return true;
  } else if (node.type === 'text') {
    // return true if the node is only whitespace
    return !((/\S/).test(node.data));
  }
}

function compressJS(content, inline) {
  var ast = uglify.parse(content);
  return ast.print_to_string({inline_script: inline});
}

function removeCommentsAndWhitespace($) {
  $(constants.JS_INLINE).each(function() {
    var el = $(this);
    var content = getTextContent(el);
    setTextContent(el, compressJS(content, true));
  });
  $(constants.CSS).each(function() {
    var el = $(this);
    var content = getTextContent(el);
    setTextContent(el, new cleancss({noAdvanced: true}).minify(content));
  });

  $('*').contents().filter(isCommentOrEmptyTextNode).remove();
}

function writeFileSync(filename, data, eop) {
  if (!options.outputSrc) {
    fs.writeFileSync(filename, data, 'utf8');
  } else {
    options.outputSrc(filename, data, eop);
  }
}

function handleMainDocument() {
  // reset shared buffers
  read = {};
  var content = options.inputSrc ? options.inputSrc.toString() : readFile(options.input);
  var $ = whacko.load(content);
  var dir = path.dirname(options.input);
  pathresolver.resolvePaths($, dir, options.outputDir, options.abspath);
  processImports($, true);
  if (options.inline) {
    inlineSheets($, dir, options.outputDir);
  }

  if (options.inline) {
    inlineScripts($, options.outputDir);
  }

  $(constants.JS_INLINE).each(function() {
    var el = $(this);
    var content = getTextContent(el);
    // find ancestor polymer-element node
    var templateElement = el.prev('template').get(0);
    if (templateElement) {
      var match = constants.NEOPRENE_INVOCATION.exec(content);
      var elementName = $(templateElement).attr('id', match[1]);
    }
  });

  // strip noscript from elements, and instead inject explicit Polymer() invocation
  // script, so registration order is preserved
  $(constants.ELEMENTS_NOSCRIPT).each(function() {
    var el = $(this);
    var name = el.attr('name');
    if (options.verbose) {
      console.log('Injecting explicit Polymer invocation for noscript element "' + name + '"');
    }
    el.append('<script>Polymer(\'' + name + '\');</script>');
    el.attr('noscript', null);
  });

  // strip scripts into a separate file
  if (options.csp) {
    if (options.verbose) {
      console.log('Separating scripts into separate file');
    }

    // CSPify main page by removing inline scripts
    var scripts = [];
    $(constants.JS_INLINE).each(function() {
      var el = $(this);
      var content = getTextContent(el);
      scripts.push(content);
      el.remove();
    });

    // join scripts with ';' to prevent breakages due to EOF semicolon insertion
    var scriptName = path.basename(options.output, '.html') + '.js';
    var scriptContent = scripts.join(';' + constants.EOL);
    if (options.strip) {
      scriptContent = compressJS(scriptContent, false);
    }

    writeFileSync(path.resolve(options.outputDir, scriptName), scriptContent);
    // insert out-of-lined script into document
    findScriptLocation($).append('<script src="' + scriptName + '"></script>');
  }

  deduplicateImports($);

  if (options.strip) {
    removeCommentsAndWhitespace($);
  }

  writeFileSync(options.output, $.html(), true);
}

function deduplicateImports($) {
  var imports = {};
  $(constants.IMPORTS).each(function() {
    var el = $(this);
    var href = el.attr('href');
    // TODO(dfreedm): allow a user defined base url?
    var abs = url.resolve('http://', href);
    if (!imports[abs]) {
      imports[abs] = true;
    } else {
      if(options.verbose) {
        console.log('Import Dependency deduplicated');
      }
      el.remove();
    }
  });
}

exports.processDocument = handleMainDocument;
exports.setOptions = setOptions;
