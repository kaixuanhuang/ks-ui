/**
 * Created by huangsihuan on 2016/11/13.
 */

export default function UtilFactory($timeout,$rootScope) {
    var nextUniqueId = 0;
    let $mdUtil =  {
        nextUid: function() {
            return '' + nextUniqueId++;
        },
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

    //$mdUtil.dom.animator = $$mdAnimate($mdUtil);
    return $mdUtil;
}
