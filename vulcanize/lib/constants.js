/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

var JS = 'script:not([type]), script[type="text/javascript"]';
var URL_ATTR = ['href', 'src', 'action', 'style'];

module.exports = {
  EOL: require('os').EOL,
  ELEMENTS: 'polymer-element:not([assetpath])',
  ELEMENTS_NOSCRIPT: 'polymer-element[noscript]',
  ABS_URL: /(^data:)|(^http[s]?:)|(^\/)|(^mailto:)/,
  REMOTE_ABS_URL: /(^http[s]?\:)|(^\/\/)/,
  IMPORTS: 'link[rel="import"][href]',
  URL: /url\([^)]*\)/g,
  URL_ATTR: URL_ATTR,
  URL_ATTR_SEL: '[' + URL_ATTR.join('],[') + ']',
  URL_TEMPLATE: '{{.*}}',
  JS: JS,
  JS_SRC: JS.split(',').map(function(s){ return s + '[src]'; }).join(','),
  JS_INLINE: JS.split(',').map(function(s) { return s + ':not([src])'; }).join(','),
  CSS: 'style:not([type]), style[type="text/css"]',
  // Output match is [ 'Polymer(', NAME_OF_ELEMENT OR undefined, ',', { or ) ]
  POLYMER_INVOCATION: /Polymer\(([^,{]+)?(,\s*)?({|\))/,
  NEOPRENE_INVOCATION: /name:\s*['"]([^'"]*)['"]/
};
