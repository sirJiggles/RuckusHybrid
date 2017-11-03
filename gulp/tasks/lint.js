var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('jshint-stylish');
var config = require('./config');

gulp.task('jscs', 'Check JavaScript coding guidelines', function() {
  return gulp.src(config.lint)
    .pipe(jscs());
});

gulp.task('jshint', 'Check JavaScript syntax errors', function() {
  return gulp.src(config.lint)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('lint', 'Lint all Javascript files', ['jshint', 'jscs']);
