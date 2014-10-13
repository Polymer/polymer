/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

suite('attributes', function() {

  test('override dom accessor', function() {
    var p = document.createElement('polymer-element');
    p.setAttribute('name', 'test-override-dom-accessor');
    p.setAttribute('attributes', 'title');
    p.setAttribute('noscript', '');
    p.init();
    // Because Chrome and Safari are busted...
    // https://code.google.com/p/chromium/issues/detail?id=43394
    // https://bugs.webkit.org/show_bug.cgi?id=49739
    //
    // ... Polymer doesn't currently support accessor names used by the DOM.
    var t = document.createElement('test-override-dom-accessor');
    t.title = 123;
    assert.strictEqual(t.title, '123');
    // The 'title' property was not recorded as published.
    assert.deepEqual(p.prototype.publish, {});
  });

});
