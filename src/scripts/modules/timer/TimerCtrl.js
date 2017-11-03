require('./')
  .controller('TimerCtrl', TimerCtrl);

/**
 * @ngInject
 */
function TimerCtrl(
  $scope,
  $interval,
  $timeout,
  $ionicPopup,
  timerSettings,
  hitCallerService,
  workoutService,
  shareService,
  log,
  apptype,
  $cordovaMedia) {

  var vm = this,
      timer,
      volume,
      saveSnapShot,
      countdownTimer,
      roundsDone = 0,
      timeSnapshot = 0,
      secondCounter = 0,
      sounds = false,
      soundPrefix;

  vm.time = 0;
  vm.percentDone = 100;
  vm.running = false;
  vm.pauseMode = false;
  vm.countDownMode = false;
  vm.rounds = 1;
  vm.hitTotal = 0;
  vm.energyPoints = 0;
  vm.totalTime = 0;
  vm.finished = false;
  vm.shared = false;

  vm.callOuts = timerSettings.getCallouts();

  // get the timer settings form the service
  var rounds = timerSettings.getRounds();
  var roundDuration = getTotalSeconds(timerSettings.getRoundDuration());
  var pauseDuration = getTotalSeconds(timerSettings.getPauseDuration());
  var countDownTime = getTotalSeconds(timerSettings.getReady());

  // flag for if pro version
  var pro = apptype.pro;

  // our main functions
  vm.pause = pause;
  vm.play = play;
  vm.stop = stop;
  vm.reset = reset;
  vm.share = share;
  vm.save = save;

  ionic.Platform.ready(function() {

    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
      soundPrefix = ionic.Platform.isAndroid() ? '/android_asset/www/' : '';
      sounds = initSounds();
    }
  });

  // the leave view event
  $scope.$on('$ionicView.beforeLeave', function() {
    stop();
    // android, but also good for housekeeping
    releaseMedia();

    // sounds from the hit service, tried to do this in directie
    // but the before leave does not get fired .... lamez
    var callerSounds = hitCallerService.getSounds();
    if (!callerSounds) {
      return;
    }

    var keys = Object.keys(callerSounds);
    // release all the sounds from the caller service
    keys.forEach(function(key) {
      callerSounds[key].release();
    });
  });

  // the hits total event on done
  $scope.$on('hitTotal', function(event, data) {
    vm.hitTotal = data.total;
    vm.energyPoints = data.energyPoints.toFixed(2);
    vm.totalTime = (roundDuration * roundsDone);
    vm.finished = true;

    // create a save snapshot incase the user would like to save
    // save the data to the workout service (dummy test for now)
    var date = new Date();
    saveSnapShot = {
      hitTotal: vm.hitTotal,
      energyPoints: vm.energyPoints,
      totalTime: vm.totalTime,
      roundsDone: roundsDone,
      date: date.getTime()
    };

  });

  // save function from the timer (use the date as the key)
  function save() {
    if (!pro) {
      $ionicPopup.alert({
       title: 'Pro Feature',
       template: 'Workouts can only be saved in Ruckus Pro. You can however still share!'
      });
      return false;
    }

    if (vm.saved) {
      return false;
    }
    workoutService.editOrCreate(saveSnapShot.date, saveSnapShot).then(function(res) {
      vm.saved = true;
    }, function(err) {
      log.log('there was an error with saving to the datastore' + err);
    });
  }

  // reset after summary
  function reset() {
    vm.hitTotal = 0;
    vm.totalTime = 0;
    vm.finished = false;
    // now can reset rounds done and rounds for display
    roundsDone = 0;
    vm.rounds = 1;
    vm.saved = false;
  }

  // This is called at the end to allow us to release the media
  // to help memory issues in android
  function releaseMedia() {
    if (!sounds) {
      return;
    }
    sounds.bell.release();
    sounds.roundEnd.release();
  }

  function play() {
    if (vm.running) {
      return false;
    }

    // dont allow sleep mode while playing
    if (window.plugins) {
      window.plugins.insomnia.keepAwake();
    }

    vm.running = true;

    if ( (countDownTime === 0 || timeSnapshot !== 0) && !vm.countDownMode) {
      start();
      return false;
    }

    vm.time = (timeSnapshot !== 0) ? timeSnapshot : countDownTime;

    vm.countDownMode = true;

    // first show the countdown for about to begin, then start
    countdownTimer = $interval(function() {
      vm.time -= 1;
      updateBg();

      if (vm.time === -1) {
        $interval.cancel(countdownTimer);
        timeSnapshot = 0;
        vm.time = 0;
        vm.countDownMode = false;
        start();
      }
    }, 1000);

  }

  function start() {
    if (sounds && !vm.pauseMode && timeSnapshot === 0) {
      sounds.bell.play({numberOfLoops: 1});
      sounds.bell.setVolume(volume);
    }

    if (vm.pauseMode) {
      vm.time = (timeSnapshot !== 0) ? timeSnapshot : pauseDuration;
    } else {
      vm.time = (timeSnapshot !== 0) ? timeSnapshot : roundDuration;
      $scope.$broadcast('roundMode');
    }

    // now we have used the snapshot (if we have used it) reset it
    timeSnapshot = 0;

    updateBg();

    timer = $interval(function() {
      tick();
    }, 1000);
  }

  function tick() {

    if (vm.pauseMode) {

      // if at the end of pause mode
      if (vm.time === 0) {
        vm.time = roundDuration;
        vm.pauseMode = false;
        $scope.$broadcast('roundMode');
        // the display var for the rounds done
        vm.rounds += 1;
        if ( (roundsDone < rounds) && sounds) {
          if (pauseDuration !== 0) {
            sounds.bell.play({numberOfLoops: 1});
            sounds.bell.setVolume(volume);
          }
        }
      } else {
        vm.time -= 1;
      }
    } else {
      // check for sounds during rounds / pauses
      if (sounds) {
        // about to go into pause mode? stop the combos
        if ((secondCounter + 3) === roundDuration) {
          $scope.$broadcast('pauseMode');
        }

        // if about to go into pause mode
        if ((secondCounter +1) === roundDuration) {
          if (roundsDone < rounds) {
            sounds.roundEnd.play({numberOfLoops: 1});
            sounds.roundEnd.setVolume(volume);
          }
        }
      }

      // if we are the end of a round
      if (secondCounter === roundDuration) {
        roundsDone += 1;

        if (roundsDone < rounds) {
          secondCounter = 0;
          vm.time = pauseDuration;
          vm.pauseMode = true;
        } else {
          stop();
        }
      } else {
        vm.time -= 1;
        secondCounter += 1;
      }
    }
    updateBg();
  }

  function pause() {
    if (!vm.running) {
      return false;
    }
    timeSnapshot = vm.time;
    clearTimersAndAllowSleep();
  }

  function stop() {
    if (!vm.running) {
      return false;
    }
    vm.time = 0;
    timeSnapshot = 0;
    vm.pauseMode = false;
    vm.countDownMode = false;
    secondCounter = 0;
    clearTimersAndAllowSleep();
    vm.hitTotal = 0;
    vm.totalTime = 0;
    updateBg();
    vm.percentDone = 100;
    if (roundsDone > 0) {
      $scope.$broadcast('finished');
    }
  }

  // things that both pause and stop do
  function clearTimersAndAllowSleep() {
    if (window.plugins) {
      window.plugins.insomnia.allowSleepAgain();
    }
    $interval.cancel(timer);
    $interval.cancel(countdownTimer);
    vm.running = false;
    $scope.$broadcast('pauseMode');
  }

  // showing the action sheet and sharing the results
  function share() {
    // send the save snapshot to the share service as it has all we need already
    shareService.share(saveSnapShot).then(function() {
      // If already saved, edit with saved else mark as saved
      saveSnapShot.shared = true;
      if (vm.saved) {
        // save again
        workoutService.editOrCreate(saveSnapShot.date, saveSnapShot).then(function(res) {
          vm.shared = true;
        });
      } else {
        vm.shared = true;
      }

    });
  }

  // get seconds for rounds and breaks
  function getTotalSeconds(time) {
    var parts = time.split(':');
    return ((parseInt(parts[0]) * 60) + parseInt(parts[1]));
  }

  function initSounds() {
    // get the volume for the sounds from the service
    volume = timerSettings.getVolume() / 100;

    return {
      bell: $cordovaMedia.newMedia(soundPrefix + 'sounds/bell.mp3'),
      roundEnd: $cordovaMedia.newMedia(soundPrefix + 'sounds/round-end.wav')
    };
  }

  function updateBg() {
    // work out the percentage left based on time and round time left
    var percent = 0;

    if (vm.countDownMode) {
      percent = (vm.time * 100) / countDownTime;
      vm.percentDone = parseInt(percent.toFixed(1));
    } else {
      if(!vm.pauseMode) {
        percent = (secondCounter * 100) / roundDuration;
        // vm.percentDone = parseInt(percent.toFixed(1));
      } else {
        percent = (vm.time * 100) / pauseDuration;
        // vm.percentDone = -(parseInt(percent.toFixed(1)) - 100);
      }
      vm.percentDone = parseInt(percent.toFixed(1));
    }
  }
}
