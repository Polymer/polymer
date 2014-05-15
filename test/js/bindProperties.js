/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

suite('bindProperties', function() {
  var assert = chai.assert;
  
  test('bind properties getter', function() {
    var a = {};
    var b = {bar: 1};
    var observable = new PathObserver(b, 'bar');
    Observer.createBindablePrototypeAccessor(a, 'foo');
    Polymer.api.instance.properties.bindProperty.call(a, 'foo', observable);
    assert.equal(a.foo, 1);
    b.bar = 5;
    assert.equal(a.foo, 5);
  });

  test('bind properties setter', function() {
    var a = {};
    var b = {bar: 1};
    var observable = new PathObserver(b, 'bar');
    Observer.createBindablePrototypeAccessor(a, 'foo');
    Polymer.api.instance.properties.bindProperty.call(a, 'foo', observable);
    assert.equal(b.bar, 1);
    a.foo = 5;
    assert.equal(b.bar, 5);
  });
  
  test('bind properties paths', function() {
    var a = {};
    var b = {bar: {zot: 2}};
    var observable = new PathObserver(b, 'bar.zot');
    Observer.createBindablePrototypeAccessor(a, 'foo');
    Polymer.api.instance.properties.bindProperty.call(a, 'foo', observable);
    assert.equal(a.foo, 2);
    b.bar.zot = 9;
    assert.equal(a.foo, 9);
  });
});

htmlSuite('bindProperties-declarative', function() {
  htmlTest('html/bind-object-repeat.html');
});

