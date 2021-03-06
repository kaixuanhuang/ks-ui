/**
 * Created by huangsihuan on 2016/10/31.
 */

export default function ksFieldDirective($mdTheming,$parse) {
    return {
        restrict: 'E',
        compile: compile,
        controller: ContainerCtrl
    };
    function compile(tElement) {
        console.log('%c$mdTheming' ,'color:red' ,$mdTheming)
        // Check for both a left & right icon
/*        var leftIcon = tElement[0].querySelector(LEFT_SELECTORS);
        var rightIcon = tElement[0].querySelector(RIGHT_SELECTORS);

        if (leftIcon) { tElement.addClass('ks-icon-left'); }
        if (rightIcon) { tElement.addClass('ks-icon-right'); }*/

        return function postLink(scope, element,attrs,ctrl) {
            $mdTheming(element);
            if(scope.label){
                var label = scope.label;
                var labelElm =  angular.element(` <label>${label}</label>`);
                ctrl.label = labelElm;
                var labelContainer = element[0].querySelector('.ks-form-label');
                labelContainer.appendChild(labelElm[0]);
               // element.prepend(labelElm);
            }
        };
    }

    function ContainerCtrl($scope, $element, $attrs, $animate) {
        var self = this;
        self.isErrorGetter = $attrs.mdIsError && $parse($attrs.mdIsError);
        self.delegateClick = function() {
            self.input.focus();
        };
        self.element = $element;
        $element.addClass('ks-field');
        self.setFocused = function(isFocused) {
            $element.toggleClass('ks-input-focused', !!isFocused);
        };
        self.setHasValue = function(hasValue) {
            $element.toggleClass('ks-input-has-value', !!hasValue);
        };
        self.setHasPlaceholder = function(hasPlaceholder) {
            $element.toggleClass('ks-input-has-placeholder', !!hasPlaceholder);
        };
        self.setInvalid = function(isInvalid) {
            if (isInvalid) {
                $animate.addClass($element, 'ks-input-invalid');
            } else {
                $animate.removeClass($element, 'ks-input-invalid');
            }
        };
        $scope.$watch(function() {
            return self.label && self.input;
        }, function(hasLabelAndInput) {
            if (hasLabelAndInput && !self.label.attr('for')) {
                self.label.attr('for', self.input.attr('id'));
            }
        });
    }
}







