require('./')
  .service('log', logService);

/**
 * @ngInject
 */
function logService() {

  // Interface for the service
  return {
    log: log
  };

  function log(msg) {
    console.log('==========================================');
    console.log(msg);
    console.log('==========================================');
  }
}
