var gulp = require('gulp');
var replace = require('gulp-replace');
var shell = require('gulp-shell');
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
    cmd = cmd + ' --implicit-strip';
  }
  cmd = cmd + ' --strip-comments';
  cmd = cmd + ' ' + filename + ' > ' + path.join(dstdir, filename);
  return cmd;
}

var micro = "polymer-micro.html";
var mini = "polymer-mini.html";
var max = "polymer.html";

gulp.task('micro', ['mkdir'], shell.task(vulcanize(micro, 'dist')));
gulp.task('mini', ['mkdir'], shell.task(vulcanize(mini, 'dist', [micro])));
gulp.task('max', ['mkdir'], shell.task(vulcanize(max, 'dist', [mini, micro])));

gulp.task('strip', ['micro', 'mini', 'max'], function() {
  return gulp.src('dist/*.html')
    .pipe(polyclean.cleanJsComments())
    // Reduce script tags
    .pipe(replace(/<\/script>\s*<script>/g, '\n'))
    // Collapse newlines
    .pipe(replace(/\n\s*\n/g, '\n'))
    // Collapse leading spaces+tabs.
    .pipe(replace(/^[ \t]+/gm, ''))
    .pipe(gulp.dest('dist'));
});

var workdir = 'dist';
gulp.task('clean', function(cb) {
  del([workdir], cb);
});

gulp.task('mkdir', ['clean'], function(cb) {
  fs.mkdir(workdir, null, cb);
});

// Default Task
gulp.task('default', ['strip']);
