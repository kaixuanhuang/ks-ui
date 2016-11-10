/**
 * Created by huangsihuan on 2016/11/5.
 */
export default function PanelDiretive(){
   return {
       restrict: 'E',
       transclude: true,
       scope: {
           title:'@title'
       },
       template:
           `
       <section whiteframe="3" >
      <ks-toolbar>
        <div class="ks-toolbar-tools">
          <h3><a>{{title}}</a></h3>
          <span style=" flex: 1;
    box-sizing: border-box;"></span>
          <ks-icon ng-class=" {'toggled':contentShow}" md-svg-icon="iconToggleArrow"  ng-click="hidecontent()"/>
        </div>
      </ks-toolbar>
       <ks-content ng-show="contentShow">
           <div  whiteframe="3" ng-transclude> </div>
       </ks-content>
    </section>
           `,
       link: function postlink(scope){
           console.info('panel scope' ,scope)
       },
       controller:['$scope',function Controller($scope,$element){
           $scope.contentShow = true;
           $scope.hidecontent = function(){
               $scope.contentShow = !$scope.contentShow;
           }
       }]

    }

}