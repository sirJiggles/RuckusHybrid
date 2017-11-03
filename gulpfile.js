var gulp = require('gulp');
// shows available gulp tasks using the gulp help command
require('gulp-help')(gulp);

var requireDir = require('require-dir');

requireDir('./gulp/tasks', {recurse: true});
