var gulp  = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var config = require('./config');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('styles', 'Compile sass to css for the application', function() {
  return gulp.src(config.watch.css)
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.styles.output));
});
