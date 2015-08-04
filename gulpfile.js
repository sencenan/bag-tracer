var
	gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	mocha = require('gulp-mocha');

gulp.task('default', function() {
	return gulp
		.src('src/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(concat('all.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
});

gulp.task('test', function() {
	return gulp
		.src('test/**/*.js')
		.pipe(babel())
		.pipe(concat('test.all.js'))
		.pipe(gulp.dest('dist'))
		.pipe(
			mocha({reporter: 'nyan'})
		);
});
