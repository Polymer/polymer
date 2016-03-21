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

var gulp = require('gulp');
var audit = require('gulp-audit');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var vulcanize = require('gulp-vulcanize');
var runseq = require('run-sequence');
var lazypipe = require('lazypipe');
var polyclean = require('polyclean');
var del = require('del');
var eslint = require('gulp-eslint');

var path = require('path');

var minimalDocument = require('./util/minimalDocument');

var micro = "polymer-micro.html";
var mini = "polymer-mini.html";
var max = "polymer.html";
var workdir = 'dist';

var distMicro = path.join(workdir, micro);
var distMini = path.join(workdir, mini);
var distMax = path.join(workdir, max);

var pkg = require('./package.json');

var cleanupPipe = lazypipe()
  // remove leading whitespace and comments
  .pipe(polyclean.leftAlignJs)
  // remove html wrapper
  .pipe(minimalDocument)
  // Add real version number
  .pipe(replace, /(Polymer.version = )'master'/, '$1"' + pkg.version + '"')
;

function vulcanizeWithExcludes(target, excludes) {
  if (excludes) {
    excludes = excludes.map(function(ex) { return path.resolve(ex); });
  }
  return function() {
    return gulp.src(target)
      .pipe(vulcanize({
        stripComments: true,
        excludes: excludes
      }))
      .pipe(cleanupPipe())
      .pipe(gulp.dest(workdir));
  };
}

gulp.task('micro', vulcanizeWithExcludes(micro));
gulp.task('mini', vulcanizeWithExcludes(mini, [micro]));
gulp.task('max', vulcanizeWithExcludes(max, [mini, micro]));

gulp.task('clean', function() {
  return del(workdir);
});

// copy bower.json into dist folder
gulp.task('copy-bower-json', function() {
  return gulp.src('bower.json').pipe(gulp.dest(workdir));
});

// Default Task
gulp.task('default', function(cb) {
  runseq('clean', ['micro', 'mini', 'max'], cb);
});

// switch src and build for testing
gulp.task('save-src', function() {
  return gulp.src([mini, micro, max])
    .pipe(rename(function(p) {
      p.extname += '.bak';
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('restore-src', function() {
  return gulp.src([mini + '.bak', micro + '.bak', max + '.bak'])
    .pipe(rename(function(p) {
      p.extname = '';
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('cleanup-switch', function() {
  return del([mini + '.bak', micro + '.bak', max + '.bak']);
});

gulp.task('switch-build', function() {
  return gulp.src([distMini, distMicro, distMax])
    .pipe(gulp.dest('.'));
});

gulp.task('switch', function(cb) {
  runseq('default', 'save-src', 'switch-build', cb);
});

gulp.task('restore', function(cb) {
  runseq('restore-src', 'cleanup-switch', cb);
});

gulp.task('audit', function() {
  return gulp.src([distMini, distMicro, distMax])
    .pipe(audit('build.log', { repos: ['.'] }))
    .pipe(gulp.dest(workdir));
});

gulp.task('release', function(cb) {
  runseq('default', ['copy-bower-json', 'audit'], cb);
});

gulp.task('lint', function() {
  return gulp.src(['src/**/*.html', 'test/unit/*.html', 'util/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
