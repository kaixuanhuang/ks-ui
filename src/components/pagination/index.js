/**
 * Created by huangsihuan on 2016/11/6.
 */
import KsPaginationDiretive from './pagination';
import KsPaginationInlRipple from './paginationRipple';
export default angular.module('ks.components.pagination',['material.core'])
      .directive('ksPagination' ,KsPaginationDiretive)
      .directive('paginationInkRipple',PaginationInkRipple)
       .factory('$mdPaginationInkRipple', KsPaginationInlRipple);


function PaginationInkRipple ($mdPaginationInkRipple) {
    return {
        controller: angular.noop,
        link:       function (scope, element, attr) {
            console.info('paginationInkRipple')
            if(attr.hasOwnProperty('paginationInkRipple')){
                $mdPaginationInkRipple.attach(scope, element);
            }


        }
    };
}

