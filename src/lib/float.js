/**
 * float module for cQuery
 * this module just supports floating to top
 * @TODO: to support float to bottom
 * @module
 *
 */
(function (C, WIN, exports) {
    var NOOP = function () { },
        WIN = window,
        DOC = WIN.document,
        isIE6 = C.browser.isIE6;

    /**
     *
     * @param options
     * <code>
     *     {
        *         container: CDOM ,
        *         startPos: int (optical),
        *         offsetTop: int (optical),
        *         onScroll: Function (optical)
        *     }
     * </code>
     * @constructor
     */
    function Float(options) {
        var opts = options,
            self = this,
            container = opts.container;

        this.container = container;
        this._onScroll = opts.onScroll || NOOP;
        this._startPos = opts.startPos || 0;
        this._endPos = (opts.endPos || -1e7) + container.offset().height;
        this._offsetTop = opts.offsetTop || 0;
        this._originPos = parseInt(container.css('top')) || this._startPos || 0;
        this._bindEvents();

        this._step = isIE6 ? function (offsetTop) {
            container.css('top', offsetTop + self._offsetTop + 'px')
        } : function () {
            container.css({
                'position': 'fixed',
                'top': self._offsetTop + 'px'
            });
        }
    }

    Float.prototype = {
        constructor: Float,
        play: function () {
            this._isScrolling = true;
            return this;
        },
        stop: function () {
            this.reset();
            this._isScrolling = false;
            return this;
        },
        reset: function (top) {
            this._isPaused = true;
            this.container.css({
                'position': 'absolute',
                'top': (top ? top : this._originPos) + 'px'
            });
        },
        _bindEvents: function () {
            var self = this;

            self._scrollHandler = function () {
                self._isScrolling && self._scroll();
            }
            C(WIN).bind('scroll', self._scrollHandler);
        },
        _scroll: function () {
            var offsetTop = DOC.documentElement.scrollTop + DOC.body.scrollTop,
                offsetTopMax = DOC.body.scrollHeight - this._endPos,
                self = this,
                isBottomMax = offsetTop >= offsetTopMax;

            self._offsetTopMax = offsetTopMax;
            if (offsetTop > self._startPos && !isBottomMax) {
                self._isPaused = false;
                self._step(offsetTop);
                self._onScroll.call(self, offsetTop);
            } else {
                !self._isPaused && self.reset(isBottomMax ? offsetTopMax : 0);
            }

        }
    }
    C.fn.float = function (startPos, endPos, offsetTop, onScroll) {
        return new Float({
            container: this,
            startPos: startPos,
            endPos: endPos,
            offsetTop: offsetTop,
            onScroll: onScroll
        }).play();
    }

    return exports.Float = Float;
})(cQuery, window, cQuery.BizMod)