/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

// NOTE: put deprecated methods here that throw a useful error
Polymer.register = function(context) {
  if (context != window) {
    // context is the <element> here, with a name attribute
    var name = context.getAttribute('name');
    throw new Error('Polymer.register is deprecated in declaration of ' + name + '. Please see http://www.polymer-project.org/getting-started.html');
  }
};
