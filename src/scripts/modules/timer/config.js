require('./')
  .config(config);

/**
 * @ngInject
 */
function config($stateProvider) {
  $stateProvider
    .state('timer', {
      url: '/timer',
      cache: false,
      parent: 'app',
      controller: 'TimerCtrl as vm',
      template: require('./timer.html')
    });
}
