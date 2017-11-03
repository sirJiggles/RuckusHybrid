require('./')
  .controller('WorkoutsCtrl', WorkoutsCtrl);

/**
 * @ngInject
 */
function WorkoutsCtrl(
  workoutService,
  shareService,
  timerSettings,
  $ionicPopup,
  $ionicListDelegate,
  apptype,
  $cordovaInAppBrowser,
  log
) {

  var vm = this,
      activeWorkout = null;

  vm.share = share;
  vm.removeWorkout = removeWorkout;
  vm.showWorkout = showWorkout;
  vm.isActive = isActive;
  vm.checkIfSeen = checkIfSeen;
  vm.seenOptions = timerSettings.getSeenDraggable();
  vm.pro = apptype.pro;
  vm.goPro = goPro;

  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // get all the items for the list
  workoutService.getAll().then(function(data) {
    vm.workouts = data;

    // set the months for the grouping
    data.forEach(function(workout, index) {
      var date = new Date(workout.val.date);
      vm.workouts[index].month = monthNames[date.getMonth()] + ' - ' + date.getFullYear();
      // cant rely on gn repeat index anymore
      vm.workouts[index].index = index;
    });

    // draw the graph
    calculateGraph();

  }, function() {
    // do nothing workouts will be false
  });

  function checkIfSeen() {
    if (vm.seenOptions) {
      return;
    } else {
      vm.seenOptions = true;
      // save that seen in local storage
      timerSettings.setSeenDraggable(true);
    }
  }

  function share(item) {
    shareService.share(item).then(function() {
      // upadate the item to say its shared!
      item.shared = true;
      workoutService.editOrCreate(item.date, item);
      $ionicListDelegate.closeOptionButtons();
    }, function() {
      $ionicListDelegate.closeOptionButtons();
    });
  }

  function removeWorkout(key, index) {
    var confirm = $ionicPopup.confirm({
     title: 'Are you sure',
     template: 'Do you really want to remove the workout?'
    });
    confirm.then(function(remove) {
      if (remove) {
        confirmRemove(key, index);
      }
      $ionicListDelegate.closeOptionButtons();
    });
  }

  function confirmRemove(key, index) {
    workoutService.remove(key).then(function() {
      $ionicListDelegate.closeOptionButtons();
      vm.workouts.splice(index, 1);
      calculateGraph();
    }, function(err) {
      log.log('Unable to remove workout: ' + err);
    });
  }

  function calculateGraph() {

    // dont show the workouts when not pro
    if (!apptype.pro) {
      return;
    }

    var ctx = document.getElementById("lineChart");

    // get all of the hit counts
    var hitData = vm.workouts.map(function(item) {
      return item.val.hitTotal;
    }).reverse();

    // sort out the ones we want to show in the graph
    var data = hitData.slice(Math.max(hitData.length - 10, 0));
    var labels = new Array(data.length);

    // dont use angular chart JS as it does not work in Safari
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: data
        }]
      }
    });
  }

  function showWorkout(workoutIndex) {
    $ionicListDelegate.closeOptionButtons();
    activeWorkout = workoutIndex;
  }

  function isActive(workoutIndex) {
    return (activeWorkout === workoutIndex);
  }

  function goPro() {
    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
      var url = (ionic.Platform.isIOS()) ? 'itms-apps://itunes.apple.com/us/app/ruckus-trainer/id1067631847?mt=8&uo=4' : 'https://market.android.com/details?id=garethfuller.ruckus';
      $cordovaInAppBrowser.open(url, '_system', '');
    }
  }

}
