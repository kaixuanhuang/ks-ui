/**
 * Created by huangsihuan on 2016/11/5.
 */

import  ksContentDirective from './content';
export default angular.module('ks.components.content', ['material.core'])
    .directive('ksContent', ksContentDirective);