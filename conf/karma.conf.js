/*
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

module.exports = function(karma) {
  var common = require('../../tools/test/karma-common.conf.js');
  karma.set(common.mixin_common_opts(karma, {
    // base path, that will be used to resolve files and exclude
    basePath: '../../',

    // list of files / patterns to load in the browser
    files: [
      'tools/test/mocha-htmltest.js',
      'polymer-dev/conf/mocha.conf.js',
      'polymer-dev/node_modules/chai/chai.js',
      'platform/platform.js',
      'polymer-dev/test/lib/karma-include-polymer.js',
      'polymer-dev/test/js/*.js',
      {pattern: 'CustomElements/custom-elements.js', included: false},
      {pattern: 'CustomElements/src/*.js', included: false},
      {pattern: 'HTMLImports/html-imports.js', included: false},
      {pattern: 'HTMLImports/src/*', included: false},
      {pattern: 'MutationObservers/*.js', included: false},
      {pattern: 'NodeBind/src/*.js', included: false},
      {pattern: 'PointerEvents/pointerevents.js', included: false},
      {pattern: 'PointerEvents/src/*.js', included: false},
      {pattern: 'PointerGestures/pointergestures.js', included: false},
      {pattern: 'PointerGestures/src/*.js', included: false},
      {pattern: 'ShadowDOM/shadowdom.js', included: false},
      {pattern: 'ShadowDOM/src/**/*.js', included: false},
      {pattern: 'TemplateBinding/load.js', included: false},
      {pattern: 'TemplateBinding/src/*.css', included: false},
      {pattern: 'TemplateBinding/src/*.js', included: false},
      {pattern: 'URL/url.js', included: false},
      {pattern: 'WeakMap/weakmap.js', included: false},
      {pattern: 'observe-js/src/*.js', included: false},
      {pattern: 'observe-js/util/*.js', included: false},
      {pattern: 'platform-dev/platform.*', included: false},
      {pattern: 'platform-dev/src/*.js', included: false},
      {pattern: 'platform-dev/test/**/*.html', included: false},
      {pattern: 'platform-dev/test/**/*.js', included: false},
      {pattern: 'polymer-expressions/src/*.js', included: false},
      {pattern: 'polymer-expressions/third_party/**/*.js', included: false},
      {pattern: 'polymer-expressions/polymer-expressions.html', included: false},
      {pattern: 'polymer-gestures/polymer-gestures.html', included: false},
      {pattern: 'polymer-gestures/src/*.js', included: false},
      {pattern: 'polymer-expressions/tests/*.js', included: false},
      {pattern: 'TemplateBinding/tests/*.js', included: false},
      {pattern: 'polymer-dev/polymer.html', included: false},
      {pattern: 'polymer-dev/layout.html', included: false},
      {pattern: 'polymer-dev/src/**/*.js', included: false},
      {pattern: 'polymer-dev/build/polymer.js', included: false},
      {pattern: 'polymer-dev/test/**/*.css', included: false},
      {pattern: 'polymer-dev/test/**/*.html', included: false},
      {pattern: 'polymer-dev/test/**/*.js', included: false},
      {pattern: 'tools/**/*.js', included: false},
      {pattern: 'tools/test/*', included: false}
    ]
  }));
};
