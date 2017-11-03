require('./')
  .factory('timeFilter', timeFilter);

/**
 * @ngInject
 */
function timeFilter() {

  return function(secs) {
    return new Date(1970, 0, 1, 0).setSeconds(secs);
  };
}
