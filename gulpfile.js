/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/* eslint-env node */
'use strict';

const gulp = require('gulp');
const gulpif = require('gulp-if');
const del = require('del');
const eslint = require('gulp-eslint');
const fs = require('fs-extra');
const path = require('path');
const mergeStream = require('merge-stream');
const babel = require('gulp-babel');
const size = require('gulp-size');
const lazypipe = require('lazypipe');
const closure = require('google-closure-compiler').gulp();
const minimalDocument = require('./util/minimalDocument.js');
const dom5 = require('dom5/lib/index-next');
const parse5 = require('parse5');
const replace = require('gulp-replace');

const DIST_DIR = 'dist';
const BUNDLED_DIR = path.join(DIST_DIR, 'bundled');
const COMPILED_DIR = path.join(DIST_DIR, 'compiled');
const POLYMER_LEGACY = 'polymer-legacy.js';

const {PolymerProject, HtmlSplitter} = require('polymer-build');

const {Transform} = require('stream');

class BackfillStream extends Transform {
  constructor(fileList) {
    super({objectMode: true});
    this.fileList = fileList;
  }
  _transform(file, enc, cb) {
    if (this.fileList) {
      const origFile = this.fileList.shift();
      // console.log(`rename ${file.path} -> ${origFile.path}`)
      file.path = origFile.path;
    }
    cb(null, file);
  }
  _flush(cb) {
    if (this.fileList && this.fileList.length > 0) {
      this.fileList.forEach((oldFile) => {
        // console.log(`pumping fake file ${oldFile.path}`)
        let newFile = oldFile.clone({deep: true, contents: false});
        newFile.contents = new Buffer('');
        this.push(newFile);
      });
    }
    cb();
  }
}

let firstImportFinder = dom5.predicates.AND(
  dom5.predicates.hasTagName('link'), dom5.predicates.hasAttrValue('rel', 'import')
);

const header =
`/**
 * @fileoverview Generated typings for Polymer mixins
 * @externs
 * @suppress {checkPrototypalTypes}
 *
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
/* eslint-disable */
`;

class AddClosureTypeImport extends Transform {
  constructor(entryFileName, typeFileName) {
    super({objectMode: true});
    this.target = path.resolve(entryFileName);
    this.importPath = path.resolve(typeFileName);
  }
  _transform(file, enc, cb) {
    if (file.path === this.target) {
      let contents = file.contents.toString();
      let html = parse5.parse(contents, {locationInfo: true});
      let firstImport = dom5.query(html, firstImportFinder);
      if (firstImport) {
        let importPath = path.relative(path.dirname(this.target), this.importPath);
        let importLink = dom5.constructors.element('link');
        dom5.setAttribute(importLink, 'rel', 'import');
        dom5.setAttribute(importLink, 'href', importPath);
        dom5.insertBefore(firstImport.parentNode, firstImport, importLink);
        dom5.removeFakeRootElements(html);
        file.contents = Buffer(parse5.serialize(html));
      }
    }
    cb(null, file);
  }
}

gulp.task('clean', () => del([DIST_DIR, 'closure.log']));

gulp.task('generate-externs', gulp.series('clean', async () => {
  let genClosure = require('@polymer/gen-closure-declarations').generateDeclarations;
  const declarations = await genClosure();
  await fs.writeFile('externs/closure-types.js', `${header}${declarations}`);
}));

