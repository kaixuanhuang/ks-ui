/**
 * Created by huangsihuan on 2016/11/3.
 */
(function(angular){
    angular.module('material.core',[])
        .factory('$mdUtil' ,UtilFactory)
        .factory('$mdColorUtil', ColorUtilFactory);



function UtilFactory($timeout,$rootScope) {
    var $mdUtil =  {
        parseAttributeBoolean: function (value, negatedCheck) {
            return value === '' || !!value && (negatedCheck === false || value !== 'false' && value !== '0');
        },
        fakeNgModel: function () {
            return {
                $fake: true,
                $setTouched: angular.noop,
                $setViewValue: function (value) {
                    this.$viewValue = value;
                    this.$render(value);
                    this.$viewChangeListeners.forEach(function (cb) {
                        cb();
                    });
                },
                $isEmpty: function (value) {
                    return ('' + value).length === 0;
                },
                $parsers: [],
                $formatters: [],
                $viewChangeListeners: [],
                $render: angular.noop
            };
        },
        /**
         * Create an implicit getter that caches its `getter()`
         * lookup value
         */
        valueOnUse : function (scope, key, getter) {
            var value = null, args = Array.prototype.slice.call(arguments);
            var params = (args.length > 3) ? args.slice(3) : [ ];

            Object.defineProperty(scope, key, {
                get: function () {
                    if (value === null) value = getter.apply(scope, params);
                    return value;
                }
            });
        },

        nextTick: function(callback, digest, scope) {
            //-- grab function reference for storing state details
            var nextTick = $mdUtil.nextTick;
            var timeout = nextTick.timeout;
            var queue = nextTick.queue || [];
            //-- add callback to the queue
            queue.push({scope: scope, callback: callback});
            if (digest == null) digest = true;
            nextTick.digest = nextTick.digest || digest;
            nextTick.queue = queue;
            return timeout || (nextTick.timeout = $timeout(processQueue, 0, false));

            function processQueue() {
                var queue = nextTick.queue;
                var digest = nextTick.digest;

                nextTick.queue = [];
                nextTick.timeout = null;
                nextTick.digest = false;

                queue.forEach(function(queueItem) {
                    var skip = queueItem.scope && queueItem.scope.$$destroyed;
                    if (!skip) {
                        queueItem.callback();
                    }
                });

                if (digest) $rootScope.$digest();
            }
        },
        //copy from jquery
        getClosest: function getClosest(el, validateWith, onlyParent) {
            if ( angular.isString(validateWith) ) {
                var tagName = validateWith.toUpperCase();
                validateWith = function(el) {
                    return el.nodeName.toUpperCase() === tagName;
                };
            }

            if (el instanceof angular.element) el = el[0];
            if (onlyParent) el = el.parentNode;
            if (!el) return null;

            do {
                if (validateWith(el)) {
                    return el;
                }
            } while (el = el.parentNode);

            return null;
        },
    }
    return $mdUtil;
}





        function ColorUtilFactory() {
            /**
             * Converts hex value to RGBA string
             * @param color {string}
             * @returns {string}
             */
            function hexToRgba (color) {
                var hex   = color[ 0 ] === '#' ? color.substr(1) : color,
                    dig   = hex.length / 3,
                    red   = hex.substr(0, dig),
                    green = hex.substr(dig, dig),
                    blue  = hex.substr(dig * 2);
                if (dig === 1) {
                    red += red;
                    green += green;
                    blue += blue;
                }
                return 'rgba(' + parseInt(red, 16) + ',' + parseInt(green, 16) + ',' + parseInt(blue, 16) + ',0.1)';
            }

            /**
             * Converts rgba value to hex string
             * @param color {string}
             * @returns {string}
             */
            function rgbaToHex(color) {
                color = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

                var hex = (color && color.length === 4) ? "#" +
                ("0" + parseInt(color[1],10).toString(16)).slice(-2) +
                ("0" + parseInt(color[2],10).toString(16)).slice(-2) +
                ("0" + parseInt(color[3],10).toString(16)).slice(-2) : '';

                return hex.toUpperCase();
            }

            /**
             * Converts an RGB color to RGBA
             * @param color {string}
             * @returns {string}
             */
            function rgbToRgba (color) {
                return color.replace(')', ', 0.1)').replace('(', 'a(');
            }

            /**
             * Converts an RGBA color to RGB
             * @param color {string}
             * @returns {string}
             */
            function rgbaToRgb (color) {
                return color
                    ? color.replace('rgba', 'rgb').replace(/,[^\),]+\)/, ')')
                    : 'rgb(0,0,0)';
            }

            return {
                rgbaToHex: rgbaToHex,
                hexToRgba: hexToRgba,
                rgbToRgba: rgbToRgba,
                rgbaToRgb: rgbaToRgb
            };
        }


}
)(window.angular);


