require('./')
  .service('utils', utilsService);

/**
 * @ngInject
 */
function utilsService() {

  // Interface for the service
  return {
    randomBetween: randomBetween
  };

  function randomBetween(from, to) {
    return Math.floor(Math.random() * to) + from;
  }
}