const runClosureOnly = ({lintOnly}) => () => {
  let entry, splitRx, joinRx, addClosureTypes;

  function config(path) {
    entry = path;
    joinRx = new RegExp(path.split('/').join('\\/'));
    splitRx = new RegExp(joinRx.source + '_script_\\d+\\.js$');
    addClosureTypes = new AddClosureTypeImport(entry, 'externs/polymer-internal-types.html');
  }

  config('polymer-legacy.js');

  const project = new PolymerProject({
    shell: `./${entry}`,
    fragments: [
      'node_modules/@webcomponents/shadycss/entrypoints/apply-shim.js',
      'node_modules/@webcomponents/shadycss/entrypoints/custom-style-interface.js'
    ],
    extraDependencies: [
      addClosureTypes.importPath,
      'externs/polymer-internal-shared-types.js',
    ]
  });

  function closureLintLogger(log) {
    let chalk = require('chalk');
    // write out log to use with diffing tools later
    fs.writeFileSync('closure.log', chalk.stripColor(log));
    console.error(log);
    process.exit(-1);
  }

  let closurePluginOptions;

  if (lintOnly) {
    closurePluginOptions = {
      logger: closureLintLogger
    };
  }

  const closureStream = closure({
    compilation_level: 'ADVANCED',
    language_in: 'ES6_STRICT',
    language_out: 'ES5_STRICT',
    warning_level: 'VERBOSE',
    isolation_mode: 'IIFE',
    assume_function_wrapper: true,
    rewrite_polyfills: false,
    new_type_inf: true,
    checks_only: lintOnly,
    polymer_version: 2,
    externs: [
      'bower_components/shadycss/externs/shadycss-externs.js',
      'externs/webcomponents-externs.js',
      'externs/closure-types.js',
      'externs/polymer-externs.js',
      'externs/polymer-dom-api-externs.js',
    ],
    extra_annotation_name: [
      'appliesMixin',
      'mixinClass',
      'mixinFunction',
      'polymer',
      'customElement'
    ]
  }, closurePluginOptions);

  const closurePipeline = lazypipe()
    .pipe(() => closureStream)
    .pipe(() => new BackfillStream(closureStream.fileList_));

  // process source files in the project
  const sources = project.sources();

  // process dependencies
  const dependencies = project.dependencies();

  // merge the source and dependencies streams to we can analyze the project
  const mergedFiles = mergeStream(sources, dependencies);

  const splitter = new HtmlSplitter();
  return mergedFiles
    .pipe(addClosureTypes)
    .pipe(project.bundler())
    .pipe(splitter.split())
    .pipe(gulpif(splitRx, closurePipeline()))
    .pipe(splitter.rejoin())
    .pipe(gulpif(joinRx, minimalDocument()))
    .pipe(gulpif(joinRx, size({title: 'closure size', gzip: true, showTotal: false, showFiles: true})))
    .pipe(gulp.dest(COMPILED_DIR));
};

gulp.task('closure', gulp.series('generate-externs', runClosureOnly({
  lintOnly: false
})));

gulp.task('lint-closure', runClosureOnly({
  lintOnly: true
}));

gulp.task('estimate-size', gulp.series('clean', () => {

  const babelPresets = {
    presets: [['minify', {regexpConstructors: false, simplifyComparisons: false}]]
  };

  const project = new PolymerProject({
    shell: POLYMER_LEGACY,
    fragments: [
      'node_modules/@webcomponents/shadycss/entrypoints/apply-shim.js',
      'node_modules/@webcomponents/shadycss/entrypoints/custom-style-interface.js'
    ]
  });

  // process source files in the project
  const sources = project.sources();

  // process dependencies
  const dependencies = project.dependencies();

  // merge the source and dependencies streams to we can analyze the project
  const mergedFiles = mergeStream(sources, dependencies);

  const bundledSplitter = new HtmlSplitter();

  const bundlePipe = lazypipe()
  .pipe(() => bundledSplitter.split())
  .pipe(() => gulpif(/\.js$/, babel(babelPresets)))
  .pipe(() => bundledSplitter.rejoin())
  .pipe(minimalDocument);

  return mergedFiles
    .pipe(project.bundler())
    .pipe(gulpif(/polymer\.html$/, bundlePipe()))
    .pipe(gulpif(/polymer\.html$/, size({ title: 'bundled size', gzip: true, showTotal: false, showFiles: true })))
    // write to the bundled folder
    .pipe(gulp.dest(BUNDLED_DIR));
}));

gulp.task('lint-eslint', function() {
  return gulp.src(['lib/**/*.js', 'test/unit/*.{html,js}', 'util/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// TODO(timvdlippe): Add back `, 'lint-closure'` once closure lint works again
gulp.task('lint', gulp.series('lint-eslint'));

// TODO(timvdlippe): Add back `'generate-externs',` once we can generate externs again

gulp.task('update-version', () => {
  return gulp.src('lib/mixins/element-mixin.js')
  .pipe(replace(/(export const version = )'\d+\.\d+\.\d+'/, `$1'${require('./package.json').version}'`))
  .pipe(gulp.dest('lib/mixins'));
});
