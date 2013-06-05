/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

suite('bindMDV', function() {
  var assert = chai.assert;
  
  test('bindModel bindModel', function(done) {
    var test = document.createElement('div');
    var template = document.createElement('template');
    template.innerHTML = '<div id="a" foo="{{bar}}"></div>';
    test.appendChild(template.createInstance(test, 'Polymer'));
    var a = test.querySelector('#a');
    
    test.bar = 5;
    dirtyCheck();
    setTimeout(function() {
      assert.equal(a.getAttribute('foo'), 5);
      //
      test.bar = 8;
      dirtyCheck();
      setTimeout(function() {
        assert.equal(a.getAttribute('foo'), 8);
        done();
      });
    });
  });
    
  test('bindModel bind input', function(done) {
    var test = document.createElement('div');
    var template = document.createElement('template');
    template.innerHTML = '<input value="{{bar}}" />';
    test.appendChild(template.createInstance(test, 'Polymer'));
    var a = test.querySelector('input');
    
    test.bar = 'hello';
    dirtyCheck();
    setTimeout(function() {
      assert.equal(a.value, 'hello');
      done();
    });
  });
});