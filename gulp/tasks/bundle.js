var gulp = require('gulp');
var browserify = require('browserify')
var rename = require('gulp-rename');
var stringify = require('stringify');
var ngAnnotate = require('gulp-ng-annotate');
var yargs = require('yargs').argv;
var production = !!yargs.production;
var config = require('./config');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('bundle', 'Bundle JavaScript app modules', function(done) {

  return browserify(config.bundle.entry)
    .transform(stringify({
      extensions: ['.html'],
      minify: true
    }))
    .bundle()
    .pipe(source(config.bundle.output))
    .pipe(buffer())
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest(config.bundle.outputPath));
    
});
