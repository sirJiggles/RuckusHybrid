require('./')
  .controller('SettingsCtrl', SettingsCtrl);

/**
 * @ngInject
 */
function SettingsCtrl(
  timerSettings,
  $ionicPopup,
  log,
  apptype,
  $cordovaInAppBrowser,
  hitCallerService
) {

  var vm = this;
  vm.buttonText = 'Save';
  vm.noChanges = true;

  vm.rounds = timerSettings.getRounds();
  vm.callouts = timerSettings.getCallouts();
  vm.difficulty = timerSettings.getDifficulty();
  vm.roundDuration = timerSettings.getRoundDuration();
  vm.pauseDuration = timerSettings.getPauseDuration();
  vm.volume = timerSettings.getVolume();
  vm.kicks = timerSettings.getKicks();
  vm.dirty = timerSettings.getDirty();
  vm.spinningKicks = timerSettings.getSpinningKicks();
  vm.jumpingKicks = timerSettings.getJumpingKicks();
  vm.dodges = timerSettings.getDodges();
  vm.ready = timerSettings.getReady();
  vm.voice = timerSettings.getVoice();
  vm.volumeSample = volumeSample;
  vm.rate = rate;
  vm.pro = apptype.pro;
  vm.goPro = goPro;
  vm.proChange = proChange;

  // arrays for the selects
  vm.possibleRounds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  vm.roundTimes = [
    '0:10',
    '0:15',
    '0:20',
    '0:30',
    '1:00',
    '1:30',
    '2:00',
    '2:30',
    '3:00',
    '3:30',
    '4:00',
    '4:30',
    '5:00',
    '5:30',
    '6:00'
  ];
  vm.pauseTimes = [
    '0:00',
    '0:10',
    '0:15',
    '0:20',
    '0:25',
    '0:30',
    '0:35',
    '0:40',
    '0:45',
    '0:50',
    '0:55',
    '1:00'
  ];
  vm.readyTimes = [
    '0:00',
    '0:10',
    '0:20',
    '0:30',
    '0:40',
    '0:50',
    '1:00'
  ];
  vm.voices = [
    'Female',
    'Husky',
    'Clear',
    'Braunschweiger'
  ];

  ionic.Platform.ready(function() {
    hitCallerService.init();
  });

  // text for the help tooltips
  var tooltips = {
    preptime: {
      title: 'Preparation time',
      text: 'How long to wait at the start of the first round before starting, for example to put on gloves.'
    },
    pausetime: {
      title: 'Pause time',
      text: 'How long to pause in between each round, can also set to 0 for stretching and warm ups etc.'
    },
    callouts: {
      title: 'Call out hits',
      text: 'If the timer should call out hits like "Jab" while it is running in "round mode".'
    },
    dirtys: {
      title: 'Dirty moves',
      text: 'Will also call out the moves elbow, shin kick and spinning back fist.'
    },
    kicks: {
      title: 'Enable kicks',
      text: 'Will also call out kicks: push kick, round kick and side kick.'
    },
    spinningKicks: {
      title: 'Spinning kicks',
      text: 'Will also call out kicks: spinning side kick and spinning hook kick.'
    },
    jumpingKicks: {
      title: 'Jumping kicks',
      text: 'Will also call out: jumping front, round and side kick.'
    },
    dodges: {
      title: 'Dodges and covers',
      text: 'Will also call out defensive and evasive moves: duck, cover and slip.'
    },
    difficulty: {
      title: 'Difficulty',
      text: 'Only active if call outs on, sets the amount of time to recover between each combo being called out.'
    }
  };

  // interaction functions
  vm.changes = changes;
  vm.showTooltip = showTooltip;

  // Updtaing values in the store
  function save() {
    timerSettings.saveData({
      rounds: vm.rounds,
      roundDuration: vm.roundDuration,
      pauseDuration: vm.pauseDuration,
      callouts: vm.callouts,
      difficulty: vm.difficulty,
      kicks: vm.kicks,
      dirty: vm.dirty,
      ready: vm.ready,
      spinningKicks: vm.spinningKicks,
      jumpingKicks: vm.jumpingKicks,
      dodges: vm.dodges,
      voice: vm.voice,
      volume: vm.volume
    });
    hitCallerService.setVolume();
  }

  function changes() {
    save();
  }

  function proChange(event) {
    if (!vm.pro) {
      $ionicPopup.alert({
       title: 'Pro Feature',
       template: 'This feature is only changeable in Ruckus Pro'
      });
      if (event === 'voice') {
        vm.voice = 'Clear';
      } else {
        vm.dirty = false;
        event.stopPropagation();
        event.preventDefault();
      }
      return false;
    }
    save();
  }

  function showTooltip(id) {
    $ionicPopup.alert({
     title: tooltips[id].title,
     template: tooltips[id].text
    });
  }

  function rate() {
    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
      var url = (ionic.Platform.isIOS())
        ? (vm.pro ? 'itms-apps://itunes.apple.com/us/app/ruckus-trainer/id1067631847?mt=8&uo=4' : 'itms-apps://itunes.apple.com/us/app/ruckus-light-fight-trainer/id1074085091?mt=8&uo=4')
        : (vm.pro ? 'https://market.android.com/details?id=garethfuller.ruckus' : 'https://market.android.com/details?id=garethfuller.ruckus.lite');
      $cordovaInAppBrowser.open(url, '_system', '');
    }
  }

  function goPro() {
    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
      var url = (ionic.Platform.isIOS()) ? 'itms-apps://itunes.apple.com/us/app/ruckus-trainer/id1067631847?mt=8&uo=4' : 'https://market.android.com/details?id=garethfuller.ruckus';
      $cordovaInAppBrowser.open(url, '_system', '');
    }
  }

  function volumeSample() {
    hitCallerService.runCombo();
  }

}
