/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

suite('bindMDV', function() {
  var assert = chai.assert;
  
  test('bindModel bindPattern', function() {
    var test = document.createElement('div');
    test.innerHTML = '<div id="a" foo="{{bar}}"></div>';
    var a = test.children[0];
    Toolkit.bindModel.call(test, test);
    test.bar = 5;
    dirtyCheck();
    assert.equal(a.getAttribute('foo'), 5);
    //
    test.bar = 8;
    dirtyCheck();
    assert.equal(a.getAttribute('foo'), 8);
  });
  
  test('bindModel bindComponent', function() {
    var test = document.createElement('div');
    test.innerHTML = '<x-a id="a" foo="{{bar}}"></x-a>';
    var a = test.children[0];
    // ad-hoc to make x-a a component
    a.ready = true;
    //
    Toolkit.bindModel.call(test, test);
    test.bar = 5;
    dirtyCheck();
    assert.equal(a.foo, 5);
    //
    test.bar = 8;
    dirtyCheck();
    assert.equal(a.foo, 8);
    // 2 ways
    a.foo = 6;
    dirtyCheck();
    assert.equal(test.bar, 6);
  });
});