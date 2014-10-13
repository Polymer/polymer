/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

suite('marshall', function() {

  test('node references self', function() {
    var foo = document.createElement('x-foo');
    foo.innerHTML = '<div id="bar">barContent</div><div id="zot">zotContent</div>';
    Polymer.api.instance.base.marshalNodeReferences.call(foo, foo);
    assert.equal(foo.$.bar.textContent, 'barContent');
    assert.equal(foo.$.zot.textContent, 'zotContent');
  });

  test('node references shadow root', function() {
    var foo = document.createElement('x-foo');
    var sr = foo.createShadowRoot();
    sr.innerHTML = '<div id="bar">barContent</div><div id="zot">zotContent</div>';
    Polymer.api.instance.base.marshalNodeReferences.call(foo, sr);
    assert.equal(foo.$.bar.textContent, 'barContent');
    assert.equal(foo.$.zot.textContent, 'zotContent');
  });

});
