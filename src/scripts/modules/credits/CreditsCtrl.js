require('./')
  .controller('CreditsCtrl', CreditsCtrl);

/**
 * @ngInject
 */
function CreditsCtrl($cordovaInAppBrowser) {

  var vm = this;

  vm.openExternal = openExternal;

  function openExternal(url) {
    $cordovaInAppBrowser.open(url, '_system', '');
  }

}
