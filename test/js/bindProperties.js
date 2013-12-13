/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

suite('bindProperties', function() {
  var assert = chai.assert;
  
  test('bind properties getter', function() {
    var a = {};
    var b = {bar: 1};
    var observable = new PathObserver(b, 'bar');
    Polymer.api.instance.properties.bindProperty.call(a, 'foo', observable);
    assert.equal(a.foo, 1);
    b.bar = 5;
    assert.equal(a.foo, 5);
  });

  test('bind properties setter', function() {
    var a = {};
    var b = {bar: 1};
    var observable = new PathObserver(b, 'bar');
    Polymer.api.instance.properties.bindProperty.call(a, 'foo', observable);
    assert.equal(b.bar, 1);
    a.foo = 5;
    assert.equal(b.bar, 5);
  });
  
  test('bind properties paths', function() {
    var a = {};
    var b = {bar: {zot: 2}};
    var observable = new PathObserver(b, 'bar.zot');
    Polymer.api.instance.properties.bindProperty.call(a, 'foo', observable);
    assert.equal(a.foo, 2);
    b.bar.zot = 9;
    assert.equal(a.foo, 9);
  });
});

htmlSuite('bindProperties-declarative', function() {
  htmlTest('html/bind-object-repeat.html');
});

