/**
 * Created by huangsihuan on 2016/11/12.
 */
class AnamationCss{
    static $inject = ['$animate','animateService'];
    constructor($animate){
        this.$animate = $animate;
        this.animateService = animateService;
    }

    /**
     * interface options {
     *   addClass:string,  //动画执行完毕 需要添加的className
     *   removeClass:string,//动画执行完毕 需要移除的className
     *   ｝
     * @param element
     * @param options
     * @returns {{close: *, start: (function())}}
     */
    init = (element,options)=>{
        //存放临时样式
        let temporaryStyles = [];
        let node = this.animateService.getDomNode(element);
        var areAnimationsAllowed = node && this.$animate.enabled();

        let hasCompleteStyles = flase;
        let hasCompleteClasses = false;
        if (areAnimationsAllowed) {
            //transition keyframes delay duration
            if (options.transitionStyle) temporaryStyles.push([PREFIX + 'transition', options.transitionStyle]);
            if (options.keyframeStyle)  temporaryStyles.push([PREFIX + 'animation', options.keyframeStyle]);
            if (options.delay)  temporaryStyles.push([PREFIX + 'transition-delay', options.delay + 's']);
            if (options.duration) temporaryStyles.push([PREFIX + 'transition-duration', options.duration + 's']);

            hasCompleteStyles = options.keyframeStyle || (options.to && (options.duration > 0 || options.transitionStyle));
            hasCompleteClasses = !!options.addClass || !!options.removeClass;

            //阻塞 element transition  delay-9999s
            this.blockTransition(element, true);
        }

        //是否有完整的动画
        let hasCompleteAnimation = areAnimationsAllowed && (hasCompleteStyles || hasCompleteClasses);
        //从样式 应用 动画  element  -option. from
        this.animateService.applyAnimationFromStyles(element, options);

        let animationClosed = false;
        let events, eventFn;

        return {
            close: $window.close,
            start: ()=>{

                let runner = new $$AnimateRunner();
                waitUntilQuiet(callback);
                return runner;

                //返回close方式  ，供外部 适时 关闭
                let close = ()=>{
                    if (animationClosed) return;
                    animationClosed = true;

                    if (events && eventFn) element.off(events, eventFn);
                    //options 添加和 移除的 className
                    this.animateService.applyClasses(element, options);
                    //给元素添加css from to
                    this.animateService.applyAnimationStyles(element, options);
                    //style附上 临时的属性
                    forEach(temporaryStyles, entry=>{
                        node.style[this.camelCase(entry[0])] = '';
                    });
                    runner.complete(true);
                    return runner;
                }

                let callback = ()=>{
                    //element transition  delay  -9999s  -> ''
                    //随即动画执行
                    this.blockTransition(element, false);
                    if (!hasCompleteAnimation) {
                        return close();
                    }


                    applyClasses(element, options);
                    forEach(temporaryStyles, entry=> {
                        let key = entry[0];
                        let value = entry[1];
                        node.style[camelCase(key)] = value;
                    });

                    //{最大持续时间 最大推迟时间  过渡/动画 持续时间 推迟时间}
                    let timings = computeTimings(element);
                    if (timings.duration === 0) return close();

                    let moreStyles = [];
                    if (options.easing) {
                        if (timings.transitionDuration) moreStyles.push([PREFIX + 'transition-timing-function', options.easing]);
                        if (timings.animationDuration) moreStyles.push([PREFIX + 'animation-timing-function', options.easing]);
                    }

                    if (options.delay && timings.animationDelay) moreStyles.push([PREFIX + 'animation-delay', options.delay + 's']);
                    if (options.duration && timings.animationDuration) moreStyles.push([PREFIX + 'animation-duration', options.duration + 's']);

                    forEach(moreStyles, function(entry) {
                        let key = entry[0];
                        let value = entry[1];
                        node.style[camelCase(key)] = value;
                        temporaryStyles.push(entry);
                    });

                    let maxDelay = timings.delay;
                    let maxDelayTime = maxDelay * 1000;

                    let maxDuration = timings.duration;
                    let maxDurationTime = maxDuration * 1000;

                    let startTime = Date.now();
                    events = [];
                    if (timings.transitionDuration) events.push(TRANSITION_EVENTS);
                    if (timings.animationDuration) events.push(ANIMATION_EVENTS);
                    events = events.join(' ');
                    eventFn = event=>{
                        event.stopPropagation();
                        var ev = event.originalEvent || event;
                        var timeStamp = ev.timeStamp || Date.now();
                        var elapsedTime = parseFloat(ev.elapsedTime.toFixed(3));
                        if (Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration) {
                            close();
                        }
                    };
                    element.on(events, eventFn);

                    applyAnimationToStyles(element, options);
                    //如果不手动调用 close   那么最大推迟时间+ 持续时间*1.5 后调用close
                    $timeout(close, maxDelayTime + maxDurationTime * 1.5, false);
                }



                let waitUntilQuiet = callback =>{
                    if (cancelLastRAFRequest) {
                        cancelLastRAFRequest(); //cancels the request
                    }
                    rafWaitQueue.push(callback);
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
        }
    }


    blockTransition = (element, bool)=>{
        let node = this.getDomNode(element);
        var key = camelCase(PREFIX + 'transition-delay');
        node.style[key] = bool ? '-9999s' : '';
    }

    /**
     * e.g.
     *  样式名称 中线表示 ->小驼峰
     */
    camelCase(str) {
        return str.replace(/-[a-z]/g, str =>{
            return str.charAt(1).toUpperCase();
        });
    }

}
