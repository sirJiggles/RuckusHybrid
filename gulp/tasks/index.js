var gulp = require('gulp');
var usemin = require('gulp-usemin');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var config = require('./config');
var yargs = require('yargs').argv;
var production = !!yargs.production;

gulp.task('index', 'Replace references to non-optimized scripts or stylesheets',
  function() {
    var opts = {
      css: [],
      vendor: [],
      app: []
    };

    if (production) {
      opts = {
        css: [minifyCss(), rev()],
        vendor: [uglify(), rev()],
        app: [uglify(), rev()]
      };
    }

    return gulp.src(config.srcPath + '/index.html')
      .pipe(usemin(opts))
      .pipe(gulp.dest(config.distPath));
  }
);
