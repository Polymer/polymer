/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// Run ArrayFuzzer under d8, e.g.
// path/to/d8 change_summary.js tests/array_fuzzer.js tests/d8_array_fuzzer.js (--harmony)

function checkEqual(arr1, arr2) {
  if (arr1.length != arr2.length)
    throw 'Lengths not equal: ' + arr1.length + ', ' + arr2.length;
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i])
      throw 'Value at i: ' + i + ' not equal: ' + arr1[i] + ', ' + arr2[i];
  }
}

var t1 = new Date();
for (var i = 0; i < 2048 * 1000; i++) {
	print('pass: ' + i);
  var fuzzer = new ArrayFuzzer();
  fuzzer.go();
  try {
    checkEqual(fuzzer.arr, fuzzer.copy);
  } catch (ex) {
    console.log('Fail: ' + ex);
    console.log(JSON.stringify(fuzzer.origCopy));
    console.log(JSON.stringify(fuzzer.ops));
    throw ex;
  }
}

var t2 = new Date();
print('Finished in: ' + (t2.getTime() - t1.getTime()) + 'ms');
