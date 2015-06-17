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

import gulp from 'gulp';
import audit from 'gulp-audit';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import vulcanize from 'gulp-vulcanize';
import runseq from 'run-sequence';
import lazypipe from 'lazypipe';
import polyclean from 'polyclean';
import del from 'del';

import path from 'path';

const micro = "polymer-micro.html";
const mini = "polymer-mini.html";
const max = "polymer.html";
const workdir = 'dist';

const distMicro = path.join(workdir, micro);
const distMini = path.join(workdir, mini);
const distMax = path.join(workdir, max);

const pkg = require('./package.json');

var cleanupPipe = lazypipe()
  // Reduce script tags
  .pipe(replace, /<\/script>\s*<script>/g, '\n\n')
  // Add real version number
  .pipe(replace, /(Polymer.version = )'master'/, '$1"' + pkg.version + '"')
  // remove leading whitespace and comments
  .pipe(polyclean.leftAlignJs)
  // remove html wrapper
  .pipe(replace, '<html><head><meta charset="UTF-8">', '')
  .pipe(replace, '</head><body></body></html>', '')
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

gulp.task('clean', cb => del(workdir, cb));

// copy bower.json into dist folder
gulp.task('copy-bower-json', () => {
  return gulp.src('bower.json').pipe(gulp.dest(workdir));
});

// Default Task
gulp.task('default', cb => {
  runseq('clean', ['micro', 'mini', 'max'], cb);
});

// switch src and build for testing
gulp.task('save-src', () => {
  return gulp.src([mini, micro, max])
    .pipe(rename(function(p) {
      p.extname += '.bak';
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('restore-src', () => {
  return gulp.src([mini + '.bak', micro + '.bak', max + '.bak'])
    .pipe(rename(function(p) {
      p.extname = '';
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('cleanup-switch', cb => {
  del([mini + '.bak', micro + '.bak', max + '.bak'], cb);
});

gulp.task('switch-build', () => {
  return gulp.src([distMini, distMicro, distMax])
    .pipe(gulp.dest('.'));
});

gulp.task('switch', cb => {
  runseq('default', 'save-src', 'switch-build', cb);
});

gulp.task('restore', cb => {
  runseq('restore-src', 'cleanup-switch', cb);
});

gulp.task('audit', () => {
  return gulp.src([distMini, distMicro, distMax])
    .pipe(audit('build.log', { repos: ['.'] }))
    .pipe(gulp.dest(workdir));
});

gulp.task('release', cb => {
  runseq('default', ['copy-bower-json', 'audit'], cb);
});
