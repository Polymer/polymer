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
    var a = test.firstChild;
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
    var a = test.firstChild;
    // ad-hoc to make x-a a component
    a.isToolkitElement = true;
    //
    Toolkit.bindModel.call(test, test);
    test.bar = 5;
    assert.equal(a.foo, 5);
    //
    test.bar = 8;
    assert.equal(a.foo, 8);
    // 2 ways
    a.foo = 6;
    assert.equal(test.bar, 6);
  });
  
  test('bindModel bindInput', function() {
    var test = document.createElement('div');
    test.innerHTML = '<input value="{{bar}}" />';
    var a = test.firstChild;
    Toolkit.bindModel.call(test, test);
    test.bar = 'hello';
    dirtyCheck();
    assert.equal(a.value, 'hello');
  });
});