var gulp = require('gulp');
var config = require('./config');

gulp.task('copy', 'Copy over static files like fonts and images', function() {
  gulp.src(config.copy.paths, {base: config.copy.base})
    .pipe(gulp.dest(config.distPath));
});
