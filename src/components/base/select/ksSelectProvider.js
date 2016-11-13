/**
 * Created by huangsihuan on 2016/11/12.
 *
 *
 *     build
 *    cancel
 *     destroy
 *    hide
 *   show
 */
export default  function SelectProvider($$interimElementProvider) {
    return $$interimElementProvider('$mdSelect')
        .setDefaults({
            methods: ['target'],
            options: selectDefaultOptions
        });

    /* @ngInject */
    function selectDefaultOptions($mdSelect, $ksConstant, $mdUtil, $window, $q, $$rAF, $animateCss, $animate, $document) {

        var ERROR_TARGET_EXPECTED = "$mdSelect.show()至少要一个option !";
        //to do  先不要动画
        //var animator = $mdUtil.dom.animator;

        var keyCodes = $ksConstant.KEY_CODE;

        return {
            parent: 'body',
            themable: true,
            onShow: onShow,
            onRemove: onRemove,
            hasBackdrop: true,
            disableParentScroll: true
        };

        /**
         * Interim-element onRemove logic....
         */
        function onRemove(scope, element, opts) {
            opts = opts || { };
            opts.cleanupInteraction();
            opts.cleanupResizing();
            opts.hideBackdrop();

            // For navigation $destroy events, do a quick, non-animated removal,
            // but for normal closes (from clicks, etc) animate the removal

            return  (opts.$destroy === true) ? cleanElement() : animateRemoval().then( cleanElement );
            /**
             * For normal closes (eg clicks), animate the removal.
             * For forced closes (like $destroy events from navigation),
             * skip the animations
             */
            function animateRemoval() {
                return $animateCss(element, {addClass: 'md-leave'}).start();
            }

            /**
             * Restore the element to a closed state
             */
            function cleanElement() {

                element.removeClass('md-active');
                element.attr('aria-hidden', 'true');
                element[0].style.display = 'none';

                announceClosed(opts);

                if (!opts.$destroy && opts.restoreFocus) {
                    opts.target.focus();
                }
            }

        }

        /**
         * Interim-element onShow logic....
         */
        function onShow(scope, element, opts) {

            watchAsyncLoad();
            sanitizeAndConfigure(scope, opts);

            opts.hideBackdrop = showBackdrop(scope, element, opts);

            return showDropDown(scope, element, opts)
                .then(function(response) {
                    element.attr('aria-hidden', 'false');
                    opts.alreadyOpen = true;
                    opts.cleanupInteraction = activateInteraction();
                    opts.cleanupResizing = activateResizing();

                    return response;
                }, opts.hideBackdrop);

            // ************************************
            // Closure Functions
            // ************************************

            /**
             *  Attach the select DOM element(s) and animate to the correct positions
             *  and scalings...
             */
            function showDropDown(scope, element, opts) {
                debugger;
                opts.parent.append(element);
                return $q(function(resolve, reject) {
                    try {
                        $animateCss(element, {removeClass: 'md-leave', duration: 0})
                            .start()
                            .then(positionAndFocusMenu)
                            .then(resolve);

                    } catch (e) {
                        reject(e);
                    }

                });
            }

            /**
             * 初始化  container 和  dropdown Menu 位置 及 规模scale ,然后动画 显示show 和  autofocus
             */
            function positionAndFocusMenu() {
                return $q(function(resolve) {
                    if (opts.isRemoved) return $q.reject(false);
                    var info = calculateMenuPositions(scope, element, opts);
                       //TO DO
/*                    info.container.element.css(animator.toCss(info.container.styles));
                    info.dropDown.element.css(animator.toCss(info.dropDown.styles));

                    $$rAF(function() {
                        element.addClass('md-active');
                        info.dropDown.element.css(animator.toCss({transform: ''}));

                        autoFocus(opts.focusedNode);
                        resolve();
                    });*/

                });
            }

            /**
             * Show modal backdrop element...
             */
            function showBackdrop(scope, element, options) {

                // If we are not within a dialog...
                if (options.disableParentScroll && !$mdUtil.getClosest(options.target, 'MD-DIALOG')) {
                    // !! DO this before creating the backdrop; since disableScrollAround()
                    //    configures the scroll offset; which is used by mdBackDrop postLink()
                    options.restoreScroll = $mdUtil.disableScrollAround(options.element, options.parent);
                } else {
                    options.disableParentScroll = false;
                }

                if (options.hasBackdrop) {
                    // Override duration to immediately show invisible backdrop
                    options.backdrop = $mdUtil.createBackdrop(scope, "md-select-backdrop md-click-catcher");
                    $animate.enter(options.backdrop, $document[0].body, null, {duration: 0});
                }

                /**
                 * Hide modal backdrop element...
                 */
                return function hideBackdrop() {
                    if (options.backdrop) options.backdrop.remove();
                    if (options.disableParentScroll) options.restoreScroll();

                    delete options.restoreScroll;
                };
            }

            /**
             *
             */
            function autoFocus(focusedNode) {
                if (focusedNode && !focusedNode.hasAttribute('disabled')) {
                    focusedNode.focus();
                }
            }

            /**
             * Check for valid opts and set some sane defaults
             */
            function sanitizeAndConfigure(scope, options) {
                var selectEl = element.find('md-select-menu');

                if (!options.target) {
                    throw new Error($mdUtil.supplant(ERROR_TARGET_EXPECTED, [options.target]));
                }

                angular.extend(options, {
                    isRemoved: false,
                    target: angular.element(options.target), //make sure it's not a naked dom node
                    parent: angular.element(options.parent),
                    selectEl: selectEl,
                    contentEl: element.find('md-content'),
                    optionNodes: selectEl[0].getElementsByTagName('md-option')
                });
            }

            /**
             *  为屏幕改变配置 各种 resize监听
             * Configure various resize listeners for screen changes
             */
            function activateResizing() {
                var debouncedOnResize = (function(scope, target, options) {

                    return function() {
                        if (options.isRemoved) return;

                        var updates = calculateMenuPositions(scope, target, options);
                        var container = updates.container;
                        var dropDown = updates.dropDown;

                        //TO DO先去掉动画
/*                        container.element.css(animator.toCss(container.styles));
                        dropDown.element.css(animator.toCss(dropDown.styles));*/
                    };

                })(scope, element, opts);

                var window = angular.element($window);
                window.on('resize', debouncedOnResize);
                window.on('orientationchange', debouncedOnResize);

                // Publish deactivation closure...
                return function deactivateResizing() {

                    // Disable resizing handlers
                    window.off('resize', debouncedOnResize);
                    window.off('orientationchange', debouncedOnResize);
                };
            }

            /**
             *  If asynchronously loading, watch and update internal
             *  '$$loadingAsyncDone' flag
             */
            function watchAsyncLoad() {
                if (opts.loadingAsync && !opts.isRemoved) {
                    scope.$$loadingAsyncDone = false;

                    $q.when(opts.loadingAsync)
                        .then(function() {
                            scope.$$loadingAsyncDone = true;
                            delete opts.loadingAsync;
                        }).then(function() {
                        $$rAF(positionAndFocusMenu);
                    });
                }
            }

            /**
             *
             */
            function activateInteraction() {
                if (opts.isRemoved) return;

                var dropDown = opts.selectEl;
                var selectCtrl = dropDown.controller('mdSelectMenu') || {};

                element.addClass('md-clickable');

                // Close on backdrop click
                opts.backdrop && opts.backdrop.on('click', onBackdropClick);

                // Escape to close
                // Cycling of options, and closing on enter
                dropDown.on('keydown', onMenuKeyDown);
                dropDown.on('click', checkCloseMenu);

                return function cleanupInteraction() {
                    opts.backdrop && opts.backdrop.off('click', onBackdropClick);
                    dropDown.off('keydown', onMenuKeyDown);
                    dropDown.off('click', checkCloseMenu);

                    element.removeClass('md-clickable');
                    opts.isRemoved = true;
                };

                // ************************************
                // Closure Functions
                // ************************************

                function onBackdropClick(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    opts.restoreFocus = false;
                    $mdUtil.nextTick($mdSelect.hide, true);
                }

                function onMenuKeyDown(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();

                    switch (ev.keyCode) {
                        case keyCodes.UP_ARROW:
                            return focusPrevOption();
                        case keyCodes.DOWN_ARROW:
                            return focusNextOption();
                        case keyCodes.SPACE:
                        case keyCodes.ENTER:
                            var option = $mdUtil.getClosest(ev.target, 'md-option');
                            if (option) {
                                dropDown.triggerHandler({
                                    type: 'click',
                                    target: option
                                });
                                ev.preventDefault();
                            }
                            checkCloseMenu(ev);
                            break;
                        case keyCodes.TAB:
                        case keyCodes.ESCAPE:
                            ev.stopPropagation();
                            ev.preventDefault();
                            opts.restoreFocus = true;
                            $mdUtil.nextTick($mdSelect.hide, true);
                            break;
                        default:
                            if ($ksConstant.isInputKey(ev) || $ksConstant.isNumPadKey(ev)) {
                                var optNode = dropDown.controller('mdSelectMenu').optNodeForKeyboardSearch(ev);
                                opts.focusedNode = optNode || opts.focusedNode;
                                optNode && optNode.focus();
                            }
                    }
                }

                function focusOption(direction) {
                    var optionsArray = $mdUtil.nodesToArray(opts.optionNodes);
                    var index = optionsArray.indexOf(opts.focusedNode);

                    var newOption;

                    do {
                        if (index === -1) {
                            // We lost the previously focused element, reset to first option
                            index = 0;
                        } else if (direction === 'next' && index < optionsArray.length - 1) {
                            index++;
                        } else if (direction === 'prev' && index > 0) {
                            index--;
                        }
                        newOption = optionsArray[index];
                        if (newOption.hasAttribute('disabled')) newOption = undefined;
                    } while (!newOption && index < optionsArray.length - 1 && index > 0);

                    newOption && newOption.focus();
                    opts.focusedNode = newOption;
                }

                function focusNextOption() {
                    focusOption('next');
                }

                function focusPrevOption() {
                    focusOption('prev');
                }

                function checkCloseMenu(ev) {
                    if (ev && ( ev.type == 'click') && (ev.currentTarget != dropDown[0])) return;
                    if ( mouseOnScrollbar() ) return;

                    var option = $mdUtil.getClosest(ev.target, 'md-option');
                    if (option && option.hasAttribute && !option.hasAttribute('disabled')) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        if (!selectCtrl.isMultiple) {
                            opts.restoreFocus = true;

                            $mdUtil.nextTick(function () {
                                $mdSelect.hide(selectCtrl.ngModel.$viewValue);
                            }, true);
                        }
                    }
                    /**
                     * check if the mouseup event was on a scrollbar
                     */
                    function mouseOnScrollbar() {
                        var clickOnScrollbar = false;
                        if (ev && (ev.currentTarget.children.length > 0)) {
                            var child = ev.currentTarget.children[0];
                            var hasScrollbar = child.scrollHeight > child.clientHeight;
                            if (hasScrollbar && child.children.length > 0) {
                                var relPosX = ev.pageX - ev.currentTarget.getBoundingClientRect().left;
                                if (relPosX > child.querySelector('md-option').offsetWidth)
                                    clickOnScrollbar = true;
                            }
                        }
                        return clickOnScrollbar;
                    }
                }
            }

        }

        /**
         * To notify listeners that the Select menu has closed,
         * trigger the [optional] user-defined expression
         */
        function announceClosed(opts) {
            var mdSelect = opts.selectCtrl;
            if (mdSelect) {
                var menuController = opts.selectEl.controller('mdSelectMenu');
                mdSelect.setLabelText(menuController ? menuController.selectedLabels() : '');
                mdSelect.triggerClose();
            }
        }


        /**
         * Calculate the
         */
        function calculateMenuPositions(scope, element, opts) {
            var
                containerNode = element[0],
                targetNode = opts.target[0].children[0], // target the label
                parentNode = $document[0].body,
                selectNode = opts.selectEl[0],
                contentNode = opts.contentEl[0],
                parentRect = parentNode.getBoundingClientRect(),
                targetRect = targetNode.getBoundingClientRect(),
                shouldOpenAroundTarget = false,
                bounds = {
                    left: parentRect.left + SELECT_EDGE_MARGIN,
                    top: SELECT_EDGE_MARGIN,
                    bottom: parentRect.height - SELECT_EDGE_MARGIN,
                    right: parentRect.width - SELECT_EDGE_MARGIN - ($mdUtil.floatingScrollbars() ? 16 : 0)
                },
                spaceAvailable = {
                    top: targetRect.top - bounds.top,
                    left: targetRect.left - bounds.left,
                    right: bounds.right - (targetRect.left + targetRect.width),
                    bottom: bounds.bottom - (targetRect.top + targetRect.height)
                },
                maxWidth = parentRect.width - SELECT_EDGE_MARGIN * 2,
                selectedNode = selectNode.querySelector('md-option[selected]'),
                optionNodes = selectNode.getElementsByTagName('md-option'),
                optgroupNodes = selectNode.getElementsByTagName('md-optgroup'),
                isScrollable = calculateScrollable(element, contentNode),
                centeredNode;

            var loading = isPromiseLike(opts.loadingAsync);
            if (!loading) {
                // If a selected node, center around that
                if (selectedNode) {
                    centeredNode = selectedNode;
                    // If there are option groups, center around the first option group
                } else if (optgroupNodes.length) {
                    centeredNode = optgroupNodes[0];
                    // Otherwise - if we are not loading async - center around the first optionNode
                } else if (optionNodes.length) {
                    centeredNode = optionNodes[0];
                    // In case there are no options, center on whatever's in there... (eg progress indicator)
                } else {
                    centeredNode = contentNode.firstElementChild || contentNode;
                }
            } else {
                // If loading, center on progress indicator
                centeredNode = contentNode.firstElementChild || contentNode;
            }

            if (contentNode.offsetWidth > maxWidth) {
                contentNode.style['max-width'] = maxWidth + 'px';
            } else {
                contentNode.style.maxWidth = null;
            }
            if (shouldOpenAroundTarget) {
                contentNode.style['min-width'] = targetRect.width + 'px';
            }

            // Remove padding before we compute the position of the menu
            if (isScrollable) {
                selectNode.classList.add('md-overflow');
            }

            var focusedNode = centeredNode;
            if ((focusedNode.tagName || '').toUpperCase() === 'MD-OPTGROUP') {
                focusedNode = optionNodes[0] || contentNode.firstElementChild || contentNode;
                centeredNode = focusedNode;
            }
            // Cache for autoFocus()
            opts.focusedNode = focusedNode;

            // Get the selectMenuRect *after* max-width is possibly set above
            containerNode.style.display = 'block';
            var selectMenuRect = selectNode.getBoundingClientRect();
            var centeredRect = getOffsetRect(centeredNode);

            if (centeredNode) {
                var centeredStyle = $window.getComputedStyle(centeredNode);
                centeredRect.paddingLeft = parseInt(centeredStyle.paddingLeft, 10) || 0;
                centeredRect.paddingRight = parseInt(centeredStyle.paddingRight, 10) || 0;
            }

            if (isScrollable) {
                var scrollBuffer = contentNode.offsetHeight / 2;
                contentNode.scrollTop = centeredRect.top + centeredRect.height / 2 - scrollBuffer;

                if (spaceAvailable.top < scrollBuffer) {
                    contentNode.scrollTop = Math.min(
                        centeredRect.top,
                        contentNode.scrollTop + scrollBuffer - spaceAvailable.top
                    );
                } else if (spaceAvailable.bottom < scrollBuffer) {
                    contentNode.scrollTop = Math.max(
                        centeredRect.top + centeredRect.height - selectMenuRect.height,
                        contentNode.scrollTop - scrollBuffer + spaceAvailable.bottom
                    );
                }
            }

            var left, top, transformOrigin, minWidth, fontSize;
            if (shouldOpenAroundTarget) {
                left = targetRect.left;
                top = targetRect.top + targetRect.height;
                transformOrigin = '50% 0';
                if (top + selectMenuRect.height > bounds.bottom) {
                    top = targetRect.top - selectMenuRect.height;
                    transformOrigin = '50% 100%';
                }
            } else {
                left = (targetRect.left + centeredRect.left - centeredRect.paddingLeft) + 2;
                top = Math.floor(targetRect.top + targetRect.height / 2 - centeredRect.height / 2 -
                        centeredRect.top + contentNode.scrollTop) + 2;

                transformOrigin = (centeredRect.left + targetRect.width / 2) + 'px ' +
                    (centeredRect.top + centeredRect.height / 2 - contentNode.scrollTop) + 'px 0px';

                minWidth = Math.min(targetRect.width + centeredRect.paddingLeft + centeredRect.paddingRight, maxWidth);

                fontSize = window.getComputedStyle(targetNode)['font-size'];
            }

            // Keep left and top within the window
            var containerRect = containerNode.getBoundingClientRect();
            var scaleX = Math.round(100 * Math.min(targetRect.width / selectMenuRect.width, 1.0)) / 100;
            var scaleY = Math.round(100 * Math.min(targetRect.height / selectMenuRect.height, 1.0)) / 100;

            return {
                container: {
                    element: angular.element(containerNode),
                    styles: {
                        left: Math.floor(clamp(bounds.left, left, bounds.right - containerRect.width)),
                        top: Math.floor(clamp(bounds.top, top, bounds.bottom - containerRect.height)),
                        'min-width': minWidth,
                        'font-size': fontSize
                    }
                },
                dropDown: {
                    element: angular.element(selectNode),
                    styles: {
                        transformOrigin: transformOrigin,
                        transform: !opts.alreadyOpen ? $mdUtil.supplant('scale({0},{1})', [scaleX, scaleY]) : ""
                    }
                }
            };

        }

    }

    function isPromiseLike(obj) {
        return obj && angular.isFunction(obj.then);
    }

    function clamp(min, n, max) {
        return Math.max(min, Math.min(n, max));
    }

    function getOffsetRect(node) {
        return node ? {
            left: node.offsetLeft,
            top: node.offsetTop,
            width: node.offsetWidth,
            height: node.offsetHeight
        } : {left: 0, top: 0, width: 0, height: 0};
    }

    function calculateScrollable(element, contentNode) {
        var isScrollable = false;

        try {
            var oldDisplay = element[0].style.display;

            // Set the element's display to block so that this calculation is correct
            element[0].style.display = 'block';

            isScrollable = contentNode.scrollHeight > contentNode.offsetHeight;

            // Reset it back afterwards
            element[0].style.display = oldDisplay;
        } finally {
            // Nothing to do
        }
        return isScrollable;
    }
}