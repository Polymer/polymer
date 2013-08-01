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
  "boot.js",
  "lib/lang.js",
  "lib/job.js",
  "lib/dom.js",
  "lib/super.js",
  "lib/deserialize.js",
  "api.js",
  "instance/utils.js",
  "instance/events.js",
  "instance/attributes.js",
  "instance/properties.js",
  "instance/mdv.js",
  "instance/base.js",
  "instance/styles.js",
  "declaration/path.js",
  "declaration/styles.js",
  "declaration/events.js",
  "declaration/properties.js",
  "declaration/attributes.js",
  "declaration/polymer-element.js",
  "deprecated.js"
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
