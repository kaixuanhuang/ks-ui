/**
 * Created by huangsihuan on 2016/11/13.
 */
let {isString} = angular;
export default class UISelect{
   //codetable
    static $inject = ['$parse'];
    constructor($parse){
        this.$parse = $parse;

        this._mdSelectIsOpen = false; //展开状态
        this.disabled = false;
    }

     init(){
        this.setObserveAttrs();
     }

     //主要是disable
     setObserveAttrs(){
         observeDisable();
         observeMutiple();
     }

     observeDisable(){
         attr.$observe('disabled', (disabled)=> {
             if (isString(disabled)) disabled = true;
             // Prevent click event being registered twice
             if (isDisabled !== undefined && isDisabled === disabled) {
                 return;
             }
             isDisabled = disabled;
             if (disabled) {
                 element
                     .attr({'aria-disabled': 'true'})
                     .removeAttr('tabindex')
                     .off('click', openSelect)
                     .off('keydown', handleKeypress);
             } else {
                 element
                     .attr({'tabindex': attr.tabindex, 'aria-disabled': 'false'})
                     .on('click', openSelect)
                     .on('keydown', handleKeypress);
             }
         });
     }
    observeMutiple(){
        let deregisterWatcher;
        attr.$observe('ngMultiple', (val) =>{
            if (deregisterWatcher) deregisterWatcher();
            let parser = this.$parse(val);
            deregisterWatcher = scope.$watch(() =>parser(scope) ,
                (multiple, prevVal)=> {
                if (multiple === undefined && prevVal === undefined) return; // assume compiler did a good job
                if (multiple) element.attr('multiple', 'multiple')  else element.removeAttr('multiple');
                element.attr('aria-multiselectable', multiple ? 'true' : 'false');
                if (selectContainer) {
                    selectMenuCtrl.setMultiple(multiple);
                    originalRender = ngModelCtrl.$render;
                    ngModelCtrl.$render = function() {
                        originalRender();
                        syncLabelText();
                        syncAriaLabel();
                        inputCheckValue();
                    };
                    ngModelCtrl.$render();
                }
            });
        });
    }


    //点击会展开选线
     openSelect() {
        selectScope._mdSelectIsOpen = true;
        element.attr('aria-expanded', 'true');

        $mdSelect.show({
            scope: selectScope,
            preserveScope: true,
            skipCompile: true,
            element: selectContainer,
            target: element[0],
            selectCtrl: mdSelectCtrl,
            preserveElement: true,
            hasBackdrop: true,
            loadingAsync: attr.mdOnOpen ? scope.$eval(attr.mdOnOpen) || true : false
        }).finally(function() {
            selectScope._mdSelectIsOpen = false;
            element.focus();
            element.attr('aria-expanded', 'false');
            ngModelCtrl.$setTouched();
        });
    }

}
