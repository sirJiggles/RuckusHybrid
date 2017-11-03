require('./')
  .config(config);

/**
 * @ngInject
 */
function config(
  $stateProvider,
  $urlRouterProvider,
  $ionicConfigProvider,
  $localForageProvider,
  $sceDelegateProvider
) {

  $stateProvider.state('app', {
    abstract: true,
    template: require('./app.html'),
    controller: 'AppCtrl as vm'
  });

  // white list videos from you tube
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'https://www.youtube.com/**'
  ]);

  // disable the cache
  // $ionicConfigProvider.views.maxCache(0);
  $ionicConfigProvider.tabs.position('bottom');

  $urlRouterProvider.when('', '/timer');

  // config for the offline / only database
  $localForageProvider.config({
    version: 1.0,
    name: 'fight-trainer',
    description: 'Fight trainer application'
  });
}
