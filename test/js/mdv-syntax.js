/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

htmlSuite('MDV syntax', function() {
  // TODO(sorvell): only test under native until the following 
  // ShadowDOMPolyfill issue is addressed:
  // https://github.com/Polymer/ShadowDOM/issues/189
  if (!window.ShadowDOMPolyfill) {
    htmlTest('html/mdv-syntax.html');
  }
});
