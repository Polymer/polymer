/*
 * Copyright 2012 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

suite('component', function() {
  var foo;
  
  setup(function() {
    foo = document.createElement('g-foo');
    work.appendChild(foo);
  });
  
  teardown(function() {
    work.textContent = '';
  });
  
  function async(inFn) {
    setTimeout(inFn, 1);
  }
  
  test('string attribute', function() {
    foo.str = 'hello world';
    expect(foo.$protected._str).to.be('hello world');
    foo.setAttribute('str', 'good bye');
    async(function() {
      expect(foo.$protected._str).to.be('good bye');
    });
  });

  test('boolean attribute', function() {
    foo.bool = true;
    expect(foo.$protected._bool).to.be(true);
    foo.bool = false;
    expect(foo.$protected._bool).to.be(false);
    foo.setAttribute('bool', true);
    async(function() {
      expect(foo.$protected._bool).to.be(true);
    })
  });
  
  test('number attribute', function() {
    foo.num = 3;
    expect(foo.$protected._num).to.be(3);
    foo.setAttribute('num', 5);
    async(function() {
      expect(foo.$protected._num).to.be(5);
    })
  });
  
  test('string property', function() {
    foo.strp = 'hello world';
    expect(foo.$protected._strp).to.be('hello world');
  });

  test('boolean property', function() {
    foo.boolp = true;
    expect(foo.$protected._boolp).to.be(true);
    foo.boolp = false;
    expect(foo.$protected._boolp).to.be(false);
  });
  
  test('number property', function() {
    foo.nump = 3;
    expect(foo.$protected._nump).to.be(3);
  });
  
  test('node reference', function() {
    var ref = foo.$protected.$.ref1;
    expect(ref.id).to.be('ref1');
    ref = foo.$protected.$.ref2;
    expect(ref.textContent).to.be('hello!!!');
  });
  
  test('handler', function() {
    expect(foo.$protected._click).to.be(undefined);
    foo.click();
    expect(foo.$protected._click).to.be(true);
  })
});

