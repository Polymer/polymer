/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

"use strict";

var planner;

function setup() {

  planner = new Planner();

  function addVariable(priority) {
    return planner.addVariable(function() {
      return priority;
    });
  }

  function bind(prop1, prop2) {
    var c = planner.addConstraint();
    return {
      constraint: c,
      to: c.addMethod(prop2),
      from: c.addMethod(prop1)
    };
  }

  var count = 1000000;
  var variable = addVariable(count);

  while (count-- > 0) {
    var newVar = addVariable(count);
    bind(variable, newVar);
    variable = newVar;
  }
}

function run() {
  var t1 = new Date();
  planner.getPlan();
  var t2 = new Date();
  print('Finished in: ' + (t2.getTime() - t1.getTime()) + 'ms');
}

setup();
run();
