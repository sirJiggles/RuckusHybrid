module.exports = angular.module('app.timer', [
  'ui.router',
  'ionic',
  'ngCordova',
  'ngAnimate'
]);

require('./config.js');
require('./TimerCtrl.js');
require('./timeFilter.js');
