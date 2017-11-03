var gulp  = require('gulp');
var browserSync = require('browser-sync');
var config = require('./config');

gulp.task('browser-sync', 'Serve content as server', function() {
  browserSync(config.browserSync);
});
