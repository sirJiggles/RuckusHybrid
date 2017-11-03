require('./')
  .service('workoutService', workoutService);

/**
 * @ngInject
 */
function workoutService(
  $q,
  log,
  $localForage
) {

  // Interface for the service
  return {
    get: get,
    getAll: getAll,
    editOrCreate: editOrCreate,
    remove: remove
  };

  function getAll() {
    var def = $q.defer();
    var data = [];

    $localForage.iterate(function(val, key) {
      data.push({
        key: key,
        val: val
      });
    }).then(function() {
      if (data.length === 0) {
        def.reject();
      } else {
        // sort the array by date (most recent first)
        data.sort(function(a, b) {
          var aD = new Date(a.val.date).getTime();
          var bD = new Date(b.val.date).getTime();
          return ((aD > bD) ? -1 : ((aD < bD) ? 1 : 0));
        });
        def.resolve(data);
      }
    });

    return def.promise;
  }


  function get(key) {
    var def = $q.defer();
    $localForage.getItem(key).then(function(data) {
      def.resolve(data);
    }, function(err) {
      def.reject(err);
    });
    return def.promise;
  }


  function editOrCreate(key, value) {
    var def = $q.defer();
    $localForage.setItem(key, value).then(function(data) {
      def.resolve(data);
    }, function(err) {
      def.reject(err);
    });
    return def.promise;
  }

  function remove(key) {
    var def = $q.defer();
    $localForage.removeItem(key).then(function(data) {
      def.resolve(data);
    });
    return def.promise;
  }

}
