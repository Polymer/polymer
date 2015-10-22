"use strict";

class XBaseClass {
  sayFoo() {
    this.saying = "foo";
  }
}

class XExtendedClass extends XBaseClass {
  beforeRegister() {
    this.is = "x-extended-class";
    this.properties = {
      saying: {
        type: String,
        value: "hello"
      }
    };
  }

  ready(){
    this.sayFoo();
  }
}

