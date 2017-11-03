require('./')
  .service('shareService', shareService);

/**
 * @ngInject
 */
function shareService(
  $ionicPopup,
  $ionicActionSheet,
  timerSettings,
  log,
  $q,
  $filter
) {

  // used later for the ionic share sheet
  var shareSheet = {};
  var shareMessage = '';
  var shareUrl = 'http://ruckus-app.com';

  // Interface for the service
  return {
    share: share
  };

  function share(shareData) {
    var def = $q.defer();

    if (!shareData.roundsDone || !shareData.totalTime) {
      def.reject();
    } else {
      // work out data for the share
      var duration = $filter('time')(shareData.totalTime);
      duration = $filter('date')(duration, 'HH:mm:ss');

      if (timerSettings.getCallouts()) {
        shareMessage = 'Just landed ' + shareData.hitTotal + ' hits over ' + shareData.roundsDone + ' rounds on Ruckus, duration: ' + duration;
      } else {
        shareMessage = 'Just went ' + shareData.roundsDone + ' rounds on Ruckus, duration: ' + duration;
      }

      shareSheet = $ionicActionSheet.show({
        buttons: [
          { text: 'Share on Facebook' },
          { text: 'Share on Twitter' }
        ],
        cancelText: 'Cancel',
        cancel: function() {
          def.reject();
        },
        buttonClicked: function(index) {

          if (index === 0) {
            if (window.plugins) {
              // check if this is the first time the user has ever shared
              if (!timerSettings.getSeenShareMessage()) {
                var shareAlertFb = $ionicPopup.alert({
                  title: 'Paste in Facebook message box',
                  template: 'Hold down click / tap in the Facebook text box and select "paste" to insert the share message.'
                });

                // On clicking ok on the facebook message
                shareAlertFb.then(function() {
                  timerSettings.setSeenShareMessage(true);
                  shareFB.call(this, def);
                });
              } else {
                shareFB(def);
              }
            }
          }
          if (index === 1) {
            if (window.plugins) {
              window.plugins.socialsharing.shareViaTwitter(
                shareMessage,
                null,
                shareUrl,
                shared.bind(this, def),
                shareError.bind(this, def)
              );
            }
          }
        }
      });
    }

    return def.promise;
  }

  // errors when the share applictions are not installed
  function shareError(def) {
    // only show the errors on android, ios handles it already
    if (ionic.Platform.isAndroid()) {
      $ionicPopup.alert({
       title: 'Unable to share',
       template: 'Do you have the correct application installed?'
      });
    }

    def.reject();
    shareSheet();
  }

  function shared(def) {
    def.resolve();
    shareSheet();
  }

  function shareFB(def) {
    window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint(
      shareMessage,
      null,
      shareUrl,
      'Paste in the message box!',
      shared.bind(this, def),
      shareError.bind(this, def));
  }

}
