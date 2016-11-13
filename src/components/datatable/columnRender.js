/**
 * Created by huangsihuan on 2016/11/12.
 */
export default function KsColumnRenderDirective(){
    return {
        require: '^^ksColumn',
        link:function postLink(scope,element,attrs,ctrl){
            ctrl.addRender(element.children().eq(0).html())
        }
    }
}
