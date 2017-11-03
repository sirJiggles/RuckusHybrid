require('./')
  .config(config);

/**
 * @ngInject
 */
function config($stateProvider) {
  $stateProvider
    .state('workouts', {
      url: '/workouts',
      parent: 'app',
      cache: false,
      controller: 'WorkoutsCtrl as vm',
      template: require('./workouts.html')
    });

  // define the chart options from here the provider does not work
  Chart.defaults.global.events = [];
  Chart.defaults.global.legend.display = false;
  Chart.defaults.global.elements.point.backgroundColor = '#D86503';
  Chart.defaults.global.elements.point.radius = 6;
  Chart.defaults.global.colors = ['#D86503'];
  Chart.defaults.global.elements.line.fill = false;
  Chart.defaults.global.elements.line.borderColor = '#A94E00';

}
