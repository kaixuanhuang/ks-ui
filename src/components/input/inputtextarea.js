/**
 * Created by huangsihuan on 2016/10/31.
 */
function inputTextareaDirective($mdUtil, $window, $timeout) {
    return {
        restrict: 'E',
        require: ['^?ksField', '?ngModel', '?^form'],
        link: postLink
    };

    function postLink(scope, element, attr, ctrls) {

        var containerCtrl = ctrls[0];

        var hasNgModel = !!ctrls[1];
        var ngModelCtrl = ctrls[1] || $mdUtil.fakeNgModel();
        var parentForm = ctrls[2];
        var isReadonly = angular.isDefined(attr.readonly);
        //var mdNoAsterisk = $Util.parseAttributeBoolean(attr.mdNoAsterisk);
        var tagName = element[0].tagName.toLowerCase();


        if (!containerCtrl) return;
        if (containerCtrl.input) {
            if (containerCtrl.input[0].contains(element[0])) {
                return;
            } else {
                throw new Error("<ks-field> 只能有一个 <input>, <textarea> or <ks-select> 子元素!");
            }
        }
        containerCtrl.input = element;

        setupAttributeWatchers();

        var errorsSpacer = angular.element('<div class="ks-errors-spacer">');
        element.after(errorsSpacer);

/*        if (!containerCtrl.label) {
            $mdAria.expect(element, 'aria-label', attr.placeholder);
        }*/

        element.addClass('ks-input');
        if (!element.attr('id')) {
            //element.attr('id', 'input_' + $mdUtil.nextUid());
        }

       //如果没有ngmodel
        if (!hasNgModel) {
            inputCheckValue();
        }

        var isErrorGetter = containerCtrl.isErrorGetter || function() {
                return ngModelCtrl.$invalid && (ngModelCtrl.$touched || (parentForm && parentForm.$submitted));
            };

        scope.$watch(isErrorGetter, containerCtrl.setInvalid);

        // When the developer uses the ngValue directive for the input, we have to observe the attribute, because
        // Angular's ngValue directive is just setting the `value` attribute.
        if (attr.ngValue) {
            attr.$observe('value', inputCheckValue);
        }

        ngModelCtrl.$parsers.push(ngModelPipelineCheckValue);
        ngModelCtrl.$formatters.push(ngModelPipelineCheckValue);

        element.on('input', inputCheckValue);

        if (!isReadonly) {
            element
                .on('focus', function(ev) {
                    $mdUtil.nextTick(function() {
                        containerCtrl.setFocused(true);
                    });
                })
                .on('blur', function(ev) {
                    $mdUtil.nextTick(function() {
                        containerCtrl.setFocused(false);
                        inputCheckValue();
                    });
                });
        }

        scope.$on('$destroy', function() {
            containerCtrl.setFocused(false);
            containerCtrl.setHasValue(false);
            containerCtrl.input = null;
        });

        /** Gets run through ngModel's pipeline and set the `has-value` class on the container. */
        function ngModelPipelineCheckValue(arg) {
            containerCtrl.setHasValue(!ngModelCtrl.$isEmpty(arg));
            return arg;
        }

        //监听required
        function setupAttributeWatchers() {
            if (containerCtrl.label) {
                attr.$observe('required', function (value) {
                    containerCtrl.label.toggleClass('md-required', value);
                });
            }
        }

        function inputCheckValue() {
            // An input's value counts if its length > 0,
            // or if the input's validity state says it has bad input (eg string in a number input)
            containerCtrl.setHasValue(element.val().length > 0 || (element[0].validity || {}).badInput);
        }

        function setupTextarea() {
            var isAutogrowing = !attr.hasOwnProperty('mdNoAutogrow');

            attachResizeHandle();

            if (!isAutogrowing) return;

            // Can't check if height was or not explicity set,
            // so rows attribute will take precedence if present
            var minRows = attr.hasOwnProperty('rows') ? parseInt(attr.rows) : NaN;
            var maxRows = attr.hasOwnProperty('maxRows') ? parseInt(attr.maxRows) : NaN;
            var scopeResizeListener = scope.$on('md-resize-textarea', growTextarea);
            var lineHeight = null;
            var node = element[0];

            // This timeout is necessary, because the browser needs a little bit
            // of time to calculate the `clientHeight` and `scrollHeight`.
            $timeout(function() {
                $mdUtil.nextTick(growTextarea);
            }, 10, false);

            // We could leverage ngModel's $parsers here, however it
            // isn't reliable, because Angular trims the input by default,
            // which means that growTextarea won't fire when newlines and
            // spaces are added.
            element.on('input', growTextarea);

            // We should still use the $formatters, because they fire when
            // the value was changed from outside the textarea.
            if (hasNgModel) {
                ngModelCtrl.$formatters.push(formattersListener);
            }

            if (!minRows) {
                element.attr('rows', 1);
            }

            angular.element($window).on('resize', growTextarea);
            scope.$on('$destroy', disableAutogrow);

            function growTextarea() {
                // temporarily disables element's flex so its height 'runs free'
                element
                    .attr('rows', 1)
                    .css('height', 'auto')
                    .addClass('md-no-flex');

                var height = getHeight();

                if (!lineHeight) {
                    // offsetHeight includes padding which can throw off our value
                    var originalPadding = element[0].style.padding || '';
                    lineHeight = element.css('padding', 0).prop('offsetHeight');
                    element[0].style.padding = originalPadding;
                }

                if (minRows && lineHeight) {
                    height = Math.max(height, lineHeight * minRows);
                }

                if (maxRows && lineHeight) {
                    var maxHeight = lineHeight * maxRows;

                    if (maxHeight < height) {
                        element.attr('md-no-autogrow', '');
                        height = maxHeight;
                    } else {
                        element.removeAttr('md-no-autogrow');
                    }
                }

                if (lineHeight) {
                    element.attr('rows', Math.round(height / lineHeight));
                }

                element
                    .css('height', height + 'px')
                    .removeClass('md-no-flex');
            }

            function getHeight() {
                var offsetHeight = node.offsetHeight;
                var line = node.scrollHeight - offsetHeight;
                return offsetHeight + Math.max(line, 0);
            }

            function formattersListener(value) {
                $mdUtil.nextTick(growTextarea);
                return value;
            }

            function disableAutogrow() {
                if (!isAutogrowing) return;

                isAutogrowing = false;
                angular.element($window).off('resize', growTextarea);
                scopeResizeListener && scopeResizeListener();
                element
                    .attr('md-no-autogrow', '')
                    .off('input', growTextarea);

                if (hasNgModel) {
                    var listenerIndex = ngModelCtrl.$formatters.indexOf(formattersListener);

                    if (listenerIndex > -1) {
                        ngModelCtrl.$formatters.splice(listenerIndex, 1);
                    }
                }
            }

            function attachResizeHandle() {
                if (attr.hasOwnProperty('mdNoResize')) return;

                var handle = angular.element('<div class="md-resize-handle"></div>');
                var isDragging = false;
                var dragStart = null;
                var startHeight = 0;
                var container = containerCtrl.element;

                //var dragGestureHandler = $mdGesture.register(handle, 'drag', { horizontal: false });


                element.wrap('<div class="md-resize-wrapper">').after(handle);
                handle.on('mousedown', onMouseDown);

                container
                    .on('$md.dragstart', onDragStart)
                    .on('$md.drag', onDrag)
                    .on('$md.dragend', onDragEnd);

                scope.$on('$destroy', function() {
                    handle
                        .off('mousedown', onMouseDown)
                        .remove();

                    container
                        .off('$md.dragstart', onDragStart)
                        .off('$md.drag', onDrag)
                        .off('$md.dragend', onDragEnd);

                    dragGestureHandler();
                    handle = null;
                    container = null;
                    dragGestureHandler = null;
                });

                function onMouseDown(ev) {
                    ev.preventDefault();
                    isDragging = true;
                    dragStart = ev.clientY;
                    startHeight = parseFloat(element.css('height')) || element.prop('offsetHeight');
                }

                function onDragStart(ev) {
                    if (!isDragging) return;
                    ev.preventDefault();
                    disableAutogrow();
                    container.addClass('md-input-resized');
                }

                function onDrag(ev) {
                    if (!isDragging) return;

                    element.css('height', (startHeight + ev.pointer.distanceY) + 'px');
                }

                function onDragEnd(ev) {
                    if (!isDragging) return;
                    isDragging = false;
                    container.removeClass('md-input-resized');
                }
            }

            // Attach a watcher to detect when the textarea gets shown.
            if (attr.hasOwnProperty('mdDetectHidden')) {

                var handleHiddenChange = function() {
                    var wasHidden = false;

                    return function() {
                        var isHidden = node.offsetHeight === 0;

                        if (isHidden === false && wasHidden === true) {
                            growTextarea();
                        }

                        wasHidden = isHidden;
                    };
                }();

                // Check every digest cycle whether the visibility of the textarea has changed.
                // Queue up to run after the digest cycle is complete.
                scope.$watch(function() {
                    $mdUtil.nextTick(handleHiddenChange, false);
                    return true;
                });
            }
        }
    }
}