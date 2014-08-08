/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(scope) {

var urlResolver = scope.urlResolver;
var Loader = scope.Loader;

function StyleResolver() {
  this.loader = new Loader(this.regex);
}
StyleResolver.prototype = {
  regex: /@import\s+(?:url)?["'\(]*([^'"\)]*)['"\)]*;/g,
  // Recursively replace @imports with the text at that url
  resolve: function(text, url, callback) {
    var done = function(map) {
      callback(this.flatten(text, url, map));
    }.bind(this);
    this.loader.process(text, url, done);
  },
  // resolve the textContent of a style node
  resolveNode: function(style, url, callback) {
    var text = style.textContent;
    var done = function(text) {
      style.textContent = text;
      callback(style);
    };
    this.resolve(text, url, done);
  },
  // flatten all the @imports to text
  flatten: function(text, base, map) {
    var matches = this.loader.extractUrls(text, base);
    var match, url, intermediate;
    for (var i = 0; i < matches.length; i++) {
      match = matches[i];
      url = match.url;
      // resolve any css text to be relative to the importer, keep absolute url
      intermediate = urlResolver.resolveCssText(map[url], url, true);
      // flatten intermediate @imports
      intermediate = this.flatten(intermediate, base, map);
      text = text.replace(match.matched, intermediate);
    }
    return text;
  },
  loadStyles: function(styles, base, callback) {
    var loaded=0, l = styles.length;
    // called in the context of the style
    function loadedStyle(style) {
      loaded++;
      if (loaded === l && callback) {
        callback();
      }
    }
    for (var i=0, s; (i<l) && (s=styles[i]); i++) {
      this.resolveNode(s, base, loadedStyle);
    }
  }
};

var styleResolver = new StyleResolver();

// exports
scope.styleResolver = styleResolver;

})(Polymer);
