/**
 * Created by huangsihuan on 2016/10/26.
 */
'use strict';
import TableController from './tableController';

mdTable.$inject = ['$tableUtil','$mdTheming'];

export default function mdTable($tableUtil,$mdTheming) {
    return {
        restrict: 'EA',
       // replace:true ,
        transclude:true ,
        templateUrl:'./src/components/datatable/table.temp.html',
        controller: TableController,
        controllerAs: '$kstableCtrl',
        bindToController: true,
        scope: {
            active:"&?active",
            checkable: '@?checkable' ,
            progress: '=?mdProgress',
            selected: '=?ngModel',
            rowSelect: '=tableRowSelect' ,
            dataprovider: '=?dataprovider' ,
            scrollWidth:'@?scrollWidth',
        },
        compile: function(tElement, tAttrs) {
            console.log('%c 1' ,tElement);
            tElement.addClass('ks-table-component');
            var hasProgress = tAttrs.hasOwnProperty('mdProgress');
            if(hasProgress) {
                    var body = tElement.find('tbody')[0];
                    var progress = angular.element('<thead class="md-table-progress">');
                    if(body) {tElement[0].insertBefore(progress[0], body);}
            }
            return function postLink($scope,$element,$attrs,$kstableCtrl){
                console.log('%c table link  start' ,'color:red',$scope);
                $mdTheming($element);

                //
                // console.info('children' ,$element.children().eq(0))
                // console.info('children' ,$element.children().eq(1))
                // console.info('children' ,$element.children().eq(2))
                $kstableCtrl.init();

                var queue = [];
                if(hasProgress) {
                    $scope.$watch('$kstableCtrl.progress', function(promise){
                        if(!promise) return;
                        var resolvePromises = function(){
                            if(!queue.length) {
                                return $scope.$applyAsync();
                            }
                            queue[0]['finally'](function () {
                                queue.shift();
                                resolvePromises();
                            });
                        }
                        if(queue.push(angular.isArray(promise) ? $q.all(promise) : $q.when(promise)) === 1) {
                            resolvePromises();
                        }
                    });
                }
               debugger;
                if($kstableCtrl.fixleft||$kstableCtrl.fixright) {
                    if(!$kstableCtrl.scrollWidth)  $kstableCtrl.scrollWidth = 1500; //min-width
                    var kstable = $element[0].querySelector('.ks-table-container');
                    kstable.querySelector('table').style.width = $kstableCtrl.scrollWidth+'px';
                    var colwidth = $kstableCtrl.scrollWidth/$kstableCtrl.$$columnDefs.length;
                    $kstableCtrl.$$columnDefs.map(val =>{
                        if(val.fixed) val.width = colwidth+'px';
                    })
                }


                $scope.$watch(function rowSelect() {
                    return $attrs.mdRowSelect === '' || $kstableCtrl.rowSelect;  //this->$scope
                }, function (enable) {
                    if(enable && !! $kstableCtrl.validateModel()) {
                        $kstableCtrl.enableRowSelection();
                        $element.addClass('md-row-select');
                    } else {
                        $kstableCtrl.disableRowSelection();
                        $element.removeClass('md-row-select');
                    }
                });

                $scope.$watch(()=>{
                    return $kstableCtrl.fixleft||$kstableCtrl.fixright;
                },(needfix)=>{
                    $kstableCtrl.addScrollEvent($element[0]);
                    if(needfix){
                        $kstableCtrl.addScrollEvent($element[0]);
                    }
                })




            }
        },

    };
}



