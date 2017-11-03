require('./')
  .controller('HelpCtrl', HelpCtrl);

/**
 * @ngInject
 */
function HelpCtrl(log, $timeout, $scope) {

  var vm = this,
      activeItem = null;

  vm.showItem = showItem;
  vm.isActive = isActive;
  vm.videoUrl = videoUrl;
  vm.loadedVideo = loadedVideo;
  vm.loaded = false;

  // This is all of the videos for this view
  vm.videos = [
    {
      name: 'How to use',
      loaded: false,
      id: 'pwj1nrsXqWk',
      descr: 'As seen in the video, wait for the combos to be called out and try to keep up! You can adjust the difficulty and type of hits in the settings screen.',
      more: 'Some moves are called out that can be done in multiple ways. As an example a hook could be a hook to the body or head, left or right. It is up to you how you do this as it depends on what stance you are in and your position etc.'
    },
    {
      name: 'Running background music',
      loaded: false,
      id: 'Z0CChic3qoU',
      descr: 'To run music in the background, start the music app you want to use, find the music you would like to play, don\'t press play yet! Open up Ruckus, set a nice preparation time and start Ruckus. Now go back to your music app, start the music (click play), now go back to Ruckus and the prep timer should still be running and still give you enough time to get ready.',
      more: 'Sometimes you may not have to go through all these hoops but this was guarantees that the music will play alongside  your music playing app'
    },
    {
      name: 'Sharing workouts',
      loaded: false,
      id: 'qwIudEH9_G8',
      descr: 'Workouts can be shared directly after they have been completed or from the workouts screen. Click the share icon after a workout and select the share method. If sharing on facebook you need to paste the content of the clipboard in the message box. This is done by holding down tap and selecting paste.',
      more: 'Workouts that you did not share right away can be shared from the workouts screen. Slide the workout name to the left, click the share icon and again, select the share method as before.'
    },
    {
      name: 'Managing workouts',
      loaded: false,
      id: '0hFM4dQDKhs',
      descr: 'After completing a workout / stopping a workout, click the save or \'floppy disk\' icon. This will turn blue indicating that the workout has been saved.',
      more: 'After you have saved a workout you can remove it by sliding the name of the workout to the left and clicking the \'x\' icon. You will then be asked to confirm the action, click confirm to remove the workout.'
    },
    {
      name: 'Energy Points',
      loaded: true,
      descr: 'Points or “Energy points” are a metric used to allow you to gauge how difficult the workout was. The more difficult the move called out the higher the energy point. As an example a jumping kick is 1 points while a jab is only 0.1, Points are not to be confused with calories as calories depend on your weight, age and sex. However energy points are more of an accurate difficulty metric as they take into account the energy required for each move and not just a figure for “active activity” over a set duration.'
    },
    {
      name: 'Jab',
      loaded: false,
      id: 'iQo3bUw9o4U',
      descr: 'A Jab is a lead hand punch. If you are in left stance your jab is a punch with your left hand. A jab can be a strike to the head or body.'
    },
    {
      name: 'Cross',
      loaded: false,
      id: 'P2ZWYT0epTc',
      descr: 'Cross is a rear hand punch. As an example if you are in left stance your cross will be a right hand punch. A cross, when called can be performed to the head or body.'
    },
    {
      name: 'Hook',
      loaded: false,
      id: 'nRkMlBSAvyE',
      descr: 'Hook is a punch that comes from the sides. Can be left or right and applied to the body or head.'
    },
    {
      name: 'Round Kick',
      loaded: false,
      id: 'QLrQ9-gR9Us',
      descr: 'A round kick is a kick that comes from around. It can be performed by the front or rear leg and can be a low or high kick. The trick with a round kick is all in the hips!'
    },
    {
      name: 'Push kick',
      loaded: false,
      id: 'KjgbTi67jM8',
      descr: 'A push kick or sometimes called a "teep" kick is performed by bringing the leg directly up in front of you and pushing your opponent away from you. Can be the lead or rear leg.'
    },
    {
      name: 'Side kick',
      loaded: false,
      id: 'j2HMD61XGuo',
      descr: 'Side kicks can be performed by turning your body side on to your objective lifting the lead (front) leg horizontally, bending it bringing the knee towards your chest and pushing out.'
    },
    {
      name: 'Elbow',
      loaded: false,
      id: 'WdDpujM0_cY',
      descr: 'Elbows can be rear or lead, usually always to the head and you strike with the bottom section of the elbow.'
    },
    {
      name: 'Shin Kick',
      loaded: false,
      id: 'jx6GWLOe4z8',
      descr: 'A shin kick is a strike with the skin on the leg. Can be either rear or lead.'
    },
    {
      name: 'Spinning Back Fist',
      loaded: false,
      id: 'UW4sz8Kja4I',
      descr: 'Spinning back fists are when you turn your body full circle (the spin). Then, as you come out of the spin you release the arm and strike the bag with the back of the hand.'
    },
    {
      name: 'Jumping front kick',
      loaded: false,
      id: '5ufo9oShaRg',
      descr: 'When doing the jumping front kick lift the leg you do NOT want to strike with first. Once this is in the air spring of the leg that is on the floor while bringing the previously raised leg down. While the leg is coming up extend it and push towards the target focusing on moving your hips forwards as you strike. Try to keep your guard up'
    },
    {
      name: 'Jumping round kick',
      loaded: false,
      id: 'E23L2FatVEQ',
      descr: 'Spring up first, directly up then once in the air focus on twisting the hips to bring the power over. Another tip is to, try to move towards to bag diagonally as you strike bringing with you the force of your body weight. Try to strike with the top side of the foot. Try to keep your guard up'
    },
    {
      name: 'Jumping side kick',
      loaded: false,
      id: 'xLNefBykzDo',
      descr: 'Jump towards your target with your leg you intend to strike with extended. You can also jump directly up and extend the leg if there is no room or your opponent is attacking. Try to keep your guard up'
    },
    {
      name: 'Jumping spinning side kick',
      loaded: false,
      id: 'scn6-W2lzns',
      descr: 'This is not technically included but you can do it when a spinning side kick is called if you like. Jump directly up, twist for the spin but look over your shoulder before striking. You need to be able to see what you are hitting. This is a hard habit to get used to but worth it. And try to maintain the guard.'
    },
    {
      name: 'Spinning hook kick',
      loaded: false,
      id: 'uKVJM8ouCwc',
      descr: 'Try to flick your body to give you faster momentum on this move. Personally I tend to bend over a bit but some people prefer a more upright stance for this. Twist, look over the shoulder and extend the leg for the hook kick after seeing the target. Try to strike with the heel and maintain a good guard. Which is hard for this one.'
    },
    {
      name: 'Spinning side kick',
      loaded: false,
      id: '_UaB0mcCqyA',
      descr: 'As with the jumping version of this kick. Keep up the guard. Jump up then twist. Look over the shoulder, spot your target then strike and try to keep the hands up. This move is underestimated in power and range. Try to get close to the bag until it is uncomfortable. This is how you get someone in the stomach and wind them, they are too close to see the leg coming :D'
    }
  ];

  function showItem(video) {
    activeItem = video;
  }

  function isActive(item) {
    return (activeItem === item);
  }

  function videoUrl(id) {
    return 'https://www.youtube.com/embed/'+ id + '?loop=1&playlist= ' + id;
  }

  function loadedVideo(index) {
    vm.videos[index].loaded = true;
    // update the scope using angular hack
    $timeout(function() {
      $scope.$apply();
    }, 1);
  }

}
