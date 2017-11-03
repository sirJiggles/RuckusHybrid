module.exports = angular.module('app', [
  'ui.router',
  'ionic',
  'LocalForageModule',
  'ngAnimate',
  require('../timer').name,
  require('../timer-settings').name,
  require('../settings').name,
  require('../hit-caller').name,
  require('../hit-caller-service').name,
  require('../log').name,
  require('../utils').name,
  require('../workouts').name,
  require('../workout-service').name,
  require('../share-service').name,
  require('../credits').name,
  require('../help').name,
  require('../collapse').name,
  require('../iframe-load').name,
  require('../apptype').name
]);

require('./config.js');
require('./AppCtrl.js');
