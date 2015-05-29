/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
 /*jslint node: true */
'use strict';

/**
 * Static analysis for Polymer.
 * @namespace hydrolysis
 */
module.exports = {
  Analyzer:     require('./lib/analyzer'),
  docs:         require('./lib/ast-utils/docs'),
  FSResolver:   require('./lib/loader/fs-resolver'),
  jsdoc:        require('./lib/ast-utils/jsdoc'),
  Loader:       require('./lib/loader/file-loader'),
  NoopResolver: require('./lib/loader/noop-resolver'),
  XHRResolver:  require('./lib/loader/xhr-resolver'),
  _jsParse:     require('./lib/ast-utils/js-parse'),
  _importParse: require('./lib/ast-utils/import-parse'),
};
