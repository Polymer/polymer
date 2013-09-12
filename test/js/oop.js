/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

function createObjectWithProto(prototype) {
    var obj = Object.create(prototype);
    // NOTE: On some platforms (IE10) __proto__ does not exist.
    // In this case, we install it.
    if (!Object.__proto__) {
      obj.__proto__ = prototype;
    }
    return obj;
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
      },
      say: function() {
        this.log('base');
      }
    };
    //
    var Sub = function() {};
    Sub.prototype = createObjectWithProto(Base.prototype);
    Sub.prototype.say = function() {
      this.super();
      this.log(' sub');
    };
    Sub.prototype.say.nom = 'say';
    //
    var SubSub = function() {};
    SubSub.prototype = createObjectWithProto(Sub.prototype);
    SubSub.prototype.say = function() {
      this.super();
      this.log(' subsub');
    };
    SubSub.prototype.say.nom = 'say';
    //
    var subSub = new SubSub();
    subSub.say();
    assert.equal(subSub.msg, 'base sub subsub');
  });
});