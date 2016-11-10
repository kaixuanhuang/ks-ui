/**
 * Created by huangsihuan on 2016/10/26.
 */
'use strict';


export default function mdTable($tableUtil,$mdTheming) {
    return {
        restrict: 'EA',
       // replace:true ,
        transclude:true ,
        templateUrl:'./src/components/datatable/table.temp.html',
        controller: Controller,
        controllerAs: '$kstableCtrl',
        bindToController: true,
        scope: {
            checkable: '@?checkable' ,
            progress: '=?mdProgress',
            selected: '=?ngModel',
            rowSelect: '=tableRowSelect' ,
            dataprovider: '=?dataprovider' ,
            scrollWidth:'@?scrollWidth'
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
                //
                // console.info('children' ,$element.children().eq(0))
                // console.info('children' ,$element.children().eq(1))
                // console.info('children' ,$element.children().eq(2))
                $kstableCtrl.init();

                if($kstableCtrl.fixleft||$kstableCtrl.fixright) {
                  if(!$kstableCtrl.scrollWidth)  $kstableCtrl.scrollWidth = 1500; //min-width
                    var kstable = $element[0].querySelector('.ks-table-container');
                    kstable.querySelector('table').style.width = $kstableCtrl.scrollWidth+'px';
                    var colwidth = $kstableCtrl.scrollWidth/$kstableCtrl.$$columnDefs.length;
                    $kstableCtrl.$$columnDefs.map(val =>{
                            if(val.fixed) val.width = colwidth+'px';
                    })
                }

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


function Controller($scope,$element,$attrs, $q,$tableUtil,datatableService) {
    var $kstableCtrl = this;     var watchListener,modelChangeListeners = [];
    $kstableCtrl.$$hash = new $tableUtil.Hash();
    $kstableCtrl.$$columnDefs = [];
    $kstableCtrl.$$fixrightColumnDefs = [];////to do
    $kstableCtrl.$$fixleftColumnDefs = [];

    $kstableCtrl.findTableElement = function(){
      return $element[0];
    }
    $kstableCtrl.findMaskElement = function(){
      return $kstableCtrl.findTableElement().querySelector('.ks-tablerow-mask');
    }

    $kstableCtrl.pushColumnsDef = function(coldef){
        $kstableCtrl.$$columnDefs.push(coldef);
      console.log('%c push' ,'color:red' ,$kstableCtrl.$$columnDefs)
    };//to do

    $kstableCtrl.init = function(){
        checkfix();
        this.fixleft = hasFixleft();
        this.fixright = hasFixright();
        this.$$fixleftColumnDefs   = datatableService.fixLeftColDefs(this.$$columnDefs);
        this.$$fixrightColumnDefs = datatableService.fixRightColDefs(this.$$columnDefs);

        console.log('%c fixright coldefs' ,'color:red',this.$$fixrightColumnDefs)
    }
    $kstableCtrl.addScrollEvent = function(elm){
      datatableService.addScrollEvent(elm);
    }

    $kstableCtrl.onRowNotHover = function($index,event){
      var childIndex = $index +1;
      var rows = $kstableCtrl.findTableElement().querySelectorAll('table tbody tr:nth-child('+childIndex+')')
      angular.element(rows).toggleClass('ks-row-hover');
    }

    $kstableCtrl.onRowHover = function($index,event){
        // var styles = getComputedStyle(event.target);
        // var maskElm = $kstableCtrl.findMaskElement();
        // maskElm.style.display = "block";
        // maskElm.style['background-color'] = 'rgba(224, 224, 224,0.4)';
        // maskElm.style.position = 'absolute';
        // var lineheight = purgeUnit(styles.height) +purgeUnit(styles.paddingTop)  +
        //   purgeUnit(styles.paddingBottom)
        // maskElm.style.height = lineheight+purgeUnit(styles.borderBottomWidth)+'px';
        // maskElm.style.top = lineheight*($index+1) + 'px';
        // console.info('maskElm.style.bottom' ,maskElm.style.bottom);

        var childIndex = $index +1;
        var rows = $kstableCtrl.findTableElement().querySelectorAll('table tbody tr:nth-child('+childIndex+')')
        angular.element(rows).toggleClass('ks-row-hover');
    }
    function purgeUnit(word){
      return parseInt(word.replace(/[px]?[em]?/g,''));
    }
    function checkfix(){
      var allfixFlag = true;
      $kstableCtrl.$$columnDefs.map(val =>{
        if(val.fixed !== 'true') allfixFlag = false; return false;
      });
      if(allfixFlag) throw  Error("you cant fix  all columns!");
    }

    function hasFixleft(){
      var length = $kstableCtrl.$$columnDefs.length;
      if(length == 0) return false;
      return $kstableCtrl.$$columnDefs[0].fixed === 'true'
    }

    function hasFixright(){
      var length = $kstableCtrl.$$columnDefs.length;
      if(length == 0) return false;
      return $kstableCtrl.$$columnDefs[length-1].fixed === 'true'
    }

    $kstableCtrl.validateModel = function () {
        if(!$kstableCtrl.selected) {
            return console.error('Row selection: ngModel is not defined.');
        }
        if(!angular.isArray($kstableCtrl.selected)) {
            return console.error('Row selection: Expected an array. Recived ' + typeof self.selected + '.');
        }
        return true;
    }

   //toggle selection
    $kstableCtrl.rowSelection = function(index,data){
        var idx = $kstableCtrl.selected.indexOf(data);
        var toggleflag = "1";  //0  uncheck  1 check
        if (idx > -1) {
            toggleflag = "0";
            $kstableCtrl.selected.splice(idx, 1);
        }else{
            $kstableCtrl.selected.push(data);
        }
        if($scope.rowSelect){
            $scope.rowSelect.apply(null,[toggleflag,index,data]);
        }
    }

    $kstableCtrl.toggleRowSelection = function(){
        //反向选取
        //已经全选 则全部取消
        if($kstableCtrl.selected.length === $kstableCtrl.dataprovider.length){
            $kstableCtrl.selected.splice(0,$kstableCtrl.selected.length);
        }else if($kstableCtrl.selected.length === 0){
            angular.forEach($kstableCtrl.dataprovider,(item,index) =>{
                $kstableCtrl.selected.push(item);
            })
        }else{
            angular.forEach($kstableCtrl.dataprovider,(item,index) =>{
                var selectedIndex = $kstableCtrl.selected.indexOf(item);
                if(selectedIndex > -1) {
                    $kstableCtrl.selected.splice(selectedIndex,1);
                }else{
                    $kstableCtrl.selected.push(item);
                }
            })
        }
    }

    $kstableCtrl.$renderChecked =function(item){
        return $kstableCtrl.selected.indexOf(item) > -1;
    }

    $kstableCtrl.enableRowSelection = function() {
        $kstableCtrl.$$rowSelect = true;
        watchListener = $scope.$watchCollection('$kstableCtrl.selected', function (selected) {
            modelChangeListeners.forEach(function (listener) {
                listener(selected);
            });
        });

    }

    $kstableCtrl.disableRowSelection = function() {
        $kstableCtrl.$$rowSelect = false;
        if(angular.isFunction(watchListener)) {
            watchListener();
        }

    }

    $kstableCtrl.getElement = function () {
        return $element;
    };

    $kstableCtrl.enableMultiSelect = function () {
        return $attrs.multiple === '' || $scope.$eval($attrs.multiple);
    };

    $kstableCtrl.waitingOnPromise = function () {
        return !!queue.length;
    };



}

Controller.$inject = ['$scope','$element','$attrs','$q', '$tableUtil','datatableService'];
