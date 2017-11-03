require('./')
  .service('timerSettings', timerSettingsService);

/**
 * @ngInject
 */
function timerSettingsService($filter, log) {

  var settings;

  // Interface for the service
  return {
    getRounds: getRounds,
    setRounds: setRounds,
    getRoundDuration: getRoundDuration,
    getPauseDuration: getPauseDuration,
    setPauseDuration: setPauseDuration,
    setRoundDuration: setRoundDuration,
    getDifficulty: getDifficulty,
    setDifficulty: setDifficulty,
    getCallouts: getCallouts,
    setCallouts: setCallouts,
    getVoice: getVoice,
    setVoice: setVoice,
    getKicks: getKicks,
    setKicks: setKicks,
    getDirty: getDirty,
    setDirty: setDirty,
    getJumpingKicks: getJumpingKicks,
    setJumpingKicks: setJumpingKicks,
    getSpinningKicks: getSpinningKicks,
    setSpinningKicks: setSpinningKicks,
    getDodges: getDodges,
    setDodges: setDodges,
    getReady: getReady,
    setReady: setReady,
    saveData: saveData,
    getSeenDraggable: getSeenDraggable,
    setSeenDraggable: setSeenDraggable,
    getVolume: getVolume,
    setVolume: setVolume,
    getSeenShareMessage: getSeenShareMessage,
    setSeenShareMessage: setSeenShareMessage
  };


  // Getters
  function getRounds() {
    return getAttr('rounds', 3);
  }
  function getPauseDuration() {
    return getAttr('pauseDuration', '0:15');
  }
  function getRoundDuration() {
    return getAttr('roundDuration', '2:30');
  }
  function getCallouts() {
    return getAttr('callouts', true);
  }
  function getDifficulty() {
    return getAttr('difficulty', 50);
  }
  function getKicks() {
    return getAttr('kicks', true);
  }
  function getDirty() {
    return getAttr('dirty', false);
  }
  function getJumpingKicks() {
    return getAttr('jumpingKicks', false);
  }
  function getSpinningKicks() {
    return getAttr('spinningKicks', false);
  }
  function getDodges() {
    return getAttr('dodges', false);
  }
  function getReady() {
    return getAttr('ready', '0:10');
  }
  function getVoice() {
    return getAttr('voice', 'Clear');
  }
  function getSeenDraggable() {
    return getAttr('seenDraggable', false);
  }
  function getVolume() {
    //@TODO maybe when we get better audio files later can add this feature
    return getAttr('volume', 100);
  }
  function getSeenShareMessage() {
    return getAttr('seenShareMessage', false);
  }

  // function for the getters to make sure data that is 0 is valid
  function getAttr(name, normal) {
    var data = getData();
    data = data[name];
    return (data !== undefined) ? data : normal;
  }

  // Setters
  function setRounds(rounds) {
    setAttr('rounds', rounds);
  }
  function setPauseDuration(mins) {
    setAttr('pauseMins', mins);
  }
  function setRoundDuration(seconds) {
    setAttr('pauseSeconds', seconds);
  }
  function setCallouts(status) {
    setAttr('callouts', status);
  }
  function setDifficulty(difficulty) {
    setAttr('difficulty', difficulty);
  }
  function setKicks(kicks) {
    setAttr('kicks', kicks);
  }
  function setDirty(dirty) {
    setAttr('dirty', dirty);
  }
  function setJumpingKicks(jumpingKicks) {
    setAttr('jumpingKicks', jumpingKicks);
  }
  function setSpinningKicks(spinningKicks) {
    setAttr('spinningKicks', spinningKicks);
  }
  function setDodges(dodges) {
    setAttr('dodges', dodges);
  }
  function setReady(ready) {
    setAttr('ready', ready);
  }
  function setVoice(voice) {
    setAttr('voice', voice);
  }
  function setSeenDraggable(seen) {
    setAttr('seenDraggable', seen);
  }
  function setVolume(volume) {
    setAttr('volume', volume);
  }
  function setSeenShareMessage(seen) {
    setAttr('seenShareMessage', seen);
  }

  // used by all the setters
  function setAttr(name, value) {
    var data = getData() || {};
    data[name] = value;
    storeData(data);
  }

  function getData() {
    // if we previously got the store return last value of it
    if (settings) {
      return settings;
    }

    // else try get the data
    var data = JSON.parse(localStorage.getItem('fight-trainer'));
    if (data === null) {
      return false;
    }
    settings = data;
    return data;
  }

  function storeData(data) {
    localStorage.setItem('fight-trainer', JSON.stringify(data));
    // update settings (as there was a modification)
    settings = data;
  }

  function saveData(data) {
    // for everything supplied adjust it in the local store
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var storage = getData() || {};
        storage[key] = data[key];
        storeData(storage);
      }
    }
  }

}
