import ksTable from './datatable';
import ksColumn from './column';
import KsColumnRender from './columnRender';
import ksCellRender from './ksCellRender';

//import {fixLeftFilter,fixRightFilter} from './fixfilter';
import datatableService from './datatableService';
import tableUtilProvider from './tableUtil';
export default angular.module('ks.components.datatable',['material.core'])
 .directive('ksTable',ksTable)
 .directive('ksColumn',ksColumn)
    .directive('ksColumnRender',KsColumnRender)
    .directive('ksCellRender' ,ksCellRender)
 .service('datatableService' ,datatableService)
 .provider('$tableUtil',tableUtilProvider);
