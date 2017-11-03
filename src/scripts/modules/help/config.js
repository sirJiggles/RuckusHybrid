require('./')
  .config(config);

/**
 * @ngInject
 */
function config($stateProvider) {
  $stateProvider
    .state('help', {
      url: '/help',
      parent: 'app',
      controller: 'HelpCtrl as vm',
      template: require('./help.html')
    });
}
