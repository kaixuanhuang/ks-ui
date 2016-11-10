
export default  function KsWhiteframeDirective($log) {
  var DISABLE_DP = -1;
  var MIN_DP = 1;
  var MAX_DP = 24;
  var DEFAULT_DP = 4;

  return {
    link: postLink
  };

  function postLink(scope, element, attr) {
    var oldClass = '';

    attr.$observe('whiteframe', function(elevation) {
      elevation = parseInt(elevation, 10) || DEFAULT_DP;
      if (elevation != DISABLE_DP && (elevation > MAX_DP || elevation < MIN_DP)) {
        $log.warn('whiteframe attribute value is invalid. It should be a number between ' + MIN_DP + ' and ' + MAX_DP, element[0]);
        elevation = DEFAULT_DP;
      }
      var newClass = elevation == DISABLE_DP ? '' : 'md-whiteframe-' + elevation + 'dp';
      attr.$updateClass(newClass, oldClass);
      oldClass = newClass;
    });
  }
}

