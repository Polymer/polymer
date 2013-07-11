/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

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
    Sub.prototype = Object.create(Base.prototype);
    Sub.prototype.say = function() {
      this.super();
      this.log(' sub');
    };
    Sub.prototype.say.nom = 'say';
    //
    var SubSub = function() {};
    SubSub.prototype = Object.create(Sub.prototype);
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
  
  /*
  test('class', function() {
    var Base = $class({
      constructor: function() {
        this.value = 'foo';
      },
      sayHello: function() {
        this.value = 'hello';
      } 
    });
    var base = new Base();
    assert(base.value, 'foo');
    base.sayHello();
    assert(base.value, 'hello');
    //
    var Sub = $class(Base, {
      sayHi: function() {
        this.value = 'hi';
      }
    });
    var sub = new Sub();
    assert(sub.value, 'foo');
    sub.sayHello();
    assert(sub.value, 'hello');
    sub.sayHi();
    assert(sub.value, 'hi');
    //
    var SubSub = $class(Sub, {
      sayGoodbye: function() {
        this.value = 'goodbye';
      }
    });
    var subSub = new SubSub();
    assert(subSub.value, 'foo');
    subSub.sayHello();
    assert(subSub.value, 'hello');
    subSub.sayHi();
    assert(subSub.value, 'hi');
    subSub.sayGoodbye();
    assert(subSub.value, 'goodbye');
  });
  */

});