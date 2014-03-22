/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
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
  htmlTest('html/polymer-body.html');
  htmlTest('html/ctor.html');
  htmlTest('html/domready.html');
  htmlTest('html/infer-name.html');
});
