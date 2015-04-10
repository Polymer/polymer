var gulp   = require('gulp'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	header = require('gulp-header'),
	concat = require('gulp-concat'),

	paths  = {
		components: ['components/**/*.js', '!components/**/*.min.js'],
		main: [
			'components/prism-core.js',
			'components/prism-markup.js',
			'components/prism-css.js',
			'components/prism-clike.js',
			'components/prism-javascript.js',
			'plugins/file-highlight/prism-file-highlight.js'
		],
		plugins: ['plugins/**/*.js', '!plugins/**/*.min.js']
	};

gulp.task('components', function() {
	return gulp.src(paths.components)
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('components'));
});

gulp.task('build', function() {
	return gulp.src(paths.main)
		.pipe(header('\n/* **********************************************\n' +
			'     Begin <%= file.relative %>\n' +
			'********************************************** */\n\n'))
		.pipe(concat('prism.js'))
		.pipe(gulp.dest('./'));
});

gulp.task('plugins', function() {
	return gulp.src(paths.plugins)
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('plugins'));
});

gulp.task('watch', function() {
	gulp.watch(paths.components, ['components', 'build']);
	gulp.watch(paths.plugins, ['plugins', 'build']);
});

gulp.task('default', ['components', 'plugins', 'build']);
