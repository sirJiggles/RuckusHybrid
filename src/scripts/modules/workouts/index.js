module.exports = angular.module('app.workouts', [
  'ui.router',
  'ng.group',
  'ngAnimate'
]);

require('./config.js');
require('./WorkoutsCtrl.js');
