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

suite('bindProperties-declarative', function() {
  var assert = chai.assert;
  
  var listener;
  var magic;
  var iframe;
  
  setup(function() {
    iframe = document.createElement('iframe');
    iframe.style.cssText = 'position: absolute; left: -9000em; width:768px; height: 1024px';
    document.body.appendChild(iframe);
  });

  teardown(function() {
    document.body.removeChild(iframe);
  });

  function htmlTest(src, fn) {
    test(src, function() {
      iframe.onload = function(done) {
        $document.addEventListener('WebComponentsReady', function() {
          fn(iframe.contentWindow, iframe.contentDocument);
        });
        if (fn.length === 0) {
          done();
        }
      }
      iframe.src = src + "?" + Math.random();
    });
  };
  
  htmlTest('bind-object-repeat.html', function($window, $document) {
    $window.dirtyCheck();
    var o = $document.querySelector('x-bind-obj');
    var root = o.webkitShadowRoot;
    var f = root.querySelector('x-foo');
    assert.equal(f.obj, o.testObj);

    function checkXFoo(inXFoo) {
      var p = inXFoo.webkitShadowRoot.querySelector('p');
      assert.isDefined(inXFoo.obj.foo);
      console.log(p, p.innerHTML);
      assert.equal(p.innerHTML, 'obj.foo is ' + inXFoo.obj.foo);
    }

    checkXFoo(f);

    var d = root.querySelector('div');
    Array.prototype.forEach.call(d.querySelectorAll('x-foo'), function(x) {
      checkXFoo(x);
    });
  });
});
