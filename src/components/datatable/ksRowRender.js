/**
 * Created by huangsihuan on 2016/11/10.
 */
export default function ksRowRender($compile,$parse){
    return {
        restrict:'A' ,
        link: function postLink(scope,element,attrs,ctrl){
            console.log('%c$row render scope' ,'color:red' ,scope);
            console.log('%c$row render element' ,'color:red' ,element);
            var cell = scope.td;

            var renderTemplate = scope.getRenderTemplate();
            var compiledTemp = $compile(renderTemplate)(scope);

            console.info('%cng-model' ,compiledTemp)
            element.append(compiledTemp);

            ctrl.init();
            //var parent = scope.$parent.trdata;
        },
       controller:function Controller($scope){
            //model ->view
           var ctrl = this;
           $scope.getRenderTemplate = function(){
                if($scope.td.render){
                    return $scope.td.render;
                }else{
                    //<text-input field="field"> </text-input>
                    return `<text-input field="field"> </text-input>`
                }

            }
          $scope.getCellField = function(){
             return $scope.td['field'];
          }
           $scope.getCellData = function(){
               var field = $scope.getCellField();
               return  $scope.$parent.trdata[field];
           }

           $scope.reflectBackTrdata = function(val){
               var field = $scope.getCellField();
               $scope.$parent.trdata[field] = val;
           }

           ctrl.init = function(){
               $scope['field'] = $scope.getCellData();
           }
           $scope.$watch('field',function(newvalue,oldvalue){
               $scope.reflectBackTrdata(newvalue);
           })

        }
    }

}
