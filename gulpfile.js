var gulp = require('gulp');
var replace = require('gulp-replace');
var shell = require('gulp-shell');

var polyclean = require('polyclean');

function vulcanize(filename, dstdir, excludes) {
  var cmd =  'node_modules/vulcanize/bin/vulcanize';
  if (excludes && excludes.length > 0) {
    excludes.forEach(function(exclude) {
      cmd = cmd + ' --exclude ' + exclude;
    });
    cmd = cmd + ' --implicit-strip';
  }
  cmd = cmd + ' ' + filename + ' > ' + dstdir + '/' + filename;
  return cmd
}

var micro = "polymer-micro.html";
var mini = "polymer-mini.html";
var max = "polymer.html";

gulp.task('micro', shell.task(vulcanize(micro, 'dist')));
gulp.task('mini', shell.task(vulcanize(mini, 'dist', [micro])));
gulp.task('max', shell.task(vulcanize(max, 'dist', [mini, micro])));

gulp.task('strip', ['micro', 'mini', 'max'], function() {
  return gulp.src('dist/*.html')
    .pipe(polyclean.cleanJsComments())
    // Get rid of erroneous html comments
    .pipe(replace(/<!--((?!@license)[^])*?-->/g, ''))
    // Reduce script tags
    .pipe(replace(/<\/script>\s*<script>/g, '\n'))
    // Collapse newlines
    .pipe(replace(/\n\s*\n/g, '\n'))
    // Collapse leading spaces+tabs.
    .pipe(replace(/^[ \t]+/gm, ''))
    .pipe(gulp.dest('dist'));
});


// Default Task
gulp.task('default', ['strip']);