require('./')
  .config(config);

/**
 * @ngInject
 */
function config($stateProvider) {
  $stateProvider
    .state('settings', {
      url: '/settings',
      parent: 'app',
      controller: 'SettingsCtrl as vm',
      template: require('./settings.html')
    });
}
