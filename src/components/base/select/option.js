/**
 * Created by huangsihuan on 2016/11/13.
 */

//如果不能选  则 disabled

function OptionDirective($mdButtonInkRipple, $mdUtil) {

    return {
        restrict: 'E',
        require: ['ksOption', '^^selectItem'],
        controller: OptionController,
        compile: compile
    };

    function compile(tElment, tAttr) {
        //手动 穿插  避免 ng-transclude生成多余的span
        element.append(angular.element('<div class="md-text">').append(tElment.contents()));

        element.attr('tabindex', attr.tabindex || '0');

        //如果没设置value
        if (!hasDefinedValue(attr)) {
            element.attr('md-option-empty', '');
        }
        return postLink;
    }

    function hasDefinedValue(attr) {
        var value = attr.value;
        var ngValue = attr.ngValue;
        return value || ngValue;
    }

    function postLink(scope, element, attr, ctrls) {
        var optionCtrl = ctrls[0];
        var selectCtrl = ctrls[1];

        if (selectCtrl.isMultiple) {
            element.addClass('md-checkbox-enabled');
            element.prepend(CHECKBOX_SELECTION_INDICATOR.clone());
        }

        if (angular.isDefined(attr.ngValue)) {
            scope.$watch(attr.ngValue, setOptionValue);
        } else if (angular.isDefined(attr.value)) {
            setOptionValue(attr.value);
        } else {
            scope.$watch(function() {
                return element.text().trim();
            }, setOptionValue);
        }

        attr.$observe('disabled', function(disabled) {
            if (disabled) {
                element.attr('tabindex', '-1');
            } else {
                element.attr('tabindex', '0');
            }
        });

        scope.$$postDigest(function() {
            attr.$observe('selected', function(selected) {
                if (!angular.isDefined(selected)) return;
                if (typeof selected == 'string') selected = true;
                if (selected) {
                    if (!selectCtrl.isMultiple) {
                        selectCtrl.deselect(Object.keys(selectCtrl.selected)[0]);
                    }
                    selectCtrl.select(optionCtrl.hashKey, optionCtrl.value);
                } else {
                    selectCtrl.deselect(optionCtrl.hashKey);
                }
                selectCtrl.refreshViewValue();
            });
        });

        $mdButtonInkRipple.attach(scope, element);
        configureAria();

        function setOptionValue(newValue, oldValue, prevAttempt) {
            if (!selectCtrl.hashGetter) {
                if (!prevAttempt) {
                    scope.$$postDigest(function() {
                        setOptionValue(newValue, oldValue, true);
                    });
                }
                return;
            }
            var oldHashKey = selectCtrl.hashGetter(oldValue, scope);
            var newHashKey = selectCtrl.hashGetter(newValue, scope);

            optionCtrl.hashKey = newHashKey;
            optionCtrl.value = newValue;

            selectCtrl.removeOption(oldHashKey, optionCtrl);
            selectCtrl.addOption(newHashKey, optionCtrl);
        }

        scope.$on('$destroy', function() {
            selectCtrl.removeOption(optionCtrl.hashKey, optionCtrl);
        });

        function configureAria() {
            var ariaAttrs = {
                'role': 'option',
                'aria-selected': 'false'
            };

            if (!element[0].hasAttribute('id')) {
                ariaAttrs.id = 'select_option_' + $mdUtil.nextUid();
            }
            element.attr(ariaAttrs);
        }
    }

    function OptionController($element) {
        this.selected = false;
        this.setSelected = function(isSelected) {
            if (isSelected && !this.selected) {
                $element.attr({
                    'selected': 'selected',
                    'aria-selected': 'true'
                });
            } else if (!isSelected && this.selected) {
                $element.removeAttr('selected');
                $element.attr('aria-selected', 'false');
            }
            this.selected = isSelected;
        };
    }

}
