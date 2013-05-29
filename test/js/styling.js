/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
htmlSuite('styling', function() {
  htmlTest('html/styling/host.html');
  htmlTest('html/styling/host.html?shadow');
  // TODO(sorvell): add when this is expected to pass
  //htmlTest('html/styling/pseudo-scoping.html?shadow');
  htmlTest('html/styling/sheet-order.html');
  htmlTest('html/styling/sheet-order.html?shadow');
});

