/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(global) {

function ArrayFuzzer() {}

ArrayFuzzer.valMax = 16;
ArrayFuzzer.arrayLengthMax = 128;
ArrayFuzzer.operationCount = 64;

function randDouble(start, end) {
  return Math.random()*(end-start) + start;
}

function randInt(start, end) {
  return Math.round(randDouble(start, end));
}

function randASCIIChar() {
  return String.fromCharCode(randInt(32, 126));
}

function randValue() {
  switch(randInt(0, 5)) {
    case 0:
      return {};
    case 1:
      return undefined;
    case 2:
      return null;
    case 3:
      return randInt(0, ArrayFuzzer.valMax);
    case 4:
      return randDouble(0, ArrayFuzzer.valMax);
    case 5:
      return randASCIIChar();
  }
}

function randArray() {
  var args = [];
  var count = randInt(0, ArrayFuzzer.arrayLengthMax);
  while(count-- > 0)
    args.push(randValue());

  return args;
}

function randomArrayOperation(arr) {
  function empty() {
    return [];
  }

  var operations = {
    push: randArray,
    unshift: randArray,
    pop: empty,
    shift: empty,
    splice: function() {
      var args = [];
      args.push(randInt(-arr.length*2, arr.length*2), randInt(0, arr.length*2));
      args = args.concat(randArray());
      return args;
    }
  };

  // Do a splice once for each of the other operations.
  var operationList = ['splice', 'update',
                       'splice', 'delete',
                       'splice', 'push',
                       'splice', 'pop',
                       'splice', 'shift',
                       'splice', 'unshift'];

  var op = {
    name: operationList[randInt(0, operationList.length - 1)]
  };

  switch(op.name) {
    case 'delete':
      op.index = randInt(0, arr.length - 1);
      delete arr[op.index];
      break;

    case 'update':
      op.index = randInt(0, arr.length);
      op.value = randValue();
      arr[op.index] = op.value;
      break;

    default:
      op.args = operations[op.name]();
      arr[op.name].apply(arr, op.args);
      break;
  }

  return op;
}

function randomArrayOperations(arr, count) {
  var ops = []
  for (var i = 0; i < count; i++) {
    ops.push(randomArrayOperation(arr));
  }

  return ops;
}

ArrayFuzzer.prototype.go = function() {
  var orig = this.arr = randArray();
  randomArrayOperations(this.arr, ArrayFuzzer.operationCount);
  var copy = this.copy = this.arr.slice();
  this.origCopy = this.copy.slice();

  var observer = new ArrayObserver(this.arr);
  observer.open(function(splices) {
    ArrayObserver.applySplices(copy, orig, splices);
  });

  this.ops = randomArrayOperations(this.arr, ArrayFuzzer.operationCount);
  observer.deliver();
  observer.close();
}

global.ArrayFuzzer = ArrayFuzzer;

})(this);
