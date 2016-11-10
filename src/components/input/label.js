/**
 * Created by huangsihuan on 2016/10/31.
 */
//将lable给container
export default function labelDirective() {
    return {
        restrict: 'E',
        require: '^?ksField',
        link: function(scope, element, attr, containerCtrl) {
            console.info('label',containerCtrl)
            if (!containerCtrl|| element.hasClass('ks-container-ignore')) return;

            containerCtrl.label = element;
            scope.$on('$destroy', function() {
                containerCtrl.label = null;
            });
        }
    };
}
