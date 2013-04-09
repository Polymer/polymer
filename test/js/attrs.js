/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

suite('attrs', function() {
  var assert = chai.assert;

  test('takeAttributes boolean', function() {
    var XFoo = document.register('x-foo', {
      prototype: Object.create(HTMLElement.prototype, {
        bar: {
          value: false,
          enumerable: true,
          writable: true
        }
      })
    });
    var foo = new XFoo();
    assert.equal(foo.bar, false);
    //
    foo.setAttribute('bar', 'true');
    Toolkit.takeAttributes.call(foo);
    assert.equal(foo.bar, true);
    //
    foo.setAttribute('bar', 'false');
    Toolkit.takeAttributes.call(foo);
    assert.equal(foo.bar, false);
  });
  
  test('takeAttributes number', function() {
    var XFoo = document.register('x-foo', {
      prototype: Object.create(HTMLElement.prototype, {
        bar: {
          value: 5,
          enumerable: true,
          writable: true
        }
      })
    });
    var foo = new XFoo();
    assert.equal(foo.bar, 5);
    //
    foo.setAttribute('bar', "8");
    Toolkit.takeAttributes.call(foo);
    assert.equal(foo.bar, 8);
    //
    foo.setAttribute('bar', '3');
    Toolkit.takeAttributes.call(foo);
    assert.equal(foo.bar, 3);
  });
  
  test('takeAttributes string', function() {
    var XFoo = document.register('x-foo', {
      prototype: Object.create(HTMLElement.prototype, {
        bar: {
          value: "bar",
          enumerable: true,
          writable: true
        }
      })
    });
    var foo = new XFoo();
    assert.equal(foo.bar, 'bar');
    //
    foo.setAttribute('bar', "barbar");
    Toolkit.takeAttributes.call(foo);
    assert.equal(foo.bar, "barbar");
  });
});