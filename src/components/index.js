/**
 * Created by huangsihuan on 2016/11/5.
 */
import table from './datatable/index';
import checkbox from './checkbox/index'
import panel from './panel/index';
import toolbar from './toolbar/index';
import content from './content/index';
import whiteframe from './whiteframe/index';
import button from './button/index';
import icon from './icon/index';
import pagination from './pagination/index';
import input from './input/index';

import wave from './wave/index';
export default angular.module('ks.component' ,[
    input.name,
    table.name,
    checkbox.name,
    panel.name,
    toolbar.name,
    content.name,
    whiteframe.name,
    button.name,
    icon.name,
    pagination.name,
    wave.name
]);
