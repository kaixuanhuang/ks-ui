/**
 * Created by huangsihuan on 2016/11/12.
 */
//controllerAs $tableCtrl
//import datatableService from './datatableService';
let {isArray,isFunction,forEach} = angular;

export default class TableController {
    static $inject = ['$scope','$element','$attrs','$q', '$tableUtil','datatableService'];
    constructor($scope,$element,$attrs, $q,$tableUtil,datatableService) {
        this.$$columnDefs = [];
        this.$$fixleftColumnDefs = [];
        this.$$fixrightColumnDefs = [];
        this.watchListener = [];
        this.modelChangeListeners = [];////to do
        this.$$hash = new $tableUtil.Hash();

        this.datatableService = datatableService;
        this.$element = $element;
    }


   active =(type,$index)=> {
        console.info('type' ,type)
        console.info('type' ,$index)
    };

    getElement = ()=>{
        return this.$element;
    };

    findTableElement = ()=>{
        return this.$element[0];
    }
    //废弃的
    findMaskElement = ()=>{
        return this.findTableElement().querySelector('.ks-tablerow-mask');
    }

    pushColumnsDef = coldef => {
        this.$$columnDefs.push(coldef);
        console.log('%c push' ,'color:red' ,this.$$columnDefs)
    };//to do


    checkfix = ()=>{
        let allfixFlag = true;
        this.$$columnDefs.map(val =>{
            if(val.fixed !== 'true') allfixFlag = false; return false;
        });
        if(allfixFlag) throw  Error("you cant fix  all columns!");
    }

    init = ()=>{
        this.checkfix();
        this.fixleft = this.hasFixleft();
        this.fixright = this.hasFixright();
        this.$$fixleftColumnDefs   = this.datatableService.fixLeftColDefs(this.$$columnDefs);
        this.$$fixrightColumnDefs = this.datatableService.fixRightColDefs(this.$$columnDefs);
        console.log('%c leftright coldefs' ,'color:red',this.$$fixleftColumnDefs)
        console.log('%c fixright coldefs' ,'color:red',this.$$fixrightColumnDefs)
    }

    //有fix的情况下要 处理滚动
    addScrollEvent = elm=>{
        this.datatableService.addScrollEvent(elm);
    }
   onRowNotHover = ($index,event)=>{
        let childIndex = $index +1;
        let rows = this.findTableElement().querySelectorAll('table tbody tr:nth-child('+childIndex+')')
        angular.element(rows).toggleClass('ks-row-hover');
    }

/*    function purgeUnit(word){
        return parseInt(word.replace(/[px]?[em]?/g,''));
    }*/
    onRowHover = ($index,event)=>{
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

        let childIndex = $index +1;
        let rows = this.findTableElement().querySelectorAll('table tbody tr:nth-child('+childIndex+')')
        angular.element(rows).toggleClass('ks-row-hover');
    }



    hasFixleft = ()=>{
        let length = this.$$columnDefs.length;
        if(length == 0) return false;
        return this.$$columnDefs[0].fixed === 'true'
    }

    hasFixright= ()=> {
        let length = this.$$columnDefs.length;
        if(length == 0) return false;
        return this.$$columnDefs[length-1].fixed === 'true'
    }

    validateModel = ()=>{
        if(!this.selected) {
            return console.error('Row selection: ngModel is not defined.');
        }
        if(!isArray(this.selected)) {
            return console.error('Row selection: Expected an array. Recived ' + typeof this.selected + '.');
        }
        return true;
    }

    //toggle selection
    rowSelection = (index,data)=>{
        let idx = this.selected.indexOf(data);
        let toggleflag = "1";  //0  uncheck  1 check
        if (idx > -1) {
            toggleflag = "0";
            this.selected.splice(idx, 1);
        }else{
            this.selected.push(data);
        }
        if($scope.rowSelect){
            $scope.rowSelect.apply(null,[toggleflag,index,data]);
        }
    }

    toggleRowSelection = ()=>{
        //反向选取
        //已经全选 则全部取消
        if(this.selected.length === this.dataprovider.length){
            this.selected.splice(0,this.selected.length);
        }else if(this.selected.length === 0){
            forEach(this.dataprovider,(item,index) =>{
                this.selected.push(item);
            })
        }else{
            forEach(this.dataprovider,(item,index) =>{
                var selectedIndex = this.selected.indexOf(item);
                if(selectedIndex > -1) {
                    this.selected.splice(selectedIndex,1);
                }else{
                    this.selected.push(item);
                }
            })
        }
    }

    $renderChecked = item=>{
        return this.selected.indexOf(item) > -1;
    }

    enableRowSelection = ()=> {
        this.$$rowSelect = true;
        watchListener = $scope.$watchCollection('$kstableCtrl.selected', function (selected) {
            modelChangeListeners.forEach(function (listener) {
                listener(selected);
            });
        });

    }

    disableRowSelection = ()=>{
        this.$$rowSelect = false;
        if(isFunction(this.watchListener)) {
            watchListener();
        }
    }

    enableMultiSelect = ()=>{
        return $attrs.multiple === '' || $scope.$eval($attrs.multiple);
    };

    waitingOnPromise = ()=>{
        return !!queue.length;
    };



}
