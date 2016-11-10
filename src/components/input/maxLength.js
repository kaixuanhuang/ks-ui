/**
 * Created by huangsihuan on 2016/10/31.
 */
function mdMaxlengthDirective($animate, $mdUtil) {
    return {
        restrict: 'A',
        require: ['ngModel', '^mdInputContainer'],
        link: postLink
    };

    function postLink(scope, element, attr, ctrls) {
        var maxlength;
        var ngModelCtrl = ctrls[0];
        var containerCtrl = ctrls[1];
        var charCountEl, errorsSpacer;

        // Wait until the next tick to ensure that the input has setup the errors spacer where we will
        // append our counter
        $mdUtil.nextTick(function() {
            errorsSpacer = angular.element(containerCtrl.element[0].querySelector('.md-errors-spacer'));
            charCountEl = angular.element('<div class="md-char-counter">');

            // Append our character counter inside the errors spacer
            errorsSpacer.append(charCountEl);

            // Stop model from trimming. This makes it so whitespace
            // over the maxlength still counts as invalid.
            attr.$set('ngTrim', 'false');

            scope.$watch(attr.mdMaxlength, function(value) {
                maxlength = value;
                if (angular.isNumber(value) && value > 0) {
                    if (!charCountEl.parent().length) {
                        $animate.enter(charCountEl, errorsSpacer);
                    }
                    renderCharCount();
                } else {
                    $animate.leave(charCountEl);
                }
            });

            ngModelCtrl.$validators['md-maxlength'] = function(modelValue, viewValue) {
                if (!angular.isNumber(maxlength) || maxlength < 0) {
                    return true;
                }

                // We always update the char count, when the modelValue has changed.
                // Using the $validators for triggering the update works very well.
                renderCharCount();

                return ( modelValue || element.val() || viewValue || '' ).length <= maxlength;
            };
        });

        function renderCharCount(value) {
            // If we have not been appended to the body yet; do not render
            if (!charCountEl.parent) {
                return value;
            }

            // Force the value into a string since it may be a number,
            // which does not have a length property.
            charCountEl.text(String(element.val() || value || '').length + ' / ' + maxlength);
            return value;
        }
    }
}