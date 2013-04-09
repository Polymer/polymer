/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

suite('bindProperties', function() {
  var assert = chai.assert;
  
  test('bind properties getter', function() {
    var a = {};
    var b = {bar: 1};
    Toolkit.bindProperties(a, 'foo', b, 'bar');
    assert.equal(a.foo, 1);
    b.bar = 5;
    assert.equal(a.foo, 5);
  });
  
  test('bind properties setter', function() {
    var a = {};
    var b = {bar: 1};
    Toolkit.bindProperties(a, 'foo', b, 'bar');
    assert.equal(b.bar, 1);
    a.foo = 5;
    assert.equal(b.bar, 5);
  });
  
  test('bind properties paths', function() {
    var a = {};
    var b = {bar: {zot: 2}};
    Toolkit.bindProperties(a, 'foo', b, 'bar.zot');
    assert.equal(a.foo, 2);
    b.bar.zot = 9;
    assert.equal(a.foo, 9);
  });
});

htmlSuite('bindProperties-declarative', function() {
  htmlTest('html/bind-object-repeat.html');
});

/*
suite('bindProperties-declarative', function() {
  var assert = chai.assert;

  var listener;
  var magic;
  var iframe;
  
  setup(function() {
    listener = window.addEventListener("message", function(event) {
      if (event.data === 'ok') {
        magic();
      } else {
        throw event.data;
      }
    });
    iframe = document.createElement('iframe');
    iframe.style.cssText = 'position: absolute; left: -9000em; width:768px; height: 1024px';
    document.body.appendChild(iframe);
  });

  teardown(function() {
    window.removeEventListener(listener);
    document.body.removeChild(iframe);
  });

  function htmlTest(src) {
    test(src, function(done) {
      magic = done;
      iframe.src = src + "?" + Math.random();
    });
  };
  
  htmlTest('bind-object-repeat.html');
});
*/
