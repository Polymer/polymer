/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

suite('bindMDV', function() {

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
