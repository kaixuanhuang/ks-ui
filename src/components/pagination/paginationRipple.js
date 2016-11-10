/**
 * Created by huangsihuan on 2016/11/6.
 */


export default function KsPaginationDiretive($mdInkRipple) {
    return {
        attach: function attachRipple(scope, element, options) {
            options = angular.extend(optionsForElement(element), options);

            return $mdInkRipple.attach(scope, element, options);
        }
    };
    function optionsForElement(element) {
        return {
            fitRipple: false,
            center: true,
            dimBackground: false,
        };
    }
}
