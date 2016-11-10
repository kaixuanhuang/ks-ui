/**
 * Created by huangsihuan on 2016/11/5.
 */

export default function KsButtonDirective($mdTheming, $timeout) {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template:  getTemplate,
        link: postLink
    };

    function getTemplate(element,attr){
        var btnType = (typeof attr.type === 'undefined') ? 'button' : attr.type;
        return '<button class="ks-btn" type="' + btnType + '" ng-transclude></button>';
    }
    function postLink(scope, element, attr) {
        $mdTheming(element);
        // $mdButtonInkRipple.attach(scope, element);
        if (angular.isDefined(attr.ngDisabled) ) {
            scope.$watch(attr.ngDisabled, function(isDisabled) {
                element.attr('tabindex', isDisabled ? -1 : 0);
            });
        }
        //如果按钮禁用状态将不可点击
        element.on('click', function(e){
            if (attr.disabled === true) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        });

        if (!element.hasClass('md-no-focus')) {
            // restrict focus styles to the keyboard
            scope.mouseActive = false;
            element.on('mousedown', function() {
                scope.mouseActive = true;
                $timeout(function(){
                    scope.mouseActive = false;
                }, 100);
            })
                .on('focus', function() {
                    if (scope.mouseActive === false) {
                        element.addClass('md-focused');
                    }
                })
                .on('blur', function(ev) {
                    element.removeClass('md-focused');
                });
        }

    }

}

