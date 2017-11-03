require('./')
  .service('hitCallerService', hitCallerService);

/**
 * @ngInject
 */
function hitCallerService(
  $cordovaMedia,
  $timeout,
  timerSettings,
  $q,
  $rootScope,
  log,
  utils
) {

  var playSounds = false,
      soundPrefix,
      sounds = [],
      hitStore = {
        total: 0,
        energyPoints: 0
      },
      volume,
      lastHit = false,
      combosAvailable = [];

  // moves by index used for the combos
  var moves = [
    'jab',              // 1
    'cross',            // 2
    'hook',             // 3
    'sideKick',         // 4
    'roundKick',        // 5
    'pushKick',         // 6
    'elbow',            // 7
    'shinKick',         // 8
    'spinningBackFist', // 9
    'jumpingRoundKick', // 10
    'jumpingFrontKick', // 11
    'jumpingSideKick',  // 12
    'spinningSideKick', // 13
    'spinningHookKick', // 14
    'duck',             // 15
    'slip',             // 16
    'cover'             // 17
  ];

  var combos = {
    'punches': [
      [1,2,3],
      [1,1,3],
      [1],
      [1,2],
      [1,3,1],
      [2,3],
      [1,3,3],
      [2,1,3],
      [2,3,3],
      [2,3,3,1],
      [1,2,3,3],
      [1,1,3],
      [3,3,1,2],
      [1,3,1,2],
      [1,2,3],
      [1,1,1],
      [3,2,1,2],
      [2,1,2],
      [1,1,2,1]
    ],
    // push 6, round 5, side 4
    'kicks': [
      [6,1,2],
      [6,5],
      [5,4],
      [4],
      [5,3],
      [5,1],
      [1,1,5],
      [5,5],
      [4,1,2],
      [1,2,3,5],
      [1,2,3,4]
    ],
    // elbow 7 shin 8 spf 9
    'dirty': [
      [1,7],
      [7,7],
      [1,1,7],
      [1,1,7],
      [8,3],
      [1,8,3],
      [1,8],
      [1,2,8],
      [3,9],
      [1,2,3,9],
      [1,3,9],
      [2,3,9]
    ],
    // lets not go crazy these should be a one move wonder
    'jumpingKicks': [
      [10],
      [11],
      [12]
    ],
    // side: 13 hook: 14
    // push 6, round 5, side 4
    'spinningKicks': [
      [3,13],
      [13],
      [14],
      [1,2,3,14],
      [1,2,3,13],
      [13,1,2],
      [4,13],
      [6,13],
      [5,5,13],
      [6,14]
    ],

    'spinningKicksAndDodges': [
      [16,3,13],
      [17,1,13]
    ],
    // duck: 15, slip: 16, cover:17
    'dodges': [
      [1,2,15],
      [15],
      [1,16,3],
      [17,17],
      [1,2,17],
      [17,2,3],
      [3,15,3],
      [1,15,3],
      [16,3],
      [16,16],
      [1,2,16],
      [17,15,3]
    ],
    // push 6, round 5, side 4
    // elbow 7 shin 8 spf 9
    'kicksAndDirty': [
      [6,7,3],
      [7,3,5],
      [6,8],
      [5,3,7],
      [6,7]
    ]
  };

  // Interface for the service
  return {
    runCombo: runCombo,
    stop: stop,
    getHits: getHits,
    resetHits: resetHits,
    init: init,
    setVolume: setVolume,
    getSounds: getSounds
  };

  function setVolume() {
    volume = timerSettings.getVolume() / 100;
  }

  // start of the service
  function init() {
    setVolume();

    // as now shared on settings this needs to be called on init
    resetHits();

    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
      var soundPathStart = timerSettings.getVoice() + '/';
      soundPrefix = ionic.Platform.isAndroid() ? '/android_asset/www/sounds/' + soundPathStart : 'sounds/' + soundPathStart;
      playSounds = true;
      initSounds();
    }

    // we can always have the punches
    combosAvailable = combos.punches;
    // double the chnaces of punches, its too cray cray
    combosAvailable = combosAvailable.concat(combos.punches);

    // work out which settings we have
    var kicksEnabled = timerSettings.getKicks();
    var dirtyEnabled = timerSettings.getDirty();
    var jumpingKicksEnabled = timerSettings.getJumpingKicks();
    var spinningKicksEnabled = timerSettings.getSpinningKicks();
    var dodgesEnabled = timerSettings.getDodges();

    // add combos to the big array that we can use
    if (kicksEnabled) {
      combosAvailable = combosAvailable.concat(combos.kicks);
    }
    if (dirtyEnabled) {
      combosAvailable = combosAvailable.concat(combos.dirty);
    }
    if (dirtyEnabled && kicksEnabled) {
      combosAvailable = combosAvailable.concat(combos.kicksAndDirty);
    }
    if (kicksEnabled && jumpingKicksEnabled) {
      combosAvailable = combosAvailable.concat(combos.jumpingKicks);
    }
    if (kicksEnabled && spinningKicksEnabled) {
      combosAvailable = combosAvailable.concat(combos.spinningKicks);
    }
    if (dodgesEnabled) {
      combosAvailable = combosAvailable.concat(combos.dodges);
    }
    if (dodgesEnabled && spinningKicksEnabled && kicksEnabled) {
      combosAvailable = combosAvailable.concat(combos.spinningKicksAndDodges);
    }

  }

  function getSounds() {
    if (!playSounds) {
      return;
    }
    return sounds;
  }

  function resetHits() {
    hitStore = {
      total: 0,
      energyPoints: 0
    };
  }

  function getHits() {
    return hitStore;
  }

  // @TODO remove this on service replace
  function stop() {
  }

  function runCombo() {
    var defer = new $q.defer();

    // get a random index using the length of the combo array and choose our
    // new combo
    var combo = combosAvailable[utils.randomBetween(0, combosAvailable.length)];

    // start of the chain
    callHit(combo, 0, defer);

    return defer.promise;
  }

  function setHitData(move) {
    // increase the amount of hits total
    hitStore.total += 1;
    // increase the energy points depending on the move
    var points = 0;
    switch(move) {
      case 'slip':
      case 'cover':
        points = 0.1;
        break;
      case 'jab':
      case 'elbow':
        points = 0.2;
				break;
      case 'cross':
        points = 0.3;
				break;
      case 'hook':
      case 'duck':
        points = 0.4;
				break;
      case 'sideKick':
      case 'roundKick':
      case 'pushKick':
        points = 0.6;
				break;
      case 'shinKick':
      case 'spinningBackFist':
        points = 0.5;
				break;
      case 'jumpingRoundKick':
      case 'jumpingFrontKick':
      case 'jumpingSideKick':
        points = 1;
				break;
      case 'spinningSideKick':
      case 'spinningHookKick':
        points = 0.8;
				break;
    }
    hitStore.energyPoints += points;
  }

  function callHit(combo, index, defer) {
    var move = moves[combo[index] - 1];
    // increase the hit data
    setHitData(move);
    var sound;

    if (ionic.Platform.isAndroid()) {
      sound = new Media(soundPrefix + move + '.mp3');
    } else {
      sound = sounds[move];
    }

    if (ionic.Platform.isIOS() && lastHit) {
      lastHit.stop();
    }

    // clean up and re-fetch audio files because of memory issues on android
    if (ionic.Platform.isAndroid() && lastHit) {
      lastHit.release();
    }
    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
      sound.play();
    }

    // for cleaing up
    lastHit = sound;

    // cant get duration until the file is playing,
    // the callback crap in ngCordova is bound by a timer so that sucks
    // in the end we need a timeout for when we have duration, then another
    // for when the file is done once we know the duration
    $timeout(function() {
      var duration;
      if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
        duration = sound._duration.toFixed(1) * 1000;
      } else {
        duration = 1300;
      }
      $timeout(function() {
        index += 1;
        if (index < combo.length) {
          callHit(combo, index, defer);
        } else {
          defer.resolve();
        }
      }, duration);
    }, 100);

    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
      sound.setVolume(volume + 0.3);
    }
  }

  // add all the sounds to the sounds array, rather than calling each time
  function initSounds() {
    if (ionic.Platform.isIOS()) {
      moves.forEach(function(move) {
        sounds[move] = new Media(soundPrefix + move + '.mp3');
      });
    }
  }
}
