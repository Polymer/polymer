/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

var thisFile = 'toolkit.js';

// NOTE: use attributes on the script tag for this file as directives
// NOTE: uses 'window' and 'document' globals

// acquire directives and base path from script element

var attributes={}, base = '';

(function() {
  var s$ = document.querySelectorAll('script[src]');
  Array.prototype.forEach.call(s$, function(s) {
    var src = s.getAttribute('src');
    if (src.slice(-thisFile.length) === thisFile) {
      attributes = s.attributes;
      base = src.slice(0, -thisFile.length);
    }
  });
})();

// flags

var flags = window.flags || {};

// acquire flags from script tag attributes

for (var i=0, a; (a=attributes[i]); i++) {
  flags[a.name] = a.value || true;
}

// acquire flags from url

if (!flags.noOpts) {
  location.search.slice(1).split('&').forEach(function(o) {
    o = o.split('=');
    flags[o[0]] = o[1] || true;
  });
}

// process log flags

var logFlags = window.logFlags || {};
if (flags.log) {
  flags.log.split(',').forEach(function(f) {
    logFlags[f] = true;
  });
}
window.logFlags = logFlags;

// support exportas directive

scope = scope || {};

if (flags.exportas) {
  window[flags.exportas] = scope;
}

// module exports

scope.flags = flags;

// report effective flags

console.log(flags);

// assemble list of dependencies

var modules = [
  'src/lang.js',
  'src/oop.js',
  'src/register.js',
  'src/bindProperties.js',
  'src/bindMDV.js',
  'src/attrs.js',
  'src/marshal.js',
  'src/events.js',
  'src/observeProperties.js',
  'src/styling.js',
  'src/shimStyling.js',
  'src/path.js',
  'src/job.js',
  'src/boot.js'
];

// write script tags for dependencies

modules.forEach(function(inSrc) {
  document.write('<script src="' + base + inSrc + '"></script>');
});

})();
