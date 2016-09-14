/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '../../../src/typescript/decorators.js'], function (require, exports, decorators_js_1) {
    "use strict";
    let TestElement = class TestElement extends Polymer.Element {
        constructor() {
            super(...arguments);
            this.aNum = 42;
            this.aString = 'yes';
            this.aBool = true;
        }
        _aNumChanged(newNum) {
            this.lastNumChange = newNum;
        }
        _numStringChanged(newNum, newString) {
            this.lastMultiChange = [newNum, newString];
        }
    };
    __decorate([
        decorators_js_1.property({ notify: true }), 
        __metadata('design:type', Number)
    ], TestElement.prototype, "aNum", void 0);
    __decorate([
        decorators_js_1.property({ notify: true }), 
        __metadata('design:type', String)
    ], TestElement.prototype, "aString", void 0);
    __decorate([
        decorators_js_1.property(), 
        __metadata('design:type', Boolean)
    ], TestElement.prototype, "aBool", void 0);
    __decorate([
        decorators_js_1.query('#num'), 
        __metadata('design:type', HTMLDivElement)
    ], TestElement.prototype, "numDiv", void 0);
    __decorate([
        decorators_js_1.queryAll('div'), 
        __metadata('design:type', Array)
    ], TestElement.prototype, "divs", void 0);
    __decorate([
        decorators_js_1.observe('aNum'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Number]), 
        __metadata('design:returntype', void 0)
    ], TestElement.prototype, "_aNumChanged", null);
    __decorate([
        decorators_js_1.observe(['aNum', 'aString']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Number, String]), 
        __metadata('design:returntype', void 0)
    ], TestElement.prototype, "_numStringChanged", null);
    TestElement = __decorate([
        decorators_js_1.customElement('test-element'), 
        __metadata('design:paramtypes', [])
    ], TestElement);
    exports.TestElement = TestElement;
});
