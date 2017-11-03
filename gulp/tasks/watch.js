var gulp = require('gulp');
var runSequence = require('run-sequence');
var config = require('./config');

gulp.task('watch', 'Watch the CSS and JS files for changes', function() {

  gulp.watch(config.watch.css, function() {
    runSequence(
      ['styles'],
      ['index']
    );
  });

  gulp.watch(config.watch.js, function() {
    runSequence(
      ['bundle'],
      ['index']
    );
  });

  gulp.watch(config.watch.index, function() {
    runSequence(
      ['index']
    );
  });

});
