/* 
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

// if standalone
if (window.top === window) {
  window.done = function() {
    alert('Test Passed');
  }
  window.onerror = function(x) {
    alert('Test FAILED: ' + x);
  };
} else 
// if part of a test suite
{
  window.done = function() {
    parent.postMessage('ok', '*');
  }
  window.onerror = function(x) {
    parent.postMessage({msg: x}, '*');
  };
}

