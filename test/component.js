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
    expect(foo._str).to.be('hello world');
    foo.setAttribute('str', 'good bye');
    async(function() {
      expect(foo._str).to.be('good bye');
    });
  });

  test('boolean attribute', function() {
    foo.bool = true;
    expect(foo._bool).to.be(true);
    foo.bool = false;
    expect(foo._bool).to.be(false);
    foo.setAttribute('bool', true);
    async(function() {
      expect(foo._bool).to.be(true);
    })
  });
  
  test('number attribute', function() {
    foo.num = 3;
    expect(foo._num).to.be(3);
    foo.setAttribute('num', 5);
    async(function() {
      expect(foo._num).to.be(5);
    })
  });
  
  test('string property', function() {
    foo.strp = 'hello world';
    expect(foo._strp).to.be('hello world');
  });

  test('boolean property', function() {
    foo.boolp = true;
    expect(foo._boolp).to.be(true);
    foo.boolp = false;
    expect(foo._boolp).to.be(false);
  });
  
  test('number property', function() {
    foo.nump = 3;
    expect(foo._nump).to.be(3);
  });
  
  test('node reference', function() {
    var ref = foo.$.ref1;
    expect(ref.id).to.be('ref1');
    ref = foo.$.ref2;
    expect(ref.textContent).to.be('hello!!!');
  });
  
  test('handler', function() {
    expect(foo._click).to.be(undefined);
    foo.click();
    expect(foo._click).to.be(true);
  })
});

