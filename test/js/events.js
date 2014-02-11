/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

suite('events', function() {
  var assert = chai.assert;
  
  var work;
  
  setup(function() {
    work = document.createElement('div');
    document.body.appendChild(work);
    // store results
    work.innerHTML = '<div id="results" style="display: none;"></div>';
  });

  teardown(function() {
    wrap(document.body).removeChild(work);
  });
  
  function createTestElement(inName, inTemplateContent, inExtend) {
    Polymer(inName, {
      clickHandler: function() {
        results.textContent += this.localName;
      }
    });
    work.innerHTML += '<polymer-element name="' + inName + '"' + 
        (inExtend ? ' extends="' + inExtend + '"' : '') + ' on-click="{{clickHandler}}">' +
      '<template>' + (inTemplateContent || '') + '</template></polymer-element>';
  }
  
  test('host event', function(done) {
    createTestElement('x-events-foo');
    // Ensure IE goes...
    CustomElements.takeRecords();
    setTimeout(function() {
      var foo = document.createElement('x-events-foo');
      work.appendChild(foo);
      foo.click();
      assert.equal(results.textContent, 'x-events-foo');
      done();
    }, 0);
  });
});

htmlSuite('events-declarative', function() {
  htmlTest('html/event-handlers.html');
  htmlTest('html/event-handlers-host.html');
  htmlTest('html/event-handlers-light.html');
  htmlTest('html/event-path.html');
  htmlTest('html/event-path-declarative.html');
});