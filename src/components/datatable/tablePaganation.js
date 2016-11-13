/**
 * Created by huangsihuan on 2016/11/8.
 */
export default function(){
    return {
        template:'' ,
        require:'^^ksTable',
        bindToController: {
            boundaryLinks: '=?mdBoundaryLinks',
            disabled: '=ngDisabled',
            limit: '=mdLimit',
            page: '=mdPage',
            pageSelect: '=?mdPageSelect',
            onPaginate: '=?mdOnPaginate',
            limitOptions: '=?mdLimitOptions',
            total: '@mdTotal'
        },
        controllerAs: '$pagination',
        scope:{},
        link:function postLink(scope,element,attrs,ctrl){
            ctrl.setPaginationInfo();
            var url = ctrl.getUrl();
        },
        controller:['$scope','injector',function Controller($scope,$injector){
            var $pagination = this;
            $pagination.total = function(url){
                var $$resource =  $injector.get('resourceName');
            }
        }]
    }

}
