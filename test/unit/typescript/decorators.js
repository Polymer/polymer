/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
define(["require", "exports", 'chai', './test-element.js'], function (require, exports, chai_1, test_element_js_1) {
    "use strict";
    suite('TypeScript Decorators', function () {
        suite('@customElement', function () {
            test('defines an element', function () {
                var testElement = fixture('test-element');
                chai_1.assert.instanceOf(testElement, test_element_js_1.TestElement);
            });
        });
        suite('@property', function () {
            test('defines a property', function () {
                var testElement = fixture('test-element');
                testElement.aNum = 999;
                var numDiv = testElement.shadowRoot.querySelector('#num');
                var numText = numDiv.textContent;
                chai_1.assert.equal(numText, '999');
            });
        });
        suite('@observe', function () {
            test('calls a method when a single observed property changes', function () {
                var testElement = fixture('test-element');
                testElement.aNum = 999;
                chai_1.assert.equal(testElement.lastNumChange, 999);
            });
            test('calls a method when multiple observed properties change', function () {
                var testElement = fixture('test-element');
                testElement.aNum = 999;
                chai_1.assert.equal(testElement.lastMultiChange[0], 999);
                testElement.aString = 'yahoo';
                chai_1.assert.equal(testElement.lastMultiChange[1], 'yahoo');
            });
        });
        suite('@query', function () {
            test('queries the shadow root', function () {
                var testElement = fixture('test-element');
                var numDiv = testElement.numDiv;
                chai_1.assert.equal(numDiv.id, 'num');
            });
        });
        suite('@queryAll', function () {
            test('queries the shadow root', function () {
                var testElement = fixture('test-element');
                var divs = testElement.divs;
                chai_1.assert.equal(divs.length, 2);
            });
        });
    });
});
