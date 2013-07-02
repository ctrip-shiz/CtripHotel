(function ($, window) {

    // lib fix
    var S = {
        // get the sibling or first-child or last-child element
        _elem: function (el, exp, which) {
            if (typeof el.bind === 'function')
                el = el[0];

            var which1 = which + 'ElementSibling',
  		          which2 = which + 'Sibling';
            if (which == 'first' || which == 'last') {
                which1 = which + 'ElementChild',
			          which2 = which + 'Child';
            } else if (which == 'parent') {
                which1 = which2 = 'parentNode';
            }

            var elem;
            elem = el[which1] || el[which2];
            while ((elem && elem.nodeType != 1) || (exp && !Sizzle.matchesSelector(elem, exp))) {
                elem = elem[which2];
            }

            return elem;
        },
        // get the prev element of the specified one
        prev: function (el, exp) {
            return S._elem(el, exp, 'previous');
        },
        // get the next element of the specified one
        next: function (el, exp) {
            return S._elem(el, exp, 'next');
        },
        // get the first element child of the specified one
        firstChild: function (el, exp) {
            return S._elem(el, exp, 'first');
        },
        // get the last element child of the specified one
        lastChild: function (el, exp) {
            return S._elem(el, exp, 'last');
        },
        // get the parent of the specified one
        parent: function (el, exp) {
            return S._elem(el, exp, 'parent');
        },
        // insert one element before another
        insertBefore: function (a, b) {
            if (typeof a.bind === 'function')
                a = a[0];
            if (typeof b.bind === 'function')
                b = b[0];

            b.parentNode.insertBefore(a, b);
        },
        // insert one element after another
        insertAfter: function (a, b) {
            if (typeof a.bind === 'function')
                a = a[0];
            if (typeof b.bind === 'function')
                b = b[0];

            var parent = b.parentNode;
            var last = parent.lastChild;
            if (last == b) {
                parent.appendChild(a);
            } else {
                var next = S.next(b);
                parent.insertBefore(a, next);
            }
        },

        // show element
        show: function (el) {
            if (!el)
                return; // Fault Tolerance
            if (typeof el.removeClass !== 'function')
                el = $(el);
            el.removeClass('hidden');
        },
        // hide element
        hide: function (el) {
            if (!el)
                return; // Fault Tolerance
            if (typeof el.addClass !== 'function')
                el = $(el);
            el.addClass('hidden');
        },

        // create element with html
        create: function (html) {
            // if the tmpEl is cached, 
            // the created element will be removed 
            // when the function is called and the element is not appended to the dom 
            var _tmpEl = document.createElement('div');
            _tmpEl.innerHTML = html.trim(); // fix TextNode bug
            return _tmpEl.firstChild;
        },
        
        // fix the event（mainly used in the page inline function）
        // it calls the cQuery lib function to short the code
        fix: function (evt) {
            return cQuery.event.fixProperty(evt, null);
        },

        // change the HtmlCollection or NodeList to array
        toArray: function (list) {
            try {
                return Array.prototype.slice.apply(list)
            } catch (e) {
                var arr = [];
                for (var i = 0, l = list.length; i < l; i++) {
                    arr.push(list[i]);
                }
                return arr;
            }
        },

        // format the $\d width the args
        format: function (str) {
            var args = arguments;
            if (args.length == 0)
                return str;
            return str.replace(/\$(\d)/g, function (w, d) {
                return args[d] == undefined ? '' : args[d];
            });
        },

        /*
        *@function to post data to specified url
        *@param { string | object  | null} the url or the element or null(it will post back) 
        *@param { object } the event
        */
        postForm: function (foo, event) {
            if (event) {
                var evt = S.fix(event);
                evt.preventDefault();
                evt.stopPropagation();
            }

            if (fm.__VIEWSTATE) fm.__VIEWSTATE.name = "NOVIEWSTATE";
            fm.target = '_self';

            var url;
            if (typeof foo === "string")
                url = foo;
            else {
                if (!foo || (!foo.href && !foo.getAttribute('href')))
                    url = fm.action;
                else {
                    url = foo.href || foo.getAttribute('href');
                    fm.target = foo.target || '_self';
                }
            }

            fm.action = url;
            fm.submit();
        },

        // get element height
        height: function (el) {
            if (typeof el.css !== 'function')
                el = $(el);
            var height = parseInt(el.css('height'));
            if(el.css('height').indexOf('px') == -1)
                height = el[0].offsetHeight;
            return height;
        },
        // get element width
        width: function (el) {
            if (typeof el.css !== 'function')
                el = $(el);
            var width = parseInt(el.css('width'));
            if(el.css('width').indexOf('px') == -1)
                width = el[0].offsetWidth;
            return width;
        },
        // get current scroll top
        scrollTop: function () {
            return document.documentElement.scrollTop || document.body.scrollTop || 0;
        },
        // get current scroll left
        scrollLeft: function () {
            return document.documentElement.scrollLeft || document.body.scrollLeft || 0;
        },
        // get visible height of window
        visibleHeight: function (){
            return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
        },
        // get visible width of window
        visibleWidth: function (){
            return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
        }
    };
    
    window.S = S;
    
})($, window);
