/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
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

function instance(fn) {
  var obj = new fn();
  if (!Object.__proto__) {
    obj.__proto__ = fn.prototype;
  }
  return obj;
}

suite('oop', function() {

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
    var subSub = instance(SubSub);
    subSub.say();
    assert.equal(subSub.msg, 'sub subsub');
  });

});
