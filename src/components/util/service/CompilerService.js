/**
 * Created by huangsihuan on 2016/11/13.
 */

let {isString,forEach,extend} = angular;
export default class MdCompilerService {
    static $inject = ['$q', '$templateRequest', '$injector', '$compile', '$controller'];
    constructor($q, $templateRequest, $injector, $compile, $controller){
        this.$q = $q;
        this.$templateRequest = $templateRequest;
        this.$injector = $injector;
        this.$compile = $compile;
        this.$controller = $controller;
    }

    /**
     * 提供选项
     * @param options
     * @returns {!Object}
     */
    compile = options=>{
        if (options.contentElement) {
            return this._prepareContentElement(options);
        } else {
            return this._compileTemplate(options);
        }
    };

    _prepareContentElement = options=>{
        var contentElement = this._fetchContentElement(options);
        return this.$q.resolve({
            element: contentElement.element,
            cleanup: contentElement.restore,
            locals: {},
            link:  ()=> contentElement.element
        })
   }

    _fetchContentElement = options=>{

    var contentEl = options.contentElement;
    var restoreFn = null;

    if (isString(contentEl)) {
        contentEl = document.querySelector(contentEl);
        restoreFn = createRestoreFn(contentEl);
    } else {
        contentEl = contentEl[0] || contentEl;
        // When the element is visible in the DOM, then we restore it at close of the dialog.
        // Otherwise it will be removed from the DOM after close.
        if (document.contains(contentEl)) {
            restoreFn = createRestoreFn(contentEl);
        } else {
            restoreFn = function() {
                contentEl.parentNode.removeChild(contentEl);
            }
        }
    }

    return {
        element: angular.element(contentEl),
        restore: restoreFn
    };

    let createRestoreFn = element=>{
        var parent = element.parentNode;
        var nextSibling = element.nextElementSibling;

        return function() {
            if (!nextSibling) {
                parent.appendChild(element);
            } else {
                parent.insertBefore(element, nextSibling);
            }
        }
    }

}


    /**
     * 编译模版
     * 选项    templateUrl  ，template，resolve，locals，transformTemplate
     * @param options
     * @returns {*|Promise.<TResult>|Promise}
     * @private
     */
    _compileTemplate = options=> {
        let self = this;
        let templateUrl = options.templateUrl;
        let template = options.template || '';
        let transformTemplate = options.transformTemplate || angular.identity;

        // Take resolve values and invoke them.
        // Resolves can either be a string (value: 'MyRegisteredAngularConst'),
        // or an invokable 'factory' of sorts: (value: function ValueGetter($dependency) {})
        let locals = angular.extend({}, options.locals);
        let resolve = angular.extend({}, options.resolve);
        forEach(resolve, (value, key) =>{
            if (isString(value)) {
                resolve[key] = self.$injector.get(value);
            } else {
                resolve[key] = self.$injector.invoke(value);
            }
        });
        extend(resolve, locals);
        // Add the locals, which are just straight values to inject          // eg locals: { three: 3 }, will inject three into the controller
        if (templateUrl) {
            resolve.$$ngTemplate = this.$templateRequest(templateUrl);
        } else {
            resolve.$$ngTemplate = this.$q.when(template);
        }
        // Wait for all the resolves to finish if they are promises
        return this.$q.all(resolve).then(locals=> {
            let template = transformTemplate(locals.$$ngTemplate, options);
            let element = options.element || angular.element('<div>').html(template.trim()).contents();
            return self._compileElement(locals, element, options);
        });
    }


    /**
     *
     * @param locals
     * @param element
     * @param options
     * @returns {{element: *, cleanup: *, locals: *, link: linkFn}}
     * @private
     */
    _compileElement = (locals, element, options)=> {
        let self = this;
        let ngLinkFn = this.$compile(element);
        let compileData = {
            element: element,
            cleanup: element.remove.bind(element),
            locals: locals,
            link: linkFn
        };

        let linkFn = scope=>{
            locals.$scope = scope;
            // Instantiate controller if the developer provided one.
            if (options.controller) {
                let injectLocals = extend(locals, {$element: element});
                let invokeCtrl = self.$controller(options.controller, injectLocals, true, options.controllerAs);
                if (options.bindToController) extend(invokeCtrl.instance, locals);
                var ctrl = invokeCtrl();
                // Unique identifier for Angular Route ngView controllers.
                element.data('$ngControllerController', ctrl);
                element.children().data('$ngControllerController', ctrl);
                // Expose the instantiated controller to the compile data
                compileData.controller = ctrl;
            }
            // Invoke the Angular $compile link function.
            return ngLinkFn(scope);
        }
        return compileData;
    }

}
