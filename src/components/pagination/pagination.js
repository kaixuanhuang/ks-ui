/**
 * Created by huangsihuan on 2016/11/6.
 */


export default  function KsPaginationDiretive($mdTheming,$mdUtil){
    return {
        restrict:'E',
        template:
            `
            <ul class="ks-pagination">
               <li  pagination-ink-ripple ng-class="{'disabled':prevDisable()}"><span ng-click="prevPage($event)"><ks-icon md-svg-icon="iconToggleArrow" class="prev"/></span></li>
               
                 <li   class="pageNum" ng-class="{'active':isCurrentPage(i.p)}" ng-click="onPage($event,i.p)"  ng-repeat="i in pagnationInfo "  pagination-ink-ripple>           
                  <span >{{i.p}}</span>                
                  </li>
                              
               <li pagination-ink-ripple><span ng-click="nextPage($event)"><ks-icon md-svg-icon="iconToggleArrow" class="next"/></span></li>
             </ul>
           `,
        compile: function compile(tElment){
            $mdTheming(tElment);
            return function postlink(scope,element,attrs,ctrl){
                //$mdPaginationInkRipple.attach(scope,element)
                ctrl.init();

            }
        },
        controller:['$scope','$element',function Controller($scope,$element){
            var $ctrl = this;
            $ctrl.init = function(){
                $scope.maxpage = 9;
                $scope.pagnationInfo = [];
                $scope.currentPage = 1;
                for (let i = 1; i <= $scope.maxpage; i++) {
                    var item = {p:i};
                    $scope.pagnationInfo.push(item);
                }

                //初始化 当前页数是1 ，当前激活页也是1 ，同时prev按钮要灰显
                $scope.currentPage =1;
                $scope.findPrevBtn().setAttribute('disabled','');
                console.info('pagnationInfo' ,$scope)
            }
            $scope.prevDisable = ()=> $scope.currentPage === 1;
            $scope.isCurrentPage =(p)=> $scope.currentPage === p;
            $scope.onPage = function($event,page){

                $scope.currentPage=page;
                //ng-class repeat
/*                var elm = $event.target;
                console.info($event);
                var li = $element[0].querySelectorAll('li.pageNum');
                li.forEach((n) =>{
                    n.classList.remove('active');
                })
                var parentli = $mdUtil.getClosest(elm,'li');
                parentli.classList.add('active')*/
            };
            $scope.findPrevBtn = ()=>  $mdUtil.getClosest($element[0].querySelector('.prev'),'li');
            $scope.findActivePage =()=> $element[0].querySelecor('li.active');
            $scope.prevPage = function(evt){
                evt.preventDefault();
                if($scope.currentPage === 1) return;
                $scope.currentPage = $scope.currentPage - 1;
                if($scope.pagnationInfo[0].p === 1) return;
                let prep = $scope.pagnationInfo[0].p-1;
                $scope.pagnationInfo.splice($scope.maxpage-1,1);
                $scope.pagnationInfo.unshift({p:prep});
            }

            $scope.nextPage = function(evt){
                evt.preventDefault();
                let nextp = $scope.pagnationInfo[$scope.maxpage-1].p*1+1;
                $scope.pagnationInfo.shift();
                $scope.pagnationInfo.push({p:nextp});
                $scope.currentPage+=1;
            }
        }]
    }

}