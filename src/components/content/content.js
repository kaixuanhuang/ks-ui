
//非常适合作为滚动内容的容器
//broadcast $ksContentLoaded

export default function ksContentDirective($mdTheming) {
  return {
    restrict: 'E',
    controller: ['$scope', '$element', ContentController],
    link: function(scope, element) {
      element.addClass('_md');     // private md component indicator for styling
      $mdTheming(element);
      scope.$broadcast('$ksContentLoaded', element);
      iosScrollFix(element[0]);
    }
  };

  function ContentController($scope, $element) {
    this.$scope = $scope;
    this.$element = $element;
  }
}

function iosScrollFix(node) {
  // IOS FIX:
  // If we scroll where there is no more room for the webview to scroll,
  // by default the webview itself will scroll up and down, this looks really
  // bad.  So if we are scrolling to the very top or bottom, add/subtract one
  angular.element(node).on('$md.pressdown', function(ev) {
    // Only touch events
    if (ev.pointer.type !== 't') return;
    // Don't let a child content's touchstart ruin it for us.
    if (ev.$materialScrollFixed) return;
    ev.$materialScrollFixed = true;

    if (node.scrollTop === 0) {
      node.scrollTop = 1;
    } else if (node.scrollHeight === node.scrollTop + node.offsetHeight) {
      node.scrollTop -= 1;
    }
  });
}
