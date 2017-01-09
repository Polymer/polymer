/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http:polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http:polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http:polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http:polymer.github.io/PATENTS.txt
 */

// jshint node: true
'use strict';

/* global require */
const gulp = require('gulp');
const gulpif = require('gulp-if');
const audit = require('gulp-audit');
const rename = require('gulp-rename');
const runseq = require('run-sequence');
const del = require('del');
const eslint = require('gulp-eslint');
const fs = require('fs');
const path = require('path');

const DIST_DIR = 'dist';
const BUNDLED_DIR = path.join(DIST_DIR, 'bundled');
const UNBUNDLED_DIR = path.join(DIST_DIR, 'unbundled');
const DEFAULT_BUILD_DIR = BUNDLED_DIR;
const POLYMER_LEGACY = 'polymer.html';
const POLYMER_ELEMENT = 'polymer-element.html';
const DEFAULT_BUILD_TARGET = POLYMER_LEGACY;
const ENTRY_POINTS = [POLYMER_LEGACY, POLYMER_ELEMENT];

const polymer = require('polymer-build');
const PolymerProject = polymer.PolymerProject;
const project = new PolymerProject({
  sources: ['./polymer.html'],
  shell: './polymer.html'
});
const fork = polymer.forkStream;

const mergeStream = require('merge-stream');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const gzipSize = require('gzip-size');
const prettyBytes = require('pretty-bytes');

const closure = require('google-closure-compiler').gulp();

gulp.task('clean', function () {
  return del(DIST_DIR);
});

const {Transform} = require('stream');

class LogStream extends Transform {
  constructor(prefix) {
    super({objectMode: true});
    this.prefix = prefix;
  }
  _transform(file, enc, cb) {
    console.log(`${this.prefix}: ${file.path}`);
    cb(null, file);
  }
  _flush(cb) {
    cb();
  }
}

class FilterStream extends Transform {
  constructor() {
    super({objectMode: true});
  }
  _transform(file, enc, cb) {
    if (file.path.match(/polymer\.html_script_\d+\.js$/)) {
      cb(null, file);
    } else {
      cb(null, null);
    }
  }
}

gulp.task('build', ['clean'], () => {

  const closureStream = closure({
    // new_type_inf: true,
    compilation_level: 'ADVANCED',
    // compilation_level: 'SIMPLE',
    language_in: 'ES6_STRICT',
    language_out: 'ES5_STRICT',
    warning_level: 'VERBOSE',
    js_output_file: 'polymer.js',
    output_wrapper: `${require('fs').readFileSync('LICENSE.txt')}\n(function(){\n%output%\n}).call(self)`,
    rewrite_polyfills: false,
    formatting: 'PRETTY_PRINT',
    externs: ['externs/externs.js']
  });

  // process source files in the project
  const sources = project.sources()

  // process dependencies
  const dependencies = project.dependencies()

  // merge the source and dependencies streams to we can analyze the project
  const mergedFiles = mergeStream(sources, dependencies);

  return mergedFiles
    .pipe(project.bundler)
    .pipe(project.splitHtml())
    .pipe(new FilterStream())
    .pipe(closureStream)
    .pipe(gulp.dest(BUNDLED_DIR))
});

// copy bower.json into dist folder
gulp.task('copy-bower-json', function () {
  return gulp.src('bower.json').pipe(gulp.dest(DEFAULT_BUILD_DIR));
});

// Build
gulp.task('build-steps', function (cb) {
  runseq('restore-src', 'build', 'print-size', cb);
});

// Bundled build
gulp.task('build-bundled', function (cb) {
  runseq('build-steps', 'save-src', 'link-bundled', cb);
});

// Unbundled build
gulp.task('build-unbundled', function (cb) {
  runseq('build-steps', 'save-src', 'link-unbundled', cb);
});

// Default Task
gulp.task('default', ['build-bundled']);

// switch src and build for testing
gulp.task('save-src', function () {
  return gulp.src(ENTRY_POINTS)
    .pipe(rename(function (p) {
      p.extname += '.src';
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('restore-src', function (cb) {
  const files = ENTRY_POINTS.map(f => `${f}.src`);
  gulp.src(files)
    .pipe(rename(function (p) {
      p.extname = '';
    }))
    .pipe(gulp.dest('.'))
    .on('end', () => Promise.all(files.map(f => del(f))).then(() => cb()));
});

gulp.task('link-bundled', function (cb) {
  ENTRY_POINTS.forEach(f => {
    fs.writeFileSync(f, `<link rel="import" href="${DEFAULT_BUILD_DIR}/${DEFAULT_BUILD_TARGET}">`);
  });
  cb();
});

gulp.task('link-unbundled', function (cb) {
  ENTRY_POINTS.forEach(f => {
    fs.writeFileSync(f, `<link rel="import" href="${DEFAULT_BUILD_DIR}/${f}">`);
  });
  cb();
});

gulp.task('print-size', function (cb) {
  fs.readFile(path.join(DEFAULT_BUILD_DIR, DEFAULT_BUILD_TARGET), function (err, contents) {
    gzipSize(contents, function (err, size) {
      console.log(`${DEFAULT_BUILD_TARGET} size: ${prettyBytes(size)}`);
      cb();
    });
  });
});

gulp.task('audit', function () {
  return gulp.src(ENTRY_POINTS.map(f => path.join(DEFAULT_BUILD_DIR, f)))
    .pipe(audit('build.log', { repos: ['.'] }))
    .pipe(gulp.dest(DEFAULT_BUILD_DIR));
});

gulp.task('release', function (cb) {
  runseq('default', ['copy-bower-json', 'audit'], cb);
});

gulp.task('lint', function () {
  return gulp.src(['src/**/*.html', 'test/unit/*.html', 'util/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
