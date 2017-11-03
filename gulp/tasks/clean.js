var gulp = require('gulp');
var del = require('del');
var config = require('./config');

gulp.task('clean', 'Remove files from the dist dir', function(done) {
  del([config.distPath], done);
});
