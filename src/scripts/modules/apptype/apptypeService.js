require('./')
  .service('apptype', apptypeService);

/**
 * @ngInject
 */
function apptypeService() {

  // Interface for the service
  return {
    pro: true
  };

}
