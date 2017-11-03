require('./')
  .directive('iframeOnload', iframeLoadDirective);

/**
 * @ngInject
 */
function iframeLoadDirective() {

  return {
    restrict: 'A',
    transclude: true,
    scope: {
      loadCallback: '&iframeOnload'
    },
    link: link
  };

  // Linking function
  function link(scope, element, attrs) {
    element.on('load', function(){
      return scope.loadCallback();
    });
  }
}
