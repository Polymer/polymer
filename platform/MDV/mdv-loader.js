/*
 * Copyright 2012 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function() {

  var thisFile = "mdv-loader.js";
  var base = "";
  
  var s$ = document.querySelector('script[src $= "' + thisFile + '"]');
  if (s$) {
    base = s$.src.slice(0, -thisFile.length);
  }
 
  var path = base + 'mdv/';
  
  [
    'src/mdv.js',
    '../dirty-check.js'
  ].forEach(function(src) {
    document.write('<script src="' + path + src + '"></script>');
  });
})();