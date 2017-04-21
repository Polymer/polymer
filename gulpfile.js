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
const audit = require('gulp-audit');
const rename = require('gulp-rename');
const runseq = require('run-sequence');
const del = require('del');
const eslint = require('gulp-eslint');
const fs = require('fs');
const path = require('path');
const mergeStream = require('merge-stream');
const babel = require('gulp-babel');
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size');
const lazypipe = require('lazypipe');
const closure = require('google-closure-compiler').gulp();
const minimalDocument = require('./util/minimalDocument.js')

const DIST_DIR = 'dist';
const BUNDLED_DIR = path.join(DIST_DIR, 'bundled');
const UNBUNDLED_DIR = path.join(DIST_DIR, 'unbundled');
const COMPILED_DIR = path.join(DIST_DIR, 'compiled');
const DEFAULT_BUILD_DIR = BUNDLED_DIR;
const POLYMER_LEGACY = 'polymer.html';
const POLYMER_ELEMENT = 'polymer-element.html';
const DEFAULT_BUILD_TARGET = POLYMER_LEGACY;
const ENTRY_POINTS = [POLYMER_LEGACY, POLYMER_ELEMENT];

const polymer = require('polymer-build');
const PolymerProject = polymer.PolymerProject;
const project = new PolymerProject({ entrypoint: DEFAULT_BUILD_TARGET });
const fork = polymer.forkStream;

gulp.task('clean', function() {
  return del(DIST_DIR);
});

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

let CLOSURE_LINT_ONLY = false;
let EXPECTED_WARNING_COUNT = 498;

gulp.task('closure', ['clean'], () => {

  let entry, splitRx, joinRx;

  function full() {
    entry = 'polymer.html';
    splitRx = /polymer\.html_script_\d+\.js$/;
    joinRx = /polymer\.html/;
  }

  function element() {
    entry = 'polymer-element.html';
    splitRx = /polymer-element\.html_script_\d+\.js$/;
    joinRx = /polymer-element\.html/;
  }

  // element();
  full();

  const project = new PolymerProject({
    shell: `./${entry}`
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
    output_wrapper: '(function(){\n%output%\n}).call(self);',
    assume_function_wrapper: true,
    rewrite_polyfills: false,
    new_type_inf: true,
    checks_only: CLOSURE_LINT_ONLY,
    externs: [
      'bower_components/shadycss/externs/shadycss-externs.js',
      'externs/webcomponents-externs.js',
      'externs/polymer-externs.js',
      'externs/closure-types.js',
    ],
    extra_annotation_name: [
      'polymerMixin',
      'polymerMixinClass',
      'polymerElement'
    ]
  }, closurePluginOptions);

  const closurePipeline = lazypipe()
    .pipe(() => closureStream)
    .pipe(() => new OldNameStream(closureStream.fileList_))

  // process source files in the project
  const sources = project.sources();

  // process dependencies
  const dependencies = project.dependencies();

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

  class NoDeps extends Transform {
    constructor() {
      super({objectMode: true});
    }
    _transform(file, enc, cb) {
      if (file.path.match(/shadycss/)) {
        file.contents = new Buffer('');
      }
      cb(null, file);
    }
  }

  // merge the source and dependencies streams to we can analyze the project
  const mergedFiles = mergeStream(sources, dependencies);

  const splitter = new polymer.HtmlSplitter();
  return mergedFiles
    .pipe(new NoDeps())
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

gulp.task('build', ['clean'], () => {
 // process source files in the project
 const sources = project.sources();

 // process dependencies
 const dependencies = project.dependencies();

 // merge the source and dependencies streams to we can analyze the project
 const mergedFiles = mergeStream(sources, dependencies);

 const bundlePipe = lazypipe()
  .pipe(() => project.splitHtml())
  .pipe(() => gulpif(/\.js$/, babel({presets: ['babili']})))
  .pipe(() => project.rejoinHtml())
  .pipe(htmlmin, {removeComments: true})
  .pipe(minimalDocument)
  .pipe(size, {title: 'bundled size', gzip: true, showTotal: false, showFiles: true})

 return mergeStream(
   fork(mergedFiles)
    .pipe(project.bundler)
    .pipe(gulpif(/polymer\.html/, bundlePipe()))
    // write to the bundled folder
    .pipe(gulp.dest(BUNDLED_DIR)),

   fork(mergedFiles)
    .pipe(project.splitHtml())
    // add compilers or optimizers here!
    .pipe(gulpif(/\.js$/, babel({presets: ['babili']})))
    .pipe(project.rejoinHtml())
    .pipe(htmlmin({removeComments: true}))
    // write to the unbundled folder
    .pipe(gulp.dest(UNBUNDLED_DIR))
 );
});

// copy bower.json into dist folder
gulp.task('copy-bower-json', function() {
  return gulp.src('bower.json').pipe(gulp.dest(DEFAULT_BUILD_DIR));
});

// Build
gulp.task('build-steps', function(cb) {
  runseq('restore-src', 'build', 'print-size', cb);
});

// Bundled build
gulp.task('build-bundled', function(cb) {
  runseq('build-steps', 'save-src', 'link-bundled', cb);
});

// Unbundled build
gulp.task('build-unbundled', function(cb) {
  runseq('build-steps', 'save-src', 'link-unbundled', cb);
});

// Default Task
gulp.task('default', ['build-bundled']);

// switch src and build for testing
gulp.task('save-src', function() {
  return gulp.src(ENTRY_POINTS)
    .pipe(rename(function(p) {
      p.extname += '.src';
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('restore-src', function(cb) {
  const files = ENTRY_POINTS.map(f => `${f}.src`);
  gulp.src(files)
    .pipe(rename(function(p) {
      p.extname = '';
    }))
    .pipe(gulp.dest('.'))
    .on('end', () => Promise.all(files.map(f => del(f))).then(() => cb()));
});

gulp.task('link-bundled', function(cb) {
  ENTRY_POINTS.forEach(f => {
    fs.writeFileSync(f, `<link rel="import" href="${DEFAULT_BUILD_DIR}/${DEFAULT_BUILD_TARGET}">`);
  });
  cb();
});

gulp.task('link-unbundled', function(cb) {
  ENTRY_POINTS.forEach(f => {
    fs.writeFileSync(f, `<link rel="import" href="${DEFAULT_BUILD_DIR}/${f}">`);
  });
  cb();
});

gulp.task('audit', function() {
  return gulp.src(ENTRY_POINTS.map(f => path.join(DEFAULT_BUILD_DIR, f)))
    .pipe(audit('build.log', { repos: ['.'] }))
    .pipe(gulp.dest(DEFAULT_BUILD_DIR));
});

gulp.task('release', function(cb) {
  runseq('default', ['copy-bower-json', 'audit'], cb);
});

gulp.task('lint', function() {
  return gulp.src(['lib/**/*.html', 'test/unit/*.html', 'util/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
