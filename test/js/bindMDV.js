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
    var mutation = 0;
    new MutationObserver(function() {
      if (mutation == 0) {
        mutation++;
        assert.equal(a.getAttribute('foo'), 5);
        test.bar = 8;
        Platform.flush();
      } else {
        assert.equal(a.getAttribute('foo'), 8);
        done();
      }
    }).observe(a, {attributes: true});
  });

  test('bindModel bind input', function(done) {
    var test = document.createElement('div');
    var fragment = parseAndBindHTML('<input value="{{bar}}" />', test);
    test.appendChild(fragment);
    var a = test.querySelector('input');
    test.bar = 'hello';
    Platform.flush();
    // TODO(sorvell): fix this when observe-js lets us explicitly listen for
    // a change on input.value
    Platform.endOfMicrotask(function() {
      assert.equal(a.value, 'hello');
      done();
    });
  });

});


htmlSuite('bind', function() {
  htmlTest('html/template-distribute-dynamic.html');
  htmlTest('html/bind.html');
  htmlTest('html/unbind.html');
  htmlTest('html/prop-attr-bind-reflection.html');
});
