/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

suite('register', function() {
  var assert = chai.assert;

  var work;

  setup(function() {
    work = document.createElement('div');
    wrap(document.body).appendChild(work);
  });

  teardown(function() {
    wrap(document.body).removeChild(work);
  });

  test('register', function(done) {
    Polymer('x-register-foo', {
      forceReady: true,
      ready: function() {
        this.message = 'foo';
      },
      sayHello: function() {
        this.message = 'hello';
      }
    });
    work.innerHTML = '<polymer-element name="x-register-foo"></polymer-element>';
    // Ensure IE goes...
    CustomElements.takeRecords();
    setTimeout(function() {
      var foo = document.createElement('x-register-foo');
      // test ready
      assert.equal(foo.message, 'foo');
      // test sayHello
      foo.sayHello();
      assert.equal(foo.message, 'hello');
      done();
    }, 0);
  });
});

htmlSuite('element callbacks', function() {
  htmlTest('html/callbacks.html');
});

htmlSuite('element registration', function() {
  htmlTest('html/element-script.html');
  htmlTest('html/element-registration.html');
  htmlTest('html/element-import.html');
  htmlTest('html/auto-binding.html');
  htmlTest('html/ctor.html');
  htmlTest('html/domready.html');
  htmlTest('html/infer-name.html');
  htmlTest('html/platform-less.html');
});
