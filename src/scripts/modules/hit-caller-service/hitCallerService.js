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

  var sounds,
      soundPrefix,
      soundStore = {},
      difficulty,
      combo = [],
      hitStore = {
        total: 0
      },
      thirdNameCheck = '',
      hitCallTimer,
      firstHitGlobal,
      kicksEnabled,
      volume,
      dirtyEnabled,
      nextHit = {},
      previousHit = {},
      percentShiftFactor = 30,
      kicks = ['sideKick', 'roundKick', 'pushKick'],
      dirtys = ['elbow', 'shinKick', 'spinningBackFist'];

  // array of hits
  var hits = [
    {
      name: 'jab',
      duration: 400,
      timeAdded: 0,
      first: 100,
      hits: {
        cross: 99,
        jab: 85,
        hook: 80,
        elbow: 70,
        pushKick: 65,
        roundKick: 65
      }
    },
    {
      name: 'cross',
      duration: 500,
      timeAdded: 0,
      first: 85,
      hits: {
        hook: 99,
        jab: 90,
        elbow: 80,
        shinKick: 80,
        pushKick: 70,
        roundKick: 70
      }
    },
    {
      name: 'hook',
      duration: 400,
      timeAdded: 0,
      first: 70,
      hits: {
        hook: 99,
        cross: 90,
        jab: 85,
        spinningBackFist: 85,
        elbow: 80,
        shinKick: 80,
        roundKick: 80
      }
    },
    {
      name: 'roundKick',
      duration: 800,
      timeAdded: 500,
      first: 85,
      hits: {
        jab: 99,
        roundKick: 90,
        pushKick: 80,
        cross: 75,
        hook: 75,
        elbow: 70,
        shinKick: 65
      }
    },
    {
      name: 'pushKick',
      duration: 600,
      timeAdded: 250,
      first: 90,
      hits: {
        jab: 99,
        cross: 90,
        hook: 80,
        pushKick: 75,
        roundKick: 70,
        elbow: 65,
        shinKick: 65
      }
    },
    {
      name: 'sideKick',
      duration: 850,
      timeAdded: 1500,
      first: 75,
      hits: {
        jab: 99,
        roundKick: 90
      }
    },
    {
      name: 'elbow',
      duration: 500,
      timeAdded: 0,
      first: 70,
      hits: {
        elbow: 99,
        shinKick: 90,
        hook: 80
      }
    },
    {
      name: 'shinKick',
      duration: 730,
      timeAdded: 200,
      first: 75,
      hits: {
        hook: 99,
        elbow: 90,
        shinKick: 80
      }
    },
    {
      name: 'spinningBackFist',
      duration: 1150,
      timeAdded: 500,
      first: 60,
      hits: {
        hook: 99
      }
    }
  ];

  // Interface for the service
  return {
    runCombo: runCombo,
    stop: stop,
    getHits: getHits,
    resetHits: resetHits,
    init: init,
    getSounds: getSounds
  };

  // start of the service
  function init() {
    volume = timerSettings.getVolume() / 100;

    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
      var soundPathStart = timerSettings.getVoice() + '/';
      soundPrefix = ionic.Platform.isAndroid() ? '/android_asset/www/sounds/' + soundPathStart : 'sounds/' + soundPathStart;
      sounds = true;
      initSounds();
    }

    kicksEnabled = timerSettings.getKicks();
    dirtyEnabled = timerSettings.getDirty();
    difficulty = timerSettings.getDifficulty();
  }

  function getSounds() {
    if (!sounds) {
      return;
    }
    return soundStore;
  }

  function resetHits() {
    hitStore = {
      total: 0
    };
  }

  function getHits() {
    return hitStore;
  }

  function stop() {
    $timeout.cancel(hitCallTimer);
    amountCalled = 0;
    combo = [];
  }

  function runCombo() {
    var defer = new $q.defer();
    // reset everything
    amountCalled = 0;
    var max = (difficulty < 50) ? 2 : 3;
    amountHits = utils.randomBetween(2, max);
    combo = [];
    previousHit = undefined;

    callFirstHit();

    hitCallTimer = $timeout(callChainHit.bind(this, defer), firstHitGlobal.duration);

    return defer.promise;
  }

  function callFirstHit() {
    // get the first hit in the combo
    var firstHit = {
      percent: 0
    };

    hits.forEach(function(hit) {

      // check for disabled moves etc but not for double this is first move
      if (problemWithMove(hit.name, false)) {
        return;
      }

      var percent = utils.randomBetween(
                            hit.first - percentShiftFactor,
                            hit.first + percentShiftFactor
                    );
      if (percent > firstHit.percent) {
        firstHit.name = hit.name;
        firstHit.percent = percent;
        firstHitGlobal = hit;
      }
    });

    // now we have the first hit call her out
    callOutHit(firstHitGlobal);
  }

  function callChainHit(defer) {
    nextHit.percent = 0;

    // the last hit is either the first one, or the last one
    previousHit = previousHit || firstHitGlobal;

    // clean up old audio (iOS issues)
    if (sounds) {
      if (ionic.Platform.isIOS()) {
        soundStore[previousHit.name].stop();
      }
    }

    var keys = Object.keys(previousHit.hits);
    // go through all the hits we can hit next
    keys.forEach(function(key) {

      if (problemWithMove(key, true)) {
        return false;
      }

      var percent = utils.randomBetween(
                      (previousHit.hits[key] - percentShiftFactor),
                      (previousHit.hits[key] + percentShiftFactor)
                    );
      if (percent > nextHit.percent) {
        nextHit.name = key;
        nextHit.percent = percent;
        hits.forEach(function(hit) {
          if (hit.name === key) {
            previousHit = hit;
            return;
          }
        });
      }
    });

    callOutHit(previousHit);

    // if that was the last one, lets get out of here
    if (amountCalled === amountHits) {
      $timeout.cancel(hitCallTimer);
      thirdNameCheck = '';
      defer.resolve(combo);
      return false;
    }

    hitCallTimer = $timeout(callChainHit.bind(this, defer), previousHit.duration);
  }

  function problemWithMove(hitName, checkTripple) {

    // if we are on a dirty move
    if (dirtys.indexOf(hitName) !== -1) {
      if (!dirtyEnabled) {
        return true;
      }
      // only if it is last / first move
      if (((amountCalled + 1) !== amountHits) && (amountCalled !== 0)) {
        return true;
      }
    }

    // if we are on a kick
    if ((kicks.indexOf(hitName) !== -1)) {
      if (!kicksEnabled) {
        return true;
      }
      // only if it is last / first move
      if (((amountCalled + 1) !== amountHits) && (amountCalled !== 0)) {
        return true;
      }
    }

    // no errors if this far and not checking for triples
    if (!checkTripple) {
      return false;
    }

    if (thirdNameCheck === hitName) {
      thirdNameCheck = '';
      return true;
    }
    // stop more than three same move, its just silly
    if (hitName === previousHit.name) {
      // set what to compare for third time
      thirdNameCheck = hitName;
    }

    return false;

  }

  // actually call the sound out, add on any needed time in the main directive
  // and update the totals
  function callOutHit(hit) {
    // add any duration we may need
    $rootScope.$broadcast('addTimeOn', hit.timeAdded);

    // incerase the time
    amountCalled += 1;

    // add the hit to the store
    hitStore[hit.name] += 1;
    hitStore.total += 1;

    if (sounds) {
      soundStore[hit.name].play({numberOfLoops: 1});
      // set the volume of the hits
      soundStore[hit.name].setVolume(volume);
    }
  }

  // add all the sounds to the sounds array, rather than calling each time
  function initSounds() {
    hits.forEach(function(hit) {
      soundStore[hit.name] = $cordovaMedia.newMedia(soundPrefix + hit.name + '.mp3');
    });
  }
}
