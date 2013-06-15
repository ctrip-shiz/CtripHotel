/**
 * @description: placeholder module for jQuery
 * @warns: you must use placeholder after domready, or it will cause some problem in IEs
 * @version: v1.0
 * @blog: 12d.iteye.com
 * @email: next_100@sina.com
 * @author: xuwei.chen
 */
    //"use strict";
(function (C, WIN, exports) {
    var doc = WIN.document,
        browser = C.browser,
        supportNativePlaceHolder = 'placeholder' in doc.createElement('input'),
        //supportNativePlaceHolder = false,
        // @const
        INPUT_TYPE_RE = /(<\s*input.*\s+type=['"]*)(?:\w+)(['"]*\s+.*>)/gi,
        EMPTY = '',
        //IElte8 = browser.msie && parseFloat(browser.version)<9, //for jQuery
        IElte8 = browser.isIE && (browser.isIE6 || browser.isIE7 || browser.isIE8), // for cQuery
        //IElte8 = browser.ie<=8, // nice!
        IElte8_PASSWORD = false, //will suport in next version
        PASSWORD = 'password',
        FAKE_DOM = 'data-fakedom',
        FAKED = 'data-faked';


    function triggerPlaceHolder(data, force) {
        var self = C(this),
            v = self.value().trim(),
            p = data.txt,
            hasVal = !(v == EMPTY || v == p);

        self[(hasVal || force) ? 'removeClass' : 'addClass'](data.cls);
        return hasVal;
    }

    function fakePassword(dom) {
        var div = C(doc.createElement('div')),
            fake;


        dom = C(dom);
        //dom.clone().removeAttr('id').removeAttr('name').attr('real-type', 'password').appendTo(div); //for jQuery
        /* for cQuery */
        var clonedDom = dom.clone();
        clonedDom.attr('real-type', 'password');
        clonedDom[0].removeAttribute('id');
        clonedDom[0].removeAttribute('name');
        clonedDom.appendTo(div);
        /* for cQuery */
        div.html(div.html().replace(INPUT_TYPE_RE, "$1text$2"));
        //dom.after(fake = div.children().first()); for jQuery
        (fake = div.find('*').first()).insertAfter(dom); //for cQuery
        dom.hide();
        fake.bind('focus', function () {
            C(this).hide();
            dom.show();
            dom[0].focus();
        });
        return fake;
    }

    function makeSimulator(isPassword) {
        return {
            focus: function (evt, data) {
                var dom = C(this);

                data = data || evt.data; //compatible to cQuery
                /* ie=9 */
                if (isPassword && dom.data(FAKED)) {
                    this.setAttribute('type', 'password'); //  jQuery is not allowed to set type of input
                    dom.data(FAKED, false);
                }
                if (!triggerPlaceHolder.call(this, data, true)) {
                    dom.value(EMPTY);
                }
                ;

            },
            blur: function (evt, data) {
                var fake, txt,
                    dom = C(this);

                data = data || evt.data; //compatible to cQuery
                data.txt = dom.data('placeholder')._placeholder || data.txt;
                if (!triggerPlaceHolder.call(this, data)) {
                    dom.value(txt = data.txt);
                    if (fake = dom.data(FAKE_DOM)) { //ie<9
                        dom.hide();
                        fake.show().value(txt);
                    } else if (isPassword) { //ie=9
                        this.setAttribute('type', 'text');
                        dom.data(FAKED, true);
                    }
                    ;
                }
                ;
            }
        }

    }

    function forcePlaceHolder(dom, cls, txt, isPassword) {
        var si = makeSimulator(isPassword),
            obj = { cls: cls, txt: txt };

        //(IElte8_PASSWORD = isPassword && IElte8) && dom.data(FAKE_DOM, fakePassword(dom).addClass(cls).val(txt)); //for jQuery
        //dom.bind('focus', obj, si.focus).bind('blur', obj, si.blur); // for jQuery
        (IElte8_PASSWORD = isPassword && IElte8) && (function () {
            var fake = fakePassword(dom);
            fake.addClass(cls);
            fake.value(txt);
            dom.data(FAKE_DOM, fake);
        })(); // for cQuery
        dom.bind('focus', si.focus, { arguments: obj }).bind('blur', si.blur, { arguments: obj }); //for cQuery
    }

    /**
     * @param dom {DOM} the DOM element waiting for initialize placeholder
     * @param options {Object} (optical) options for placeholder
     */
    function PlaceHolder(dom, options) {
        var self = this,
            DEFAULT_OPTIONS = {
                text: EMPTY,
                cls: 'placeholder' // class supports browsers that have no native placeholder expando
            },
            txt;

        dom.data('placeholder', self);
        self.dom = dom;
        (txt = options.text) && self.text(txt);
        if (!dom || supportNativePlaceHolder) return this;
        self.options = mix(DEFAULT_OPTIONS, options || {});
        self.initialize(self.options);
        dom.trigger('blur');
    }

    PlaceHolder.prototype = {
        constructor: PlaceHolder,
        initialize: function (options) {
            var dom = this.dom,
                txt;

            forcePlaceHolder(dom, options.cls, txt || dom.attr('placeholder'), dom.attr('type') == PASSWORD);
        },
        _placeholder: EMPTY,
        /**
         * @setter, @getter for placeholder attribute
         * @param placeholder {String} (optical), placeholder text, no args will be a getter for placeholder
         * @returns {PlaceHolder||String}
         */
        text: function (str) {
            var self = this,
                str = str && str.toString().trim();

            self._placeholder = str || self.dom.attr('placeholder') || EMPTY;
            return str ? (function (sf) { // setter
                return sf.dom.attr('placeholder', self._placeholder = str);
            })(self) : (function (sf) { //getter
                return sf._placeholder; // || sf.dom.attr('placeholder') || EMPTY
            })(self);
        }
    }

    C.fn.placeholder = function (options) {
        return this.data('placeholder') || new PlaceHolder(this, options || {});
    };
    return exports.PlaceHolder = PlaceHolder;

})(cQuery, WINDOW, cQuery.BizMod);