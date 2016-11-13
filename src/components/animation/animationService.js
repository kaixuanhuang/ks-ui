/**
 * Created by huangsihuan on 2016/11/12.
 */
let {forEach} = angular;
var WEBKIT = isDefined(document.documentElement.style.WebkitAppearance);


/**
 * requestAnimationFrame
 */
export default class AnimationService{
    static $inject = ['$$rAF'];
    constructor($$rAF){
        this.rafWaitQueue = [];
    }

    getDomNode = element =>{
        for (let i = 0; i < element.length; i++) {
            if (element[i].nodeType === 1) return element[i];
        }
    }


     applyAnimationFromStyles = (element, options)=>{
        if (options.from) {
            element.css(options.from);
            options.from = null;
        }
    }

    applyAnimationToStyles = (element, options)=>{
        if (options.to) {
            element.css(options.to);
            options.to = null;
        }
    }

    /**
     *  options 动画执行完毕需要添加和 移除的 class
     */
    applyClasses = (element, options)=>{
        if (options.addClass) {
            $$jqLite.addClass(element, options.addClass);
            options.addClass = null;
        }
        if (options.removeClass) {
            $$jqLite.removeClass(element, options.removeClass);
            options.removeClass = null;
        }
    }
    /**
     * 从 选项里 给元素添加css  from   to
     * @param element
     * @param options
     */
     applyAnimationStyles = (element, options)=>{
        this.applyAnimationFromStyles(element, options);
        this.applyAnimationToStyles(element, options);
    }



    parseMaxTime = str=> {
        let maxValue = 0;
        var values = (str || "").split(/\s*,\s*/);
        forEach(values, value=> {
            if (value.charAt(value.length - 1) == 's') {
                value = value.substring(0, value.length - 1);
            }
            value = parseFloat(value) || 0;
            maxValue = maxValue ? Math.max(value, maxValue) : value;
        });
        return maxValue;
    }

    /**
     * 取过渡持续事件 与 动画持续时间的最大者 为 duration
     * @param element
     * @returns {{duration: number, delay: number, animationDuration: *, transitionDuration: *, animationDelay: *, transitionDelay: *}}
     */
    computeTimings = element=> {
        let node = this.getDomNode(element);
        let cs = $window.getComputedStyle(node);
        //过渡持续时间
        let tdr = parseMaxTime(cs[prop('transitionDuration')]);
        //过渡推迟时间
        let tdy = parseMaxTime(cs[prop('transitionDelay')]);
        //动画持续事件
        let adr = parseMaxTime(cs[prop('animationDuration')]);
        //动画推迟时间
        let ady = parseMaxTime(cs[prop('animationDelay')]);

        //动画持续时间 = 动画持续时间 * 迭代数目
        adr *= (parseInt(cs[prop('animationIterationCount')], 10) || 1);
        var duration = Math.max(adr, tdr);
        var delay = Math.max(ady, tdy);

        return {
            duration: duration,
            delay: delay,
            animationDuration: adr,
            transitionDuration: tdr,
            animationDelay: ady,
            transitionDelay: tdy
        };

        let prop = key =>{
            return WEBKIT ? 'Webkit' + key.charAt(0).toUpperCase() + key.substr(1)
                : key;
        }
    }




    waitUntilQuiet = callback=> {
        if (this.cancelLastRAFRequest) {
            cancelLastRAFRequest(); //cancels the request
        }
        this.rafWaitQueue.push(callback);
        cancelLastRAFRequest = $$rAF(function() {
            cancelLastRAFRequest = null;

            // DO NOT REMOVE THIS LINE OR REFACTOR OUT THE `pageWidth` variable.
            // PLEASE EXAMINE THE `$$forceReflow` service to understand why.
            var pageWidth = $$forceReflow();

            // we use a for loop to ensure that if the queue is changed
            // during this looping then it will consider new requests
            for (var i = 0; i < rafWaitQueue.length; i++) {
                rafWaitQueue[i](pageWidth);
            }
            rafWaitQueue.length = 0;
        });
    }

}
