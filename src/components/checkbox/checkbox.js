
export default function MdCheckboxDirective(inputDirective, $mdTheming, $mdUtil, $timeout) {
  inputDirective = inputDirective[0];

  return {
    restrict: 'E',
    transclude: true,
    require: '?ngModel',
    template:
      `<div class="ks-container" md-ink-ripple md-ink-ripple-checkbox>
        <div class="check-icon"></div>
       </div>
       <div ng-transclude class="ks-label"></div>`,
    compile: compile
  };


  function compile (tElement, tAttrs) {
    console.info($mdTheming)
    tAttrs.$set('tabindex', tAttrs.tabindex || '0');
    tAttrs.$set('type', 'checkbox');
    tAttrs.$set('role', tAttrs.type);

    return {
      pre: function (scope, element) {
        // Attach a click handler during preLink, in order to immediately stop propagation
        // (especially for ng-click) when the checkbox is disabled.
        element.on('click', function (e) {
          if (this.hasAttribute('disabled')) {
            e.stopImmediatePropagation();
          }
        });
      },
      post: postLink
    };
  }

  function postLink(scope, element, attr, ngModelCtrl) {
    var isIndeterminate;
    ngModelCtrl = ngModelCtrl || $mdUtil.fakeNgModel();
    $mdTheming(element);

    // Redirect focus events to the root element, because IE11 is always focusing the container element instead
    // of the md-checkbox element. This causes issues when using ngModelOptions: `updateOnBlur`
    element.children().on('focus', function () {
      element.focus();
    });

    if ($mdUtil.parseAttributeBoolean(attr.mdIndeterminate)) {
      setIndeterminateState();
      scope.$watch(attr.mdIndeterminate, setIndeterminateState);
    }

    if (attr.ngChecked) {
      scope.$watch(scope.$eval.bind(scope, attr.ngChecked), function (value) {
        ngModelCtrl.$setViewValue(value);
        ngModelCtrl.$render();
      });
    }

    $$watchExpr('ngDisabled', 'tabindex', {
      true: '-1',
      false: attr.tabindex
    });

    // Reuse the original input[type=checkbox] directive from Angular core.
    // This is a bit hacky as we need our own event listener and own render
    // function.
    inputDirective.link.pre(scope, {
      on: angular.noop,
      0: {}
    }, attr, [ngModelCtrl]);

    scope.mouseActive = false;
    element.on('click', listener)
        .on('keypress', keypressHandler)
        .on('mousedown', function () {
          scope.mouseActive = true;
          $timeout(function () {
            scope.mouseActive = false;
          }, 100);
        })
        .on('focus', function () {
          if (scope.mouseActive === false) {
            element.addClass('md-focused');
          }
        })
        .on('blur', function () {
          element.removeClass('md-focused');
        });

    ngModelCtrl.$render = render;

    function $$watchExpr(expr, htmlAttr, valueOpts) {
      if (attr[expr]) {
        scope.$watch(attr[expr], function (val) {
          if (valueOpts[val]) {
            element.attr(htmlAttr, valueOpts[val]);
          }
        });
      }
    }

    function keypressHandler(ev) {
      var keyCode = ev.which || ev.keyCode;
      if (keyCode === $mdConstant.KEY_CODE.SPACE || keyCode === $mdConstant.KEY_CODE.ENTER) {
        ev.preventDefault();
        element.addClass('md-focused');
        listener(ev);
      }
    }

    function listener(ev) {
      // skipToggle boolean is used by the switch directive to prevent the click event
      // when releasing the drag. There will be always a click if releasing the drag over the checkbox
      if (element[0].hasAttribute('disabled') || scope.skipToggle) {
        return;
      }

      scope.$apply(function () {
        // Toggle the checkbox value...
        var viewValue = attr.ngChecked ? attr.checked : !ngModelCtrl.$viewValue;

        ngModelCtrl.$setViewValue(viewValue, ev && ev.type);
        ngModelCtrl.$render();
      });
    }

    function render() {
      // Cast the $viewValue to a boolean since it could be undefined
      element.toggleClass('ks-checked', !!ngModelCtrl.$viewValue && !isIndeterminate);
    }

    function setIndeterminateState(newValue) {
      isIndeterminate = newValue !== false;
      if (isIndeterminate) {
        element.attr('aria-checked', 'mixed');
      }
      element.toggleClass('md-indeterminate', isIndeterminate);
    }
  }
}