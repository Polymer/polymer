/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

suite('bindMDV', function() {
  var assert = chai.assert;
  
  function parseAndBindHTML(html, model) {
    var t = document.createElement('template');
    t.innerHTML = html;
    return t.createInstance(model);
  }
  
  
  test('bindModel bindModel', function(done) {
    var test = document.createElement('div');
    var fragment = parseAndBindHTML('<div id="a" foo="{{bar}}"></div>',
      test);
    test.appendChild(fragment);
    var a = test.querySelector('#a');
    
    test.bar = 5;
    Platform.flush();
    setTimeout(function() {
      assert.equal(a.getAttribute('foo'), 5);
      //
      test.bar = 8;
      Platform.flush();
      setTimeout(function() {
        assert.equal(a.getAttribute('foo'), 8);
        done();
      });
    });
  });
    
  test('bindModel bind input', function(done) {
    var test = document.createElement('div');
    var fragment = parseAndBindHTML('<input value="{{bar}}" />', test);
    test.appendChild(fragment);
    var a = test.querySelector('input');
    
    test.bar = 'hello';
    Platform.flush();
    setTimeout(function() {
      assert.equal(a.value, 'hello');
      done();
    });
  });
});

htmlSuite('unbind', function() {
  htmlTest('html/template-distribute-dynamic.html');
  htmlTest('html/template-distribute-dynamic.html?shadow');
  htmlTest('html/unbind.html');
  htmlTest('html/unbind.html?shadow');
});