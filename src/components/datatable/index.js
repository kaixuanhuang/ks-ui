import ksTable from './datatable';
import ksColumn from './column';
import ksRowRender from './ksRowRender';
//import {fixLeftFilter,fixRightFilter} from './fixfilter';
import datatableService from './datatableService';
import tableUtilProvider from './tableUtil';
export default angular.module('ks.components.datatable',['material.core'])
 .directive('ksTable',ksTable)
 .directive('ksColumn',ksColumn)
    .directive('ksCellRender' ,ksRowRender)
 .service('datatableService' ,datatableService)
 .provider('$tableUtil',tableUtilProvider);
