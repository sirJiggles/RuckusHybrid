require('./')
  .config(config);

/**
 * @ngInject
 */
function config($stateProvider) {
  $stateProvider
    .state('credits', {
      url: '/credits',
      parent: 'app',
      controller: 'CreditsCtrl as vm',
      template: require('./credits.html')
    });
}
