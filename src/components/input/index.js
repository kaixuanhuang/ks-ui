/**
 * Created by huangsihuan on 2016/10/31.
 */
import labelDirective from './label';
import ksFieldDirective from './ksfield';
export default angular.module('ks.component.input', [
    'material.core'
])
    .directive('ksField', ksFieldDirective)
    .directive('label', labelDirective)
   //.directive('input', inputTextareaDirective);

