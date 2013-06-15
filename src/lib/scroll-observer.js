/**
 * @author: xuweichen
 * @date: 13-5-30 上午9:57
 * @descriptions 监控dom元素是否在浏览器可视区
 * TODO: add comments and demos
 */

;(function ($, WIN, exports){
    var NOOP = function(){},
        DOC = WIN.document,
        hasVisible = false;

    function bindScrollEvent(fn){
        $(WIN).bind('scroll', fn);
        $(WIN).bind('resize', function(){
            ScrollObserver.visibleHeight = getVisibleHeight();
        });
    }
    /**
     * @param {int} offsetTop, scrollTop
     */
    function isVisible(offsetTop, top, height){
        var visibleHeight =  ScrollObserver.visibleHeight;
        return (top  < (visibleHeight + offsetTop)) && (top+height>offsetTop)

    }

    function getObjectByDom(objs, dom){
        var i = 0,
            current,
            len = objs.length;

        for(;i<len;i++){
            current = objs[i];
            if(current.dom[0] === dom[0]) {
                return {
                    obj: current,
                    index: i
                };
            }
        }
    }

    function triggerVisibleChange(observed){
        //observed
    }
    function getVisibleHeight(){
        return WIN.innerHeight||$('html').offset().height
    }
    /**
     *
     * @constructor
     */
    function ScrollObserver(options){
        var self = this;

        self.options = {
            delay: 800
        }
        $.extend(self.options, options||{});
        self.observed = [];
        self._lastVisibleIndex = 0;

        self.__scrollHandler = function(delay){
            clearTimeout(self._timer);
            self._timer = setTimeout(function (){

                var offsetTop = DOC.documentElement.scrollTop + DOC.body.scrollTop;

                self.__checkWith(offsetTop);
            }, (delay>-1)||self.options.delay);

        }
        ScrollObserver.visibleHeight = getVisibleHeight();
        bindScrollEvent(this.__scrollHandler);
    }

    ScrollObserver.prototype = {
        constructor: ScrollObserver,
        /**
         * observe doms specified
         * @param doms
         */
        observe: function(doms){
            var self = this,
                observed = self.observed;

            doms.each(function(dom){
                observed.push({
                    dom: dom,
                    visible: false,
                    offset: dom.offset()
                });
            });
        },
        /**
         * TODO: support it
         * stop observing doms specified
         * @param doms
         */
        unObserve: function(doms){

        },
        /**
         *
         * @param dom
         */
        update: function(dom, fn){
            var self = this,
                index,
                objInfo = getObjectByDom(self.observed, dom);

            if(objInfo){
                index = objInfo.index;
                self.observed.slice(index).each(function (item){
                    self._updateOffset(item);
                });
                fn ? fn() : self.__scrollHandler(0);
            }else{
                self.updateAll();
            }
        },
        updateAll: function(fn){
            var self = this;
            self.observed.each(function (item){
                self._updateOffset(item);
            });
            fn ? fn() : self.__scrollHandler(0);
        },
        _updateOffset: function(obj){
            obj.offset = obj.dom.offset();
        },
        _stop: function(){

        },
        _start: function(){

        },
        /**
         * check visibility width offsetTop specified, and trigger status-change event
         * @param offsetTop
         * @private
         */
        __checkWith: function(offsetTop){
            if(offsetTop<0) return;

            var self = this,
                visibles = [],
                i, v,
                current,
                observed = self.observed,
                len = observed.length,
                lastIndex = self._lastVisibleIndex;

            for(i=lastIndex; i<len; i++){
                current = observed[i];
                v = isVisible(offsetTop, current.offset.top, current.offset.height);
                if(v!==current.visible){
                    //trigger change event when status change
                    //console.log(v);
                    current.dom.trigger('change', {arguments: [v]});
                }
                current.visible = v;
                if(v == true){
                    //hasVisible = true;
                    visibles.push(current);
                }else if(hasVisible){
                    break;
                }
            }
            hasVisible = false;
            (visibles.length) && triggerVisibleChange(visibles);
        }
    }
    return exports.ScrollObserver = ScrollObserver;

})(cQuery, window, cQuery);