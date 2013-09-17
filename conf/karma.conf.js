module.exports = function(karma) {
  var common = require('../../tools/test/karma-common.conf.js');
  karma.set(common.mixin_common_opts(karma, {
    // base path, that will be used to resolve files and exclude
    basePath: '../../',

    // list of files / patterns to load in the browser
    files: [
      'tools/test/mocha-htmltest.js',
      'polymer/conf/mocha.conf.js',
      'polymer/node_modules/chai/chai.js',
      'polymer/polymer.js',
      'polymer/test/js/*.js',
      {pattern: 'CustomElements/MutationObservers/*.js', included: false},
      {pattern: 'CustomElements/custom-elements.js', included: false},
      {pattern: 'CustomElements/src/*.js', included: false},
      {pattern: 'HTMLImports/html-imports.js', included: false},
      {pattern: 'HTMLImports/src/*', included: false},
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
      {pattern: 'WeakMap/weakmap.js', included: false},
      {pattern: 'observe-js/src/*.js', included: false},
      {pattern: 'observe-js/util/*.js', included: false},
      {pattern: 'platform/*.js', included: false},
      {pattern: 'platform/platform.*', included: false},
      {pattern: 'platform/src/*.js', included: false},
      {pattern: 'platform/test/**/*.html', included: false},
      {pattern: 'platform/test/**/*.js', included: false},
      {pattern: 'platform/tools/**/*.js', included: false},
      {pattern: 'polymer-expressions/src/*.js', included: false},
      {pattern: 'polymer-expressions/third_party/**/*.js', included: false},
      {pattern: 'polymer/src/**/*.js', included: false},
      {pattern: 'polymer/test/**/*.css', included: false},
      {pattern: 'polymer/test/**/*.html', included: false},
      {pattern: 'polymer/test/**/*.js', included: false},
      {pattern: 'tools/**/*.js', included: false}
    ]
  }));
};
