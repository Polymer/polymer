/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

function inherit(fn, prototype) {
    var obj = Object.create(prototype);
    // NOTE: On some platforms (IE10) __proto__ does not exist.
    // In this case, we install it.
    if (!Object.__proto__) {
      obj.__proto__ = prototype;
    }
    obj.constructor = fn;
    fn.prototype = obj;
    return fn;
  }

suite('oop', function() {
  var assert = chai.assert;
  
  test('super', function() {
    var Base = function() {};
    Base.prototype = {
      super: Polymer.super,
      msg: '',
      log: function(inMsg) {
        this.msg += inMsg;
      }/*,
      say: function() {
        this.log('base');
      }*/
    };
    //
    var Sub = function() {};
    inherit(Sub, Base.prototype);
    Sub.prototype.say = function() {
      this.super();
      this.log('sub');
    };
    //
    var SubSub = function() {};
    inherit(SubSub, Sub.prototype);
    SubSub.prototype.say = function() {
      this.super();
      this.log(' subsub');
    };
    //
    var subSub = new SubSub();
    subSub.say();
    assert.equal(subSub.msg, 'sub subsub');
  });
});