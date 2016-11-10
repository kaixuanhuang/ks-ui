/**
 * Created by huangsihuan on 2016/10/31.
 */
function mdSelectOnFocusDirective($timeout) {

    return {
        restrict: 'A',
        link: postLink
    };

    function postLink(scope, element, attr) {
        if (element[0].nodeName !== 'INPUT' && element[0].nodeName !== "TEXTAREA") return;

        var preventMouseUp = false;

        element
            .on('focus', onFocus)
            .on('mouseup', onMouseUp);

        scope.$on('$destroy', function() {
            element
                .off('focus', onFocus)
                .off('mouseup', onMouseUp);
        });

        function onFocus() {
            preventMouseUp = true;

            $timeout(function() {
                // Use HTMLInputElement#select to fix firefox select issues.
                // The debounce is here for Edge's sake, otherwise the selection doesn't work.
                element[0].select();
                preventMouseUp = false;
            }, 1, false);
        }

        function onMouseUp(event) {
            if (preventMouseUp) {
                event.preventDefault();
            }
        }
    }
}
