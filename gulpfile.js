/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http:polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http:polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http:polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http:polymer.github.io/PATENTS.txt
 */

/* eslint-env node */
'use strict';

const gulp = require('gulp');
const gulpif = require('gulp-if');
const runseq = require('run-sequence');
const del = require('del');
const eslint = require('gulp-eslint');
const fs = require('fs');
const path = require('path');
const mergeStream = require('merge-stream');
const babel = require('gulp-babel');
const size = require('gulp-size');
const lazypipe = require('lazypipe');
const closure = require('google-closure-compiler').gulp();
const minimalDocument = require('./util/minimalDocument.js')

const DIST_DIR = 'dist';
const BUNDLED_DIR = path.join(DIST_DIR, 'bundled');
const COMPILED_DIR = path.join(DIST_DIR, 'compiled');
const POLYMER_LEGACY = 'polymer.html';
const POLYMER_ELEMENT = 'polymer-element.html';

const polymer = require('polymer-build');
const PolymerProject = polymer.PolymerProject;

const {Transform} = require('stream');

class OldNameStream extends Transform {
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

class Log extends Transform {
  constructor(prefix = '') {
    super({objectMode: true});
    this.prefix = prefix;
  }
  _transform(file, enc, cb) {
    console.log(this.prefix, file.path);
    cb(null, file);
  }
}

class Uniq extends Transform {
  constructor() {
    super({ objectMode: true });
    this.map = {};
  }
  _transform(file, enc, cb) {
    this.map[file.path] = file;
    cb();
  }
  _flush(done) {
    for (let filePath in this.map) {
      let file = this.map[filePath];
      this.push(file);
    }
    done();
  }
}

let CLOSURE_LINT_ONLY = false;
let EXPECTED_WARNING_COUNT = 498;

gulp.task('clean', () => del(DIST_DIR));

gulp.task('closure', ['clean'], () => {

  let entry, splitRx, joinRx;

  function config(path) {
    entry = path;
    joinRx = new RegExp(path.split('/').join('\\/'));
    splitRx = new RegExp(joinRx.source + '_script_\\d+\\.js$');
  }

  config('polymer.html');
  // config('lib/mixins/property-effects.html');

  const project = new PolymerProject({
    shell: `./${entry}`,
    fragments: [
      'bower_components/shadycss/apply-shim.html',
      'bower_components/shadycss/custom-style-interface.html'
    ]
  });

  function closureLintLogger(log) {
    let chalk = require('chalk');
    let result = log.split(/\n/).slice(-2)[0];
    let warnings = result.match(/(\d+) warning/);
    // write out log to use with diffing tools later
    fs.writeFileSync('closure.log', chalk.stripColor(log));
    if (warnings && Number(warnings[1]) > EXPECTED_WARNING_COUNT) {
      console.error(chalk.red(`closure linting: actual warning count ${warnings[1]} greater than expected warning count ${EXPECTED_WARNING_COUNT}`));
      process.exit(1);
    }
  }

  let closurePluginOptions;

  if (CLOSURE_LINT_ONLY) {
    closurePluginOptions = {
      logger: closureLintLogger
    }
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
    checks_only: CLOSURE_LINT_ONLY,
    polymer_version: 2,
    externs: [
      'bower_components/shadycss/externs/shadycss-externs.js',
      'externs/webcomponents-externs.js',
      'externs/closure-types.js',
      'externs/polymer-externs.js',
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
    .pipe(() => new OldNameStream(closureStream.fileList_))

  // process source files in the project
  const sources = project.sources();

  // process dependencies
  const dependencies = project.dependencies();

  // merge the source and dependencies streams to we can analyze the project
  const mergedFiles = mergeStream(sources, dependencies);

  const splitter = new polymer.HtmlSplitter();
  return mergedFiles
    .pipe(project.bundler())
    .pipe(new Uniq())
    .pipe(splitter.split())
    .pipe(gulpif(splitRx, closurePipeline()))
    .pipe(splitter.rejoin())
    .pipe(gulpif(joinRx, minimalDocument()))
    .pipe(gulpif(joinRx, size({title: 'closure size', gzip: true, showTotal: false, showFiles: true})))
    .pipe(gulp.dest(COMPILED_DIR))
});

gulp.task('lint-closure', (done) => {
  CLOSURE_LINT_ONLY = true;
  runseq('closure', done);
})

gulp.task('estimate-size', ['clean'], () => {

  const babelPresets = {
    presets: [['babili', {regexpConstructors: false, simplifyComparisons: false}]]
  };

  const project = new PolymerProject({
    shell: POLYMER_LEGACY,
    fragments: [
      'bower_components/shadycss/apply-shim.html',
      'bower_components/shadycss/custom-style-interface.html'
    ]
  });

  // process source files in the project
  const sources = project.sources();

  // process dependencies
  const dependencies = project.dependencies();

  // merge the source and dependencies streams to we can analyze the project
  const mergedFiles = mergeStream(sources, dependencies);

  const bundledSplitter = new polymer.HtmlSplitter();

  const bundlePipe = lazypipe()
  .pipe(() => bundledSplitter.split())
  .pipe(() => gulpif(/\.js$/, babel(babelPresets)))
  .pipe(() => bundledSplitter.rejoin())
  .pipe(minimalDocument)

  return mergedFiles
    .pipe(project.bundler())
    .pipe(gulpif(/polymer\.html$/, bundlePipe()))
    .pipe(new Uniq())
    .pipe(gulpif(/polymer\.html$/, size({ title: 'bundled size', gzip: true, showTotal: false, showFiles: true })))
    // write to the bundled folder
    .pipe(gulp.dest(BUNDLED_DIR))
});

gulp.task('lint', function() {
  return gulp.src(['lib/**/*.html', 'test/unit/*.html', 'util/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('generate-closure-externs', ['clean'], () => {
  let genClosure = require('@polymer/gen-closure-declarations').generateDeclarations;
  return genClosure().then((declarations) => {
    fs.writeFileSync('externs/closure-types.js', declarations);
  });
});