/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {
  
var thisFile = 'polymer.js';
var scopeName = 'Polymer';

var modules = [
  "../platform/platform.js"
].concat([
  "shimStyling.js",
  "lang.js",
  "dom.js",
  "deserialize.js",
  "job.js",
  "super.js",
  "api.js",
  "instance-events.js",
  "instance-attributes.js",
  "instance-properties.js",
  "instance-mdv.js",
  "instance-base.js",
  "instance-styles.js",
  "declarative-path.js",
  "declarative-events.js",
  "declarative-attributes.js",
  "declarative-styles.js",
  "polymer-element.js"
].map(function(n) {
  return "src/" + n;
}));

// export 

window[scopeName] = {
  entryPointName: thisFile,
  modules: modules
};

// bootstrap

var script = document.querySelector('script[src*="' + thisFile + '"]');
var src = script.attributes.src.value;
var basePath = src.slice(0, src.indexOf(thisFile));

if (!window.Loader) {
  var path = basePath + 'tools/loader/loader.js';
  document.write('<script src="' + path + '"></script>');
} 
document.write('<script>Loader.load("' + scopeName + '")</script>');
  
})();
