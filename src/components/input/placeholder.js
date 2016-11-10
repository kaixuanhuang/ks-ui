/**
 * Created by huangsihuan on 2016/10/31.
 */
function placeholderDirective($compile) {
    return {
        restrict: 'A',
        require: '^^?mdInputContainer',
        priority: 200,
        link: {
            pre: preLink
        }
    };

    function preLink(scope, element, attr, inputContainer) {
        if (!inputContainer) return;
        var label = inputContainer.element.find('label');
        if (label && label.length) {
            inputContainer.setHasPlaceholder(true);
            return;
        }
        if (element[0].nodeName != 'KS-SELECT') {
            var newLabel = angular.element('<label ng-click="delegateClick()" tabindex="-1">' + attr.placeholder + '</label>');
            attr.$set('placeholder', null);
            inputContainer.element
                .addClass('md-icon-float')
                .prepend(newLabel);
            $compile(newLabel)(scope);
        }
    }
}

