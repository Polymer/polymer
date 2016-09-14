/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {assert} from 'chai';
import {TestElement} from './test-element.js';

declare function fixture(id: string): HTMLElement;

suite('TypeScript Decorators', function() {

  suite('@customElement', function() {

    test('defines an element', function() {
      var testElement = fixture('test-element');
      assert.instanceOf(testElement, TestElement);
    });

  });

  suite('@property', function() {

    test('defines a property', function() {
      var testElement = fixture('test-element') as TestElement;
      testElement.aNum = 999;
      var numDiv = testElement.shadowRoot.querySelector('#num');
      var numText = numDiv.textContent;
      assert.equal(numText, '999');
    });

  });

  suite('@observe', function() {

    test('calls a method when a single observed property changes', function() {
      var testElement = fixture('test-element') as TestElement;
      testElement.aNum = 999;
      assert.equal(testElement.lastNumChange, 999);
    });

    test('calls a method when multiple observed properties change', function() {
      var testElement = fixture('test-element') as TestElement;
      testElement.aNum = 999;
      assert.equal(testElement.lastMultiChange[0], 999);
      testElement.aString = 'yahoo';
      assert.equal(testElement.lastMultiChange[1], 'yahoo');
    });


  });

  suite('@query', function() {

    test('queries the shadow root', function() {
      var testElement = fixture('test-element') as TestElement;
      var numDiv = testElement.numDiv;
      assert.equal(numDiv.id, 'num');
    });

  });

  suite('@queryAll', function() {

    test('queries the shadow root', function() {
      var testElement = fixture('test-element') as TestElement;
      var divs = testElement.divs;
      assert.equal(divs.length, 2);
    });

  });

});
