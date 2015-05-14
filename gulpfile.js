var gulp = require('gulp');
var audit = require('gulp-audit');
var replace = require('gulp-replace');
var shell = require('gulp-shell');
var rename = require('gulp-rename');
var runseq = require('run-sequence');
var del = require('del');
var fs = require('fs');
var path = require('path');

var polyclean = require('polyclean');

function vulcanize(filename, dstdir, excludes) {
  var cmd = path.join('node_modules', '.bin', 'vulcanize');
  if (excludes && excludes.length > 0) {
    excludes.forEach(function(exclude) {
      cmd = cmd + ' --exclude ' + exclude;
    });
  }
  cmd = cmd + ' --strip-comments';
  cmd = cmd + ' ' + filename + ' > ' + path.join(dstdir, filename);
  return cmd;
}

var micro = "polymer-micro.html";
var mini = "polymer-mini.html";
var max = "polymer.html";
var workdir = 'dist';

gulp.task('micro', ['mkdir'], shell.task(vulcanize(micro, workdir)));
gulp.task('mini', ['mkdir'], shell.task(vulcanize(mini, workdir, [micro])));
gulp.task('max', ['mkdir'], shell.task(vulcanize(max, workdir, [mini, micro])));

gulp.task('strip', ['micro', 'mini', 'max'], function() {
  return gulp.src(['dist/' + micro, 'dist/' + mini, 'dist/' + max])
    .pipe(polyclean.cleanJsComments())
    // Collapse newlines
    .pipe(replace(/\n\s*\n/g, '\n'))
    // Reduce script tags
    .pipe(replace(/<\/script>\s*<script>/g, '\n\n'))
    .pipe(replace('<html><head><meta charset="UTF-8">', ''))
    .pipe(replace('</head><body>\n</body></html>', ''))
    // Collapse leading spaces+tabs.
    .pipe(replace(/^[ \t]+/gm, ''))
    // put the out
    .pipe(gulp.dest('dist'))
    ;
});

gulp.task('clean', function(cb) {
  del(workdir, cb);
});

gulp.task('mkdir', ['clean'], function(cb) {
  fs.exists(workdir, function(exists) {
    exists ? cb() : fs.mkdir(workdir, null, cb);
  });
});

// Default Task
gulp.task('default', ['strip']);

// switch src and build for testing
gulp.task('save-src', function() {
  return gulp.src([mini, micro, max])
  .pipe(rename(function (p) {
    p.extname += '.bak';
  }))
  .pipe(gulp.dest('.'))
  ;
});

gulp.task('restore-src', function() {
  return gulp.src([mini + '.bak', micro + '.bak', max + '.bak'])
  .pipe(rename(function (p) {
    p.extname = '';
  }))
  .pipe(gulp.dest('.'))
  ;
});

gulp.task('cleanup-switch', function(cb) {
  del([mini + '.bak', micro + '.bak', max + '.bak'], cb);
});

gulp.task('switch-build', function() {
  return gulp.src(['dist/' + mini, 'dist/' + micro, 'dist/' + max])
  .pipe(gulp.dest('.'));
});

gulp.task('restore-build', function() {
  return gulp.src([mini, micro, max])
  .pipe(gulp.dest('dist'));
});

gulp.task('switch', ['default'], function(cb) {
  runseq('save-src', 'switch-build', cb);
});

gulp.task('restore', ['clean'], function(cb) {
  runseq('restore-build', 'restore-src', 'cleanup-switch', cb);
});

gulp.task('audit', function() {
  return gulp.src([mini, micro, max])
  .pipe(audit('build.log', {
    repos: [
      '.'
    ]
  }))
  .pipe(gulp.dest('dist'))
  ;
});
