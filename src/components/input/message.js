/**
 * Created by huangsihuan on 2016/10/31.
 */
var visibilityDirectives = ['ngIf', 'ngShow', 'ngHide', 'ngSwitchWhen', 'ngSwitchDefault'];
function ngMessagesDirective() {
    return {
        restrict: 'EA',
        link: postLink,

        // This is optional because we don't want target *all* ngMessage instances, just those inside of
        // mdInputContainer.
        require: '^^?mdInputContainer'
    };

    function postLink(scope, element, attrs, inputContainer) {
        // If we are not a child of an input container, don't do anything
        if (!inputContainer) return;

        // Add our animation class
        element.toggleClass('md-input-messages-animation', true);

        // Add our md-auto-hide class to automatically hide/show messages when container is invalid
        element.toggleClass('md-auto-hide', true);

        // If we see some known visibility directives, remove the md-auto-hide class
        if (attrs.mdAutoHide == 'false' || hasVisibiltyDirective(attrs)) {
            element.toggleClass('md-auto-hide', false);
        }
    }

    function hasVisibiltyDirective(attrs) {
        return visibilityDirectives.some(function(attr) {
            return attrs[attr];
        });
    }
}

function ngMessageDirective($mdUtil) {
    return {
        restrict: 'EA',
        compile: compile,
        priority: 100
    };

    function compile(tElement) {
        if (!isInsideInputContainer(tElement)) {

            // When the current element is inside of a document fragment, then we need to check for an input-container
            // in the postLink, because the element will be later added to the DOM and is currently just in a temporary
            // fragment, which causes the input-container check to fail.
            if (isInsideFragment()) {
                return function (scope, element) {
                    if (isInsideInputContainer(element)) {
                        // Inside of the postLink function, a ngMessage directive will be a comment element, because it's
                        // currently hidden. To access the shown element, we need to use the element from the compile function.
                        initMessageElement(tElement);
                    }
                };
            }
        } else {
            initMessageElement(tElement);
        }

        function isInsideFragment() {
            var nextNode = tElement[0];
            while (nextNode = nextNode.parentNode) {
                if (nextNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                    return true;
                }
            }
            return false;
        }

        function isInsideInputContainer(element) {
            return !!$mdUtil.getClosest(element, "md-input-container");
        }

        function initMessageElement(element) {
            // Add our animation class
            element.toggleClass('md-input-message-animation', true);
        }
    }
}

var $$AnimateRunner, $animateCss, $mdUtil;

function mdInputInvalidMessagesAnimation($$AnimateRunner, $animateCss, $mdUtil) {
    saveSharedServices($$AnimateRunner, $animateCss, $mdUtil);

    return {
        addClass: function(element, className, done) {
            showInputMessages(element, done);
        }

        // NOTE: We do not need the removeClass method, because the message ng-leave animation will fire
    };
}

function ngMessagesAnimation($$AnimateRunner, $animateCss, $mdUtil) {
    saveSharedServices($$AnimateRunner, $animateCss, $mdUtil);

    return {
        enter: function(element, done) {
            showInputMessages(element, done);
        },

        leave: function(element, done) {
            hideInputMessages(element, done);
        },

        addClass: function(element, className, done) {
            if (className == "ng-hide") {
                hideInputMessages(element, done);
            } else {
                done();
            }
        },

        removeClass: function(element, className, done) {
            if (className == "ng-hide") {
                showInputMessages(element, done);
            } else {
                done();
            }
        }
    };
}

function ngMessageAnimation($$AnimateRunner, $animateCss, $mdUtil) {
    saveSharedServices($$AnimateRunner, $animateCss, $mdUtil);

    return {
        enter: function(element, done) {
            var animator = showMessage(element);

            animator.start().done(done);
        },

        leave: function(element, done) {
            var animator = hideMessage(element);

            animator.start().done(done);
        }
    };
}

function showInputMessages(element, done) {
    var animators = [], animator;
    var messages = getMessagesElement(element);

    angular.forEach(messages.children(), function(child) {
        animator = showMessage(angular.element(child));

        animators.push(animator.start());
    });

    $$AnimateRunner.all(animators, done);
}

function hideInputMessages(element, done) {
    var animators = [], animator;
    var messages = getMessagesElement(element);

    angular.forEach(messages.children(), function(child) {
        animator = hideMessage(angular.element(child));

        animators.push(animator.start());
    });

    $$AnimateRunner.all(animators, done);
}

function showMessage(element) {
    var height = parseInt(window.getComputedStyle(element[0]).height);
    var topMargin = parseInt(window.getComputedStyle(element[0]).marginTop);

    var messages = getMessagesElement(element);
    var container = getInputElement(element);

    // Check to see if the message is already visible so we can skip
    var alreadyVisible = (topMargin > -height);

    // If we have the md-auto-hide class, the md-input-invalid animation will fire, so we can skip
    if (alreadyVisible || (messages.hasClass('md-auto-hide') && !container.hasClass('md-input-invalid'))) {
        return $animateCss(element, {});
    }

    return $animateCss(element, {
        event: 'enter',
        structural: true,
        from: {"opacity": 0, "margin-top": -height + "px"},
        to: {"opacity": 1, "margin-top": "0"},
        duration: 0.3
    });
}

function hideMessage(element) {
    var height = element[0].offsetHeight;
    var styles = window.getComputedStyle(element[0]);

    // If we are already hidden, just return an empty animation
    if (parseInt(styles.opacity) === 0) {
        return $animateCss(element, {});
    }

    // Otherwise, animate
    return $animateCss(element, {
        event: 'leave',
        structural: true,
        from: {"opacity": 1, "margin-top": 0},
        to: {"opacity": 0, "margin-top": -height + "px"},
        duration: 0.3
    });
}

function getInputElement(element) {
    var inputContainer = element.controller('mdInputContainer');

    return inputContainer.element;
}

function getMessagesElement(element) {
    // If we are a ng-message element, we need to traverse up the DOM tree
    if (element.hasClass('md-input-message-animation')) {
        return angular.element($mdUtil.getClosest(element, function(node) {
            return node.classList.contains('md-input-messages-animation');
        }));
    }

    // Otherwise, we can traverse down
    return angular.element(element[0].querySelector('.md-input-messages-animation'));
}

function saveSharedServices(_$$AnimateRunner_, _$animateCss_, _$mdUtil_) {
    $$AnimateRunner = _$$AnimateRunner_;
    $animateCss = _$animateCss_;
    $mdUtil = _$mdUtil_;
}

