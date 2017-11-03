require('./')
  .controller('AppCtrl', AppCtrl);

/**
 * @ngInject
 */
function AppCtrl($cordovaStatusbar) {
  // hide the status bar
  ionic.Platform.ready(function() {
    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
      $cordovaStatusbar.hide();
    }
  });

}
