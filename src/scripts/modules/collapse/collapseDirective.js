require('./')
  .directive('collapse', collapseDirective);

/**
 * @ngInject
 */
function collapseDirective($timeout) {

  return {
    restrict: 'A',
    link: link
  };

  // Linking function
  function link($scope, ngElement, attributes) {
    var element = ngElement[0];

    // set the height as a data attr so we can use it again later
    $timeout(function() {
      // element.dataset.heightOld = angular.element(element).prop('offsetHeight');

      $scope.$watch(attributes.collapse, function (collapse) {
        // var newHeight = !collapse ? 0 : element.dataset.heightOld;
        // element.style.height = newHeight + 'px';
        ngElement.toggleClass('collapsed', collapse);
      });
    }, 1);


  }
}
