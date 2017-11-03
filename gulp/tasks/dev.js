var gulp  = require('gulp');
var config = require('./config');
var runSequence = require('run-sequence');

gulp.task('dev', 'Run dev environment', function(done) {
  runSequence(
    ['clean'],
    ['bundle', 'styles', 'copy'],
    ['index'],
    ['watch', 'browser-sync'],
    done
  );
});
