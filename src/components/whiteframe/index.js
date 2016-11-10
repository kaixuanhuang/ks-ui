/**
 * Created by huangsihuan on 2016/11/5.
 */
import KsWhiteframeDirective from './whiteframe';
export default  angular
    .module('ks.components.whiteframe', ['material.core'])
    .directive('whiteframe', KsWhiteframeDirective);