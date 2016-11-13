/**
 * Created by huangsihuan on 2016/10/31.
 */

import KsSelectDirective from './ksSelect';
import SelectProvider from './ksSelectProvider';
export default angular.module('ks.component.select', [
    'material.core'
])
    .directive('ksSelect' ,KsSelectDirective)
    .provider('$mdSelect', SelectProvider);

