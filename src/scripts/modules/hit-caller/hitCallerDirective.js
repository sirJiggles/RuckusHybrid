require('./')
  .directive('hitCaller', hitCallerDirective);

/**
 * @ngInject
 */
function hitCallerDirective(
  hitCallerService,
  timerSettings,
  $interval,
  $timeout,
  utils,
  log
) {

  return {
    replace: true,
    restrict: 'E',
    template: require('./hit-caller.html'),
    link: link
  };

  // Linking function
  function link($scope) {
    // set the time bases
    var difficultyBase = timerSettings.getDifficulty(),
        difficulty = getDifficulty(),
        callouts = timerSettings.getCallouts(),
        startTimeout,
        nextComoboTimer,
        stopped = false;

    // init the hit caller service
    ionic.Platform.ready(function() {
      hitCallerService.init();
    });

    // enter pause mode
    $scope.$on('pauseMode', function() {
      stop();
    });

    $scope.$on('finished', function() {
      // get the data about the hits, send it back
      $scope.$emit('hitTotal', hitCallerService.getHits());

      // once emitted reset it to 0
      hitCallerService.resetHits();
    });

    // when the hit service tells us its called a hit that needs more time
    $scope.$on('addTimeOn', function(event, time) {
      difficulty = (difficulty + time);
    });

    // start / resume
    $scope.$on('roundMode', function() {
      // set the flag so we actually run
      stopped = false;
      if (!callouts) {
        return;
      }
      // dont start calling the combos out till the bell sound is done
      startTimeout = $timeout(run, 2500);
    });

    // run the watch for combos function
    function run() {
      hitCallerService.runCombo().then(function(combo) {
        if (stopped) {
          difficulty = getDifficulty();
          return;
        }
        nextComoboTimer = $timeout(function() {
          // reset the difficulty
          difficulty = getDifficulty();
          // call this function again, now the combo is done
          if (!stopped) {
            run();
          }
        }, difficulty);
      });
    }

    // stop the 'watching for combo end timer' and reset flags
    function stop() {
      $timeout.cancel(nextComoboTimer);
      $timeout.cancel(startTimeout);
      hitCallerService.stop();
      stopped = true;
    }

    // get the base difficulty value
    function getDifficulty() {
      return (2800 - (difficultyBase * 25));
    }
  }
}
