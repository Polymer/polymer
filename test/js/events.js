/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

suite('events', function() {
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
