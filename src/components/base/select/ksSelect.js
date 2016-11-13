/**
 * Created by huangsihuan on 2016/11/12.
 */
/*var keyCodes = $mdConstant.KEY_CODE;
var NAVIGATION_KEYS = [keyCodes.SPACE, keyCodes.ENTER, keyCodes.UP_ARROW, keyCodes.DOWN_ARROW];*/


export default function KsSelectDirective($compile,$mdUtil,$mdSelect){
    return {
        require: ['ksSelect', 'ngModel','^?ksField',  '?^form'],
        compile:function compile(tElement){

            // add the select value that will hold our placeholder or selected option value
            var valueEl = angular.element('<ks-select-value><span></span></ks-select-value>');
            valueEl.append('<span class="md-select-icon" ></span>');
            valueEl.addClass('ks-select-value');
            if (!valueEl[0].hasAttribute('id')) {
                valueEl.attr('id', 'select_value_label_' );//+ $mdUtil.nextUid()
            }


            var autofillClone = angular.element('<select class="md-visually-hidden">');

            return function postLink(scope,element,attrs,ctrls){


                //如果是多选
                var isMultiple = $mdUtil.parseAttributeBoolean(attrs.multiple);
                var selectTemplate = `
                    <div class="select-menu-container" >
                        <input class="select-dropdown">
                        <ul class="dropdown-content select-dropdown">
                                <li ng-click ng-repeat="codes in selectCtrl.codestables" ng-value="codes.id"><span>{{codes.text}}</span></li>
                        </ul>
                    </div>`;
                var multipleContent = isMultiple ? 'multiple' : '';

               // element.append(selectTemplate);

/*                selectTemplate = $mdUtil.supplant(selectTemplate, [multipleContent, element.html()]);
                element.empty().append(valueEl);
                */
/*
                console.info(ctrls)
                angular.forEach(scope.codeTables,(codes)=>{
                    var newEl = angular.element('<option>' + codes.text + '</option>');
                    newEl.attr('ng-value', codes.id);
                    autofillClone.append(newEl);
                })
                var modelCtrl = ctrls[1];
                var extraSelectOption = $compile(angular.element( `<option ng-value="value" selected></option>`))(scope);
                autofillClone.append(extraSelectOption);
                element.append(autofillClone);*/
                var selectContainer, selectScope;
                var selectCtrl = ctrls[0];
               var ngModelCtrl = ctrls[1];

                selectCtrl.codestables = [{id:1,text:'text'}]
                $mdSelect.show({
                    scope: scope,
                    preserveScope: true,
                    skipCompile: true,
                    element: angular.element(selectTemplate),
                    target: element[0],
                    selectCtrl: selectCtrl,
                    preserveElement: true,
                    hasBackdrop: true,
                    loadingAsync: attrs.mdOnOpen ? scope.$eval(attr.mdOnOpen) || true : false
                }).finally(function() {
                    scope._mdSelectIsOpen = false;
                    element.focus();
                    element.attr('aria-expanded', 'false');
                    ngModelCtrl.$setTouched();
                });
            }
        },
        controller:['$mdSelect' ,function Controller($mdSelect){
            "use strict";
              debugger;
            console.log($mdSelect)
        }]
    }

}
