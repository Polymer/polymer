/*
 * Copyright 2012 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function() {

  var thisFile = "mdv-polyfill.js";

  // if the HTMLElement prototype has addBinding, we should have MDV
  window.hasMDV = Boolean(window.HTMLElement && 
    window.HTMLElement.prototype.addBinding);
  

  // path to this script

  var base = "";
  
  var s$ = document.querySelectorAll('script[src]');
  Array.prototype.forEach.call(s$, function(s) {
    var src = s.getAttribute('src');
    if (src.slice(-thisFile.length) == thisFile) {
      base = src.slice(0, -thisFile.length);
    }
  });
  
  var folder = 'mdv-polyfill';
  var path = base + folder + '/';

  // Polyfill for object observation
  var files = [
    'platform/compat.js',
    'side_table.js',
    'path.js',
    'model.js',
    '../dirty-check.js'
  ];
  
  // Polyfill for mdv
  if (!hasMDV) {
    // Polyfill user-agent styles for template
    document.write('<link rel="stylesheet" href="' + path + 'template_element.css">');
    files = files.concat([
      'transform.js',
      'dependency_parser.js',
      'expression_parser.js',
      'place_holder_parser.js',
      'bind_attribute_parser.js',
      'element_model.js',
      'html5_attributes.js',
      'element_bindings.js',
      'template_element.js'
    ]);
  }
  
  // Install template decoration API for Components 
  files.push('../template_decorate.js');
  
  files.forEach(function(src) {
    document.write('<script src="' + path + src + '"></script>');
  });
})();