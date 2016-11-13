/**
 * Created by huangsihuan on 2016/11/13.
 */

import CompilerService from './service/CompilerService';
import InterimElementProvider from './service/InterimElementProvider';
import ColorUtilFactory from './ColorUtilFactory';
import UtilFactory from './UtilFactory';
import ThemeConst from './ThemeConst';
import KeyConstant from './constant';
export default  angular.module('material.core',[])
    .provider('$$interimElement', InterimElementProvider)
    .factory('$mdColorUtil', ColorUtilFactory)
    .factory('$mdUtil' ,UtilFactory)
    .service('$compilerUtil' ,CompilerService)
    .factory('$ksConstant', KeyConstant)
    .constant("$MD_THEME_CSS",ThemeConst);