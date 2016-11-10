/**
 * Created by huangsihuan on 2016/11/5.
 */
export default function mdToolbarDirective($mdTheming) {
    return {
        template: '',
        restrict: 'E',
        link: function (scope, element, attr) {
            element.addClass('_md');     // private md component indicator for styling
            $mdTheming(element);
            // Wait for $mdContentLoaded event from mdContent directive.
            //和kscontent一起用的 （panel中）等待事件完成
            scope.$on('$mdContentLoaded', onMdContentLoad);
            function onMdContentLoad($event, newContentEl) {
                // Toolbar and content must be siblings
                if (newContentEl && element.parent()[0] === newContentEl.parent()[0]) {
                    // unhook old content event listener if exists
                }
            }
        }

    }
}
