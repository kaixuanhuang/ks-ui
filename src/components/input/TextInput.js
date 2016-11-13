/**
 * Created by huangsihuan on 2016/11/10.
 */

//<ks-field label="label"> <input type="text" ng-model="field"/></ks-field>
export default function TextInput(){
    return {
        restrict: 'E',
        reuqire: ['textInput'],
        template: `<ks-field label="textinputCtrl.label" layout="row">
                             <div  class="ks-form-label" flex="30"></div>
                              <div flex="70"><input type="text"  ng-model="textinputCtrl.model" ng-required="textinputCtrl.required"/></div>
                            </ks-field>`,
        scope: {
            label: "@?",
            model: "=?",
            required: '=?'
        },
        bindToController: true,
        controllerAs: 'textinputCtrl',
        compile:function compile(tElment,tAttrs){
            if(tAttrs.lefticon){
                tElment[0].querySelector('.ks-form-label').remove();
                var icon = angular.element(' <div  class="ks-form-label" flex="30"> <ks-icon md-svg-icon="iconCalendar"></ks-icon> </div>');
                tElment.find('ks-field').prepend(icon);

/*                var target = manipulationTarget( this, elem );
                target.insertBefore( elem, target.firstChild );*/
            }
            if(tAttrs.righticon){
                tElment[0].querySelector('.ks-form-label').remove();
                var icon = angular.element('<div  class="ks-form-label" flex="30"><ks-icon md-svg-icon="iconCalendar"></ks-icon></div>');
                tElment.find('ks-field').append(icon);
            }
            return postLink;

        },
        controller: ['$scope',function Controller($scope){
            var textinputCtrl = this;
            console.info('textinputCtrl' ,textinputCtrl)
            //label用于field observe
            $scope.label = textinputCtrl.label;
        }]
    }


    function postLink(scope,element,attrs,ctrls){


        /*            var  modelCtrl = ctrls[1];
         //model->UI
         modelCtrl.$render = function(){
         "use strict";

         }*/

        //UI->model

    }


}
