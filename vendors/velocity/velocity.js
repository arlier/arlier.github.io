/*! VelocityJS.org (1.2.2). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */

/*************************
   Velocity jQuery Shim
*************************/

/*! VelocityJS.org jQuery Shim (1.0.1). (C) 2014 The jQuery Foundation. MIT @license: en.wikipedia.org/wiki/MIT_License. */

/* This file contains the jQuery functions that Velocity relies on, thereby removing Velocity's dependency on a full copy of jQuery, and allowing it to work in any environment. */
/* These shimmed functions are only used if jQuery isn't present. If both this shim and jQuery are loaded, Velocity defaults to jQuery proper. */
/* Browser support: Using this shim instead of jQuery proper removes support for IE8. */

;(function (window) {
    /***************
         Setup
    ***************/

    /* If jQuery is already loaded, there's no point in loading this shim. */
    if (window.jQuery) {
        return;
    }

    /* jQuery base. */
    var $ = function (selector, context) {
        return new $.fn.init(selector, context);
    };

    /********************
       Private Methods
    ********************/

    /* jQuery */
    $.isWindow = function (obj) {
        /* jshint eqeqeq: false */
        return obj != null && obj == obj.window;
    };

    /* jQuery */
    $.type = function (obj) {
        if (obj == null) {
            return obj + "";
        }

        return typeof obj === "object" || typeof obj === "function" ?
            class2type[toString.call(obj)] || "object" :
            typeof obj;
    };

    /* jQuery */
    $.isArray = Array.isArray || function (obj) {
        return $.type(obj) === "array";
    };

    /* jQuery */
    function isArraylike (obj) {
        var length = obj.length,
            type = $.type(obj);

        if (type === "function" || $.isWindow(obj)) {
            return false;
        }

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
    }

    /***************
       $ Methods
    ***************/

    /* jQuery: Support removed for IE<9. */
    $.isPlainObject = function (obj) {
        var key;

        if (!obj || $.type(obj) !== "object" || obj.nodeType || $.isWindow(obj)) {
            return false;
        }

        try {
            if (obj.constructor &&
                !hasOwn.call(obj, "constructor") &&
                !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            return false;
        }

        for (key in obj) {}

        return key === undefined || hasOwn.call(obj, key);
    };

    /* jQuery */
    $.each = function(obj, callback, args) {
        var value,
            i = 0,
            length = obj.length,
            isArray = isArraylike(obj);

        if (args) {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            }

        } else {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            }
        }

        return obj;
    };

    /* Custom */
    $.data = function (node, key, value) {
        /* $.getData() */
        if (value === undefined) {
            var id = node[$.expando],
                store = id && cache[id];

            if (key === undefined) {
                return store;
            } else if (store) {
                if (key in store) {
                    return store[key];
                }
            }
        /* $.setData() */
        } else if (key !== undefined) {
            var id = node[$.expando] || (node[$.expando] = ++$.uuid);

            cache[id] = cache[id] || {};
            cache[id][key] = value;

            return value;
        }
    };

    /* Custom */
    $.removeData = function (node, keys) {
        var id = node[$.expando],
            store = id && cache[id];

        if (store) {
            $.each(keys, function(_, key) {
                delete store[key];
            });
        }
    };

    /* jQuery */
    $.extend = function () {
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === "boolean") {
            deep = target;

            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== "object" && $.type(target) !== "function") {
            target = {};
        }

        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && $.isArray(src) ? src : [];

                        } else {
                            clone = src && $.isPlainObject(src) ? src : {};
                        }

                        target[name] = $.extend(deep, clone, copy);

                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    };

    /* jQuery 1.4.3 */
    $.queue = function (elem, type, data) {
        function $makeArray (arr, results) {
            var ret = results || [];

            if (arr != null) {
                if (isArraylike(Object(arr))) {
                    /* $.merge */
                    (function(first, second) {
                        var len = +second.length,
                            j = 0,
                            i = first.length;

                        while (j < len) {
                            first[i++] = second[j++];
                        }

                        if (len !== len) {
                            while (second[j] !== undefined) {
                                first[i++] = second[j++];
                            }
                        }

                        first.length = i;

                        return first;
                    })(ret, typeof arr === "string" ? [arr] : arr);
                } else {
                    [].push.call(ret, arr);
                }
            }

            return ret;
        }

        if (!elem) {
            return;
        }

        type = (type || "fx") + "queue";

        var q = $.data(elem, type);

        if (!data) {
            return q || [];
        }

        if (!q || $.isArray(data)) {
            q = $.data(elem, type, $makeArray(data));
        } else {
            q.push(data);
        }

        return q;
    };

    /* jQuery 1.4.3 */
    $.dequeue = function (elems, type) {
        /* Custom: Embed element iteration. */
        $.each(elems.nodeType ? [ elems ] : elems, function(i, elem) {
            type = type || "fx";

            var queue = $.queue(elem, type),
                fn = queue.shift();

            if (fn === "inprogress") {
                fn = queue.shift();
            }

            if (fn) {
                if (type === "fx") {
                    queue.unshift("inprogress");
                }

                fn.call(elem, function() {
                    $.dequeue(elem, type);
                });
            }
        });
    };

    /******************
       $.fn Methods
    ******************/

    /* jQuery */
    $.fn = $.prototype = {
        init: function (selector) {
            /* Just return the element wrapped inside an array; don't proceed with the actual jQuery node wrapping process. */
            if (selector.nodeType) {
                this[0] = selector;

                return this;
            } else {
                throw new Error("Not a DOM node.");
            }
        },

        offset: function () {
            /* jQuery altered code: Dropped disconnected DOM node checking. */
            var box = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : { top: 0, left: 0 };

            return {
                top: box.top + (window.pageYOffset || document.scrollTop  || 0)  - (document.clientTop  || 0),
                left: box.left + (window.pageXOffset || document.scrollLeft  || 0) - (document.clientLeft || 0)
            };
        },

        position: function () {
            /* jQuery */
            function offsetParent() {
                var offsetParent = this.offsetParent || document;

                while (offsetParent && (!offsetParent.nodeType.toLowerCase === "html" && offsetParent.style.position === "static")) {
                    offsetParent = offsetParent.offsetParent;
                }

                return offsetParent || document;
            }

            /* Zepto */
            var elem = this[0],
                offsetParent = offsetParent.apply(elem),
                offset = this.offset(),
                parentOffset = /^(?:body|html)$/i.test(offsetParent.nodeName) ? { top: 0, left: 0 } : $(offsetParent).offset()

            offset.top -= parseFloat(elem.style.marginTop) || 0;
            offset.left -= parseFloat(elem.style.marginLeft) || 0;

            if (offsetParent.style) {
                parentOffset.top += parseFloat(offsetParent.style.borderTopWidth) || 0
                parentOffset.left += parseFloat(offsetParent.style.borderLeftWidth) || 0
            }

            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        }
    };

    /**********************
       Private Variables
    **********************/

    /* For $.data() */
    var cache = {};
    $.expando = "velocity" + (new Date().getTime());
    $.uuid = 0;

    /* For $.queue() */
    var class2type = {},
        hasOwn = class2type.hasOwnProperty,
        toString = class2type.toString;

    var types = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
    for (var i = 0; i < types.length; i++) {
        class2type["[object " + types[i] + "]"] = types[i].toLowerCase();
    }

    /* Makes $(node) possible, without having to call init. */
    $.fn.init.prototype = $.fn;

    /* Globalize Velocity onto the window, and assign its Utilities property. */
    window.Velocity = { Utilities: $ };
})(window);

/******************
    Velocity.js
******************/

;(function (factory) {
    /* CommonJS module. */
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory();
    /* AMD module. */
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    /* Browser globals. */
    } else {
        factory();
    }
}(function() {
return function (global, window, document, undefined) {

    /***************
        Summary
    ***************/

    /*
    - CSS: CSS stack that works independently from the rest of Velocity.
    - animate(): Core animation method that iterates over the targeted elements and queues the incoming call onto each element individually.
      - Pre-Queueing: Prepare the element for animation by instantiating its data cache and processing the call's options.
      - Queueing: The logic that runs once the call has reached its point of execution in the element's $.queue() stack.
                  Most logic is placed here to avoid risking it becoming stale (if the element's properties have changed).
      - Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
    - tick(): The single requestAnimationFrame loop responsible for tweening all in-progress calls.
    - completeCall(): Handles the cleanup process for each Velocity call.
    */

    /*********************
       Helper Functions
    *********************/

    /* IE detection. Gist: https://gist.github.com/julianshapiro/9098609 */
    var IE = (function() {
        if (document.documentMode) {
            return document.documentMode;
        } else {
            for (var i = 7; i > 4; i--) {
                var div = document.createElement("div");

                div.innerHTML = "<!--[if IE " + i + "]><span></span><![endif]-->";

                if (div.getElementsByTagName("span").length) {
                    div = null;

                    return i;
                }
            }
        }

        return undefined;
    })();

    /* rAF shim. Gist: https://gist.github.com/julianshapiro/9497513 */
    var rAFShim = (function() {
        var timeLast = 0;

        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
            var timeCurrent = (new Date()).getTime(),
                timeDelta;

            /* Dynamically set delay on a per-tick basis to match 60fps. */
            /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
            timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
            timeLast = timeCurrent + timeDelta;

            return setTimeout(function() { callback(timeCurrent + timeDelta); }, timeDelta);
        };
    })();

    /* Array compacting. Copyright Lo-Dash. MIT License: https://github.com/lodash/lodash/blob/master/LICENSE.txt */
    function compactSparseArray (array) {
        var index = -1,
            length = array ? array.length : 0,
            result = [];

        while (++index < length) {
            var value = array[index];

            if (value) {
                result.push(value);
            }
        }

        return result;
    }

    function sanitizeElements (elements) {
        /* Unwrap jQuery/Zepto objects. */
        if (Type.isWrapped(elements)) {
            elements = [].slice.call(elements);
        /* Wrap a single element in an array so that $.each() can iterate with the element instead of its node's children. */
        } else if (Type.isNode(elements)) {
            elements = [ elements ];
        }

        return elements;
    }

    var Type = {
        isString: function (variable) {
            return (typeof variable === "string");
        },
        isArray: Array.isArray || function (variable) {
            return Object.prototype.toString.call(variable) === "[object Array]";
        },
        isFunction: function (variable) {
            return Object.prototype.toString.call(variable) === "[object Function]";
        },
        isNode: function (variable) {
            return variable && variable.nodeType;
        },
        /* Copyright Martin Bohm. MIT License: https://gist.github.com/Tomalak/818a78a226a0738eaade */
        isNodeList: function (variable) {
            return typeof variable === "object" &&
                /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(variable)) &&
                variable.length !== undefined &&
                (variable.length === 0 || (typeof variable[0] === "object" && variable[0].nodeType > 0));
        },
        /* Determine if variable is a wrapped jQuery or Zepto element. */
        isWrapped: function (variable) {
            return variable && (variable.jquery || (window.Zepto && window.Zepto.zepto.isZ(variable)));
        },
        isSVG: function (variable) {
            return window.SVGElement && (variable instanceof window.SVGElement);
        },
        isEmptyObject: function (variable) {
            for (var name in variable) {
                return false;
            }

            return true;
        }
    };

    /*****************
       Dependencies
    *****************/

    var $,
        isJQuery = false;

    if (global.fn && global.fn.jquery) {
        $ = global;
        isJQuery = true;
    } else {
        $ = window.Velocity.Utilities;
    }

    if (IE <= 8 && !isJQuery) {
        throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
    } else if (IE <= 7) {
        /* Revert to jQuery's $.animate(), and lose Velocity's extra features. */
        jQuery.fn.velocity = jQuery.fn.animate;

        /* Now that $.fn.velocity is aliased, abort this Velocity declaration. */
        return;
    }

    /*****************
        Constants
    *****************/

    var DURATION_DEFAULT = 400,
        EASING_DEFAULT = "swing";

    /*************
        State
    *************/

    var Velocity = {
        /* Container for page-wide Velocity state data. */
        State: {
            /* Detect mobile devices to determine if mobileHA should be turned on. */
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            /* The mobileHA option's behavior changes on older Android devices (Gingerbread, versions 2.3.3-2.3.7). */
            isAndroid: /Android/i.test(navigator.userAgent),
            isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
            isChrome: window.chrome,
            isFirefox: /Firefox/i.test(navigator.userAgent),
            /* Create a cached element for re-use when checking for CSS property prefixes. */
            prefixElement: document.createElement("div"),
            /* Cache every prefix match to avoid repeating lookups. */
            prefixMatches: {},
            /* Cache the anchor used for animating window scrolling. */
            scrollAnchor: null,
            /* Cache the browser-specific property names associated with the scroll anchor. */
            scrollPropertyLeft: null,
            scrollPropertyTop: null,
            /* Keep track of whether our RAF tick is running. */
            isTicking: false,
            /* Container for every in-progress call to Velocity. */
            calls: []
        },
        /* Velocity's custom CSS stack. Made global for unit testing. */
        CSS: { /* Defined below. */ },
        /* A shim of the jQuery utility functions used by Velocity -- provided by Velocity's optional jQuery shim. */
        Utilities: $,
        /* Container for the user's custom animation redirects that are referenced by name in place of the properties map argument. */
        Redirects: { /* Manually registered by the user. */ },
        Easings: { /* Defined below. */ },
        /* Attempt to use ES6 Promises by default. Users can override this with a third-party promises library. */
        Promise: window.Promise,
        /* Velocity option defaults, which can be overriden by the user. */
        defaults: {
            queue: "",
            duration: DURATION_DEFAULT,
            easing: EASING_DEFAULT,
            begin: undefined,
            complete: undefined,
            progress: undefined,
            display: undefined,
            visibility: undefined,
            loop: false,
            delay: false,
            mobileHA: true,
            /* Advanced: Set to false to prevent property values from being cached between consecutive Velocity-initiated chain calls. */
            _cacheValues: true
        },
        /* A design goal of Velocity is to cache data wherever possible in order to avoid DOM requerying. Accordingly, each element has a data cache. */
        init: function (element) {
            $.data(element, "velocity", {
                /* Store whether this is an SVG element, since its properties are retrieved and updated differently than standard HTML elements. */
                isSVG: Type.isSVG(element),
                /* Keep track of whether the element is currently being animated by Velocity.
                   This is used to ensure that property values are not transferred between non-consecutive (stale) calls. */
                isAnimating: false,
                /* A reference to the element's live computedStyle object. Learn more here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
                computedStyle: null,
                /* Tween data is cached for each animation on the element so that data can be passed across calls --
                   in particular, end values are used as subsequent start values in consecutive Velocity calls. */
                tweensContainer: null,
                /* The full root property values of each CSS hook being animated on this element are cached so that:
                   1) Concurrently-animating hooks sharing the same root can have their root values' merged into one while tweening.
                   2) Post-hook-injection root values can be transferred over to consecutively chained Velocity calls as starting root values. */
                rootPropertyValueCache: {},
                /* A cache for transform updates, which must be manually flushed via CSS.flushTransformCache(). */
                transformCache: {}
            });
        },
        /* A parallel to jQuery's $.css(), used for getting/setting Velocity's hooked CSS properties. */
        hook: null, /* Defined below. */
        /* Velocity-wide animation time remapping for testing purposes. */
        mock: false,
        version: { major: 1, minor: 2, patch: 2 },
        /* Set to 1 or 2 (most verbose) to output debug info to console. */
        debug: false
    };

    /* Retrieve the appropriate scroll anchor and property name for the browser: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY */
    if (window.pageYOffset !== undefined) {
        Velocity.State.scrollAnchor = window;
        Velocity.State.scrollPropertyLeft = "pageXOffset";
        Velocity.State.scrollPropertyTop = "pageYOffset";
    } else {
        Velocity.State.scrollAnchor = document.documentElement || document.body.parentNode || document.body;
        Velocity.State.scrollPropertyLeft = "scrollLeft";
        Velocity.State.scrollPropertyTop = "scrollTop";
    }

    /* Shorthand alias for jQuery's $.data() utility. */
    function Data (element) {
        /* Hardcode a reference to the plugin name. */
        var response = $.data(element, "velocity");

        /* jQuery <=1.4.2 returns null instead of undefined when no match is found. We normalize this behavior. */
        return response === null ? undefined : response;
    };

    /**************
        Easing
    **************/

    /* Step easing generator. */
    function generateStep (steps) {
        return function (p) {
            return Math.round(p * steps) * (1 / steps);
        };
    }

    /* Bezier curve function generator. Copyright Gaetan Renaudeau. MIT License: http://en.wikipedia.org/wiki/MIT_License */
    function generateBezier (mX1, mY1, mX2, mY2) {
        var NEWTON_ITERATIONS = 4,
            NEWTON_MIN_SLOPE = 0.001,
            SUBDIVISION_PRECISION = 0.0000001,
            SUBDIVISION_MAX_ITERATIONS = 10,
            kSplineTableSize = 11,
            kSampleStepSize = 1.0 / (kSplineTableSize - 1.0),
            float32ArraySupported = "Float32Array" in window;

        /* Must contain four arguments. */
        if (arguments.length !== 4) {
            return false;
        }

        /* Arguments must be numbers. */
        for (var i = 0; i < 4; ++i) {
            if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
                return false;
            }
        }

        /* X values must be in the [0, 1] range. */
        mX1 = Math.min(mX1, 1);
        mX2 = Math.min(mX2, 1);
        mX1 = Math.max(mX1, 0);
        mX2 = Math.max(mX2, 0);

        var mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

        function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
        function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
        function C (aA1)      { return 3.0 * aA1; }

        function calcBezier (aT, aA1, aA2) {
            return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
        }

        function getSlope (aT, aA1, aA2) {
            return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
        }

        function newtonRaphsonIterate (aX, aGuessT) {
            for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
                var currentSlope = getSlope(aGuessT, mX1, mX2);

                if (currentSlope === 0.0) return aGuessT;

                var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
                aGuessT -= currentX / currentSlope;
            }

            return aGuessT;
        }

        function calcSampleValues () {
            for (var i = 0; i < kSplineTableSize; ++i) {
                mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
            }
        }

        function binarySubdivide (aX, aA, aB) {
            var currentX, currentT, i = 0;

            do {
                currentT = aA + (aB - aA) / 2.0;
                currentX = calcBezier(currentT, mX1, mX2) - aX;
                if (currentX > 0.0) {
                  aB = currentT;
                } else {
                  aA = currentT;
                }
            } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

            return currentT;
        }

        function getTForX (aX) {
            var intervalStart = 0.0,
                currentSample = 1,
                lastSample = kSplineTableSize - 1;

            for (; currentSample != lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
                intervalStart += kSampleStepSize;
            }

            --currentSample;

            var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample+1] - mSampleValues[currentSample]),
                guessForT = intervalStart + dist * kSampleStepSize,
                initialSlope = getSlope(guessForT, mX1, mX2);

            if (initialSlope >= NEWTON_MIN_SLOPE) {
                return newtonRaphsonIterate(aX, guessForT);
            } else if (initialSlope == 0.0) {
                return guessForT;
            } else {
                return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
            }
        }

        var _precomputed = false;

        function precompute() {
            _precomputed = true;
            if (mX1 != mY1 || mX2 != mY2) calcSampleValues();
        }

        var f = function (aX) {
            if (!_precomputed) precompute();
            if (mX1 === mY1 && mX2 === mY2) return aX;
            if (aX === 0) return 0;
            if (aX === 1) return 1;

            return calcBezier(getTForX(aX), mY1, mY2);
        };

        f.getControlPoints = function() { return [{ x: mX1, y: mY1 }, { x: mX2, y: mY2 }]; };

        var str = "generateBezier(" + [mX1, mY1, mX2, mY2] + ")";
        f.toString = function () { return str; };

        return f;
    }

    /* Runge-Kutta spring physics function generator. Adapted from Framer.js, copyright Koen Bok. MIT License: http://en.wikipedia.org/wiki/MIT_License */
    /* Given a tension, friction, and duration, a simulation at 60FPS will first run without a defined duration in order to calculate the full path. A second pass
       then adjusts the time delta -- using the relation between actual time and duration -- to calculate the path for the duration-constrained animation. */
    var generateSpringRK4 = (function () {
        function springAccelerationForState (state) {
            return (-state.tension * state.x) - (state.friction * state.v);
        }

        function springEvaluateStateWithDerivative (initialState, dt, derivative) {
            var state = {
                x: initialState.x + derivative.dx * dt,
                v: initialState.v + derivative.dv * dt,
                tension: initialState.tension,
                friction: initialState.friction
            };

            return { dx: state.v, dv: springAccelerationForState(state) };
        }

        function springIntegrateState (state, dt) {
            var a = {
                    dx: state.v,
                    dv: springAccelerationForState(state)
                },
                b = springEvaluateStateWithDerivative(state, dt * 0.5, a),
                c = springEvaluateStateWithDerivative(state, dt * 0.5, b),
                d = springEvaluateStateWithDerivative(state, dt, c),
                dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx),
                dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);

            state.x = state.x + dxdt * dt;
            state.v = state.v + dvdt * dt;

            return state;
        }

        return function springRK4Factory (tension, friction, duration) {

            var initState = {
                    x: -1,
                    v: 0,
                    tension: null,
                    friction: null
                },
                path = [0],
                time_lapsed = 0,
                tolerance = 1 / 10000,
                DT = 16 / 1000,
                have_duration, dt, last_state;

            tension = parseFloat(tension) || 500;
            friction = parseFloat(friction) || 20;
            duration = duration || null;

            initState.tension = tension;
            initState.friction = friction;

            have_duration = duration !== null;

            /* Calculate the actual time it takes for this animation to complete with the provided conditions. */
            if (have_duration) {
                /* Run the simulation without a duration. */
                time_lapsed = springRK4Factory(tension, friction);
                /* Compute the adjusted time delta. */
                dt = time_lapsed / duration * DT;
            } else {
                dt = DT;
            }

            while (true) {
                /* Next/step function .*/
                last_state = springIntegrateState(last_state || initState, dt);
                /* Store the position. */
                path.push(1 + last_state.x);
                time_lapsed += 16;
                /* If the change threshold is reached, break. */
                if (!(Math.abs(last_state.x) > tolerance && Math.abs(last_state.v) > tolerance)) {
                    break;
                }
            }

            /* If duration is not defined, return the actual time required for completing this animation. Otherwise, return a closure that holds the
               computed path and returns a snapshot of the position according to a given percentComplete. */
            return !have_duration ? time_lapsed : function(percentComplete) { return path[ (percentComplete * (path.length - 1)) | 0 ]; };
        };
    }());

    /* jQuery easings. */
    Velocity.Easings = {
        linear: function(p) { return p; },
        swing: function(p) { return 0.5 - Math.cos( p * Math.PI ) / 2 },
        /* Bonus "spring" easing, which is a less exaggerated version of easeInOutElastic. */
        spring: function(p) { return 1 - (Math.cos(p * 4.5 * Math.PI) * Math.exp(-p * 6)); }
    };

    /* CSS3 and Robert Penner easings. */
    $.each(
        [
            [ "ease", [ 0.25, 0.1, 0.25, 1.0 ] ],
            [ "ease-in", [ 0.42, 0.0, 1.00, 1.0 ] ],
            [ "ease-out", [ 0.00, 0.0, 0.58, 1.0 ] ],
            [ "ease-in-out", [ 0.42, 0.0, 0.58, 1.0 ] ],
            [ "easeInSine", [ 0.47, 0, 0.745, 0.715 ] ],
            [ "easeOutSine", [ 0.39, 0.575, 0.565, 1 ] ],
            [ "easeInOutSine", [ 0.445, 0.05, 0.55, 0.95 ] ],
            [ "easeInQuad", [ 0.55, 0.085, 0.68, 0.53 ] ],
            [ "easeOutQuad", [ 0.25, 0.46, 0.45, 0.94 ] ],
            [ "easeInOutQuad", [ 0.455, 0.03, 0.515, 0.955 ] ],
            [ "easeInCubic", [ 0.55, 0.055, 0.675, 0.19 ] ],
            [ "easeOutCubic", [ 0.215, 0.61, 0.355, 1 ] ],
            [ "easeInOutCubic", [ 0.645, 0.045, 0.355, 1 ] ],
            [ "easeInQuart", [ 0.895, 0.03, 0.685, 0.22 ] ],
            [ "easeOutQuart", [ 0.165, 0.84, 0.44, 1 ] ],
            [ "easeInOutQuart", [ 0.77, 0, 0.175, 1 ] ],
            [ "easeInQuint", [ 0.755, 0.05, 0.855, 0.06 ] ],
            [ "easeOutQuint", [ 0.23, 1, 0.32, 1 ] ],
            [ "easeInOutQuint", [ 0.86, 0, 0.07, 1 ] ],
            [ "easeInExpo", [ 0.95, 0.05, 0.795, 0.035 ] ],
            [ "easeOutExpo", [ 0.19, 1, 0.22, 1 ] ],
            [ "easeInOutExpo", [ 1, 0, 0, 1 ] ],
            [ "easeInCirc", [ 0.6, 0.04, 0.98, 0.335 ] ],
            [ "easeOutCirc", [ 0.075, 0.82, 0.165, 1 ] ],
            [ "easeInOutCirc", [ 0.785, 0.135, 0.15, 0.86 ] ]
        ], function(i, easingArray) {
            Velocity.Easings[easingArray[0]] = generateBezier.apply(null, easingArray[1]);
        });

    /* Determine the appropriate easing type given an easing input. */
    function getEasing(value, duration) {
        var easing = value;

        /* The easing option can either be a string that references a pre-registered easing,
           or it can be a two-/four-item array of integers to be converted into a bezier/spring function. */
        if (Type.isString(value)) {
            /* Ensure that the easing has been assigned to jQuery's Velocity.Easings object. */
            if (!Velocity.Easings[value]) {
                easing = false;
            }
        } else if (Type.isArray(value) && value.length === 1) {
            easing = generateStep.apply(null, value);
        } else if (Type.isArray(value) && value.length === 2) {
            /* springRK4 must be passed the animation's duration. */
            /* Note: If the springRK4 array contains non-numbers, generateSpringRK4() returns an easing
               function generated with default tension and friction values. */
            easing = generateSpringRK4.apply(null, value.concat([ duration ]));
        } else if (Type.isArray(value) && value.length === 4) {
            /* Note: If the bezier array contains non-numbers, generateBezier() returns false. */
            easing = generateBezier.apply(null, value);
        } else {
            easing = false;
        }

        /* Revert to the Velocity-wide default easing type, or fall back to "swing" (which is also jQuery's default)
           if the Velocity-wide default has been incorrectly modified. */
        if (easing === false) {
            if (Velocity.Easings[Velocity.defaults.easing]) {
                easing = Velocity.defaults.easing;
            } else {
                easing = EASING_DEFAULT;
            }
        }

        return easing;
    }

    /*****************
        CSS Stack
    *****************/

    /* The CSS object is a highly condensed and performant CSS stack that fully replaces jQuery's.
       It handles the validation, getting, and setting of both standard CSS properties and CSS property hooks. */
    /* Note: A "CSS" shorthand is aliased so that our code is easier to read. */
    var CSS = Velocity.CSS = {

        /*************
            RegEx
        *************/

        RegEx: {
            isHex: /^#([A-f\d]{3}){1,2}$/i,
            /* Unwrap a property value's surrounding text, e.g. "rgba(4, 3, 2, 1)" ==> "4, 3, 2, 1" and "rect(4px 3px 2px 1px)" ==> "4px 3px 2px 1px". */
            valueUnwrap: /^[A-z]+\((.*)\)$/i,
            wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
            /* Split a multi-value property into an array of subvalues, e.g. "rgba(4, 3, 2, 1) 4px 3px 2px 1px" ==> [ "rgba(4, 3, 2, 1)", "4px", "3px", "2px", "1px" ]. */
            valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/ig
        },

        /************
            Lists
        ************/

        Lists: {
            colors: [ "fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor" ],
            transformsBase: [ "translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ" ],
            transforms3D: [ "transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY" ]
        },

        /************
            Hooks
        ************/

        /* Hooks allow a subproperty (e.g. "boxShadowBlur") of a compound-value CSS property
           (e.g. "boxShadow: X Y Blur Spread Color") to be animated as if it were a discrete property. */
        /* Note: Beyond enabling fine-grained property animation, hooking is necessary since Velocity only
           tweens properties with single numeric values; unlike CSS transitions, Velocity does not interpolate compound-values. */
        Hooks: {
            /********************
                Registration
            ********************/

            /* Templates are a concise way of indicating which subproperties must be individually registered for each compound-value CSS property. */
            /* Each template consists of the compound-value's base name, its constituent subproperty names, and those subproperties' default values. */
            templates: {
                "textShadow": [ "Color X Y Blur", "black 0px 0px 0px" ],
                "boxShadow": [ "Color X Y Blur Spread", "black 0px 0px 0px 0px" ],
                "clip": [ "Top Right Bottom Left", "0px 0px 0px 0px" ],
                "backgroundPosition": [ "X Y", "0% 0%" ],
                "transformOrigin": [ "X Y Z", "50% 50% 0px" ],
                "perspectiveOrigin": [ "X Y", "50% 50%" ]
            },

            /* A "registered" hook is one that has been converted from its template form into a live,
               tweenable property. It contains data to associate it with its root property. */
            registered: {
                /* Note: A registered hook looks like this ==> textShadowBlur: [ "textShadow", 3 ],
                   which consists of the subproperty's name, the associated root property's name,
                   and the subproperty's position in the root's value. */
            },
            /* Convert the templates into individual hooks then append them to the registered object above. */
            register: function () {
                /* Color hooks registration: Colors are defaulted to white -- as opposed to black -- since colors that are
                   currently set to "transparent" default to their respective template below when color-animated,
                   and white is typically a closer match to transparent than black is. An exception is made for text ("color"),
                   which is almost always set closer to black than white. */
                for (var i = 0; i < CSS.Lists.colors.length; i++) {
                    var rgbComponents = (CSS.Lists.colors[i] === "color") ? "0 0 0 1" : "255 255 255 1";
                    CSS.Hooks.templates[CSS.Lists.colors[i]] = [ "Red Green Blue Alpha", rgbComponents ];
                }

                var rootProperty,
                    hookTemplate,
                    hookNames;

                /* In IE, color values inside compound-value properties are positioned at the end the value instead of at the beginning.
                   Thus, we re-arrange the templates accordingly. */
                if (IE) {
                    for (rootProperty in CSS.Hooks.templates) {
                        hookTemplate = CSS.Hooks.templates[rootProperty];
                        hookNames = hookTemplate[0].split(" ");

                        var defaultValues = hookTemplate[1].match(CSS.RegEx.valueSplit);

                        if (hookNames[0] === "Color") {
                            /* Reposition both the hook's name and its default value to the end of their respective strings. */
                            hookNames.push(hookNames.shift());
                            defaultValues.push(defaultValues.shift());

                            /* Replace the existing template for the hook's root property. */
                            CSS.Hooks.templates[rootProperty] = [ hookNames.join(" "), defaultValues.join(" ") ];
                        }
                    }
                }

                /* Hook registration. */
                for (rootProperty in CSS.Hooks.templates) {
                    hookTemplate = CSS.Hooks.templates[rootProperty];
                    hookNames = hookTemplate[0].split(" ");

                    for (var i in hookNames) {
                        var fullHookName = rootProperty + hookNames[i],
                            hookPosition = i;

                        /* For each hook, register its full name (e.g. textShadowBlur) with its root property (e.g. textShadow)
                           and the hook's position in its template's default value string. */
                        CSS.Hooks.registered[fullHookName] = [ rootProperty, hookPosition ];
                    }
                }
            },

            /*****************************
               Injection and Extraction
            *****************************/

            /* Look up the root property associated with the hook (e.g. return "textShadow" for "textShadowBlur"). */
            /* Since a hook cannot be set directly (the browser won't recognize it), style updating for hooks is routed through the hook's root property. */
            getRoot: function (property) {
                var hookData = CSS.Hooks.registered[property];

                if (hookData) {
                    return hookData[0];
                } else {
                    /* If there was no hook match, return the property name untouched. */
                    return property;
                }
            },
            /* Convert any rootPropertyValue, null or otherwise, into a space-delimited list of hook values so that
               the targeted hook can be injected or extracted at its standard position. */
            cleanRootPropertyValue: function(rootProperty, rootPropertyValue) {
                /* If the rootPropertyValue is wrapped with "rgb()", "clip()", etc., remove the wrapping to normalize the value before manipulation. */
                if (CSS.RegEx.valueUnwrap.test(rootPropertyValue)) {
                    rootPropertyValue = rootPropertyValue.match(CSS.RegEx.valueUnwrap)[1];
                }

                /* If rootPropertyValue is a CSS null-value (from which there's inherently no hook value to extract),
                   default to the root's default value as defined in CSS.Hooks.templates. */
                /* Note: CSS null-values include "none", "auto", and "transparent". They must be converted into their
                   zero-values (e.g. textShadow: "none" ==> textShadow: "0px 0px 0px black") for hook manipulation to proceed. */
                if (CSS.Values.isCSSNullValue(rootPropertyValue)) {
                    rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                }

                return rootPropertyValue;
            },
            /* Extracted the hook's value from its root property's value. This is used to get the starting value of an animating hook. */
            extractValue: function (fullHookName, rootPropertyValue) {
                var hookData = CSS.Hooks.registered[fullHookName];

                if (hookData) {
                    var hookRoot = hookData[0],
                        hookPosition = hookData[1];

                    rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                    /* Split rootPropertyValue into its constituent hook values then grab the desired hook at its standard position. */
                    return rootPropertyValue.toString().match(CSS.RegEx.valueSplit)[hookPosition];
                } else {
                    /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                    return rootPropertyValue;
                }
            },
            /* Inject the hook's value into its root property's value. This is used to piece back together the root property
               once Velocity has updated one of its individually hooked values through tweening. */
            injectValue: function (fullHookName, hookValue, rootPropertyValue) {
                var hookData = CSS.Hooks.registered[fullHookName];

                if (hookData) {
                    var hookRoot = hookData[0],
                        hookPosition = hookData[1],
                        rootPropertyValueParts,
                        rootPropertyValueUpdated;

                    rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                    /* Split rootPropertyValue into its individual hook values, replace the targeted value with hookValue,
                       then reconstruct the rootPropertyValue string. */
                    rootPropertyValueParts = rootPropertyValue.toString().match(CSS.RegEx.valueSplit);
                    rootPropertyValueParts[hookPosition] = hookValue;
                    rootPropertyValueUpdated = rootPropertyValueParts.join(" ");

                    return rootPropertyValueUpdated;
                } else {
                    /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                    return rootPropertyValue;
                }
            }
        },

        /*******************
           Normalizations
        *******************/

        /* Normalizations standardize CSS property manipulation by pollyfilling browser-specific implementations (e.g. opacity)
           and reformatting special properties (e.g. clip, rgba) to look like standard ones. */
        Normalizations: {
            /* Normalizations are passed a normalization target (either the property's name, its extracted value, or its injected value),
               the targeted element (which may need to be queried), and the targeted property value. */
            registered: {
                clip: function (type, element, propertyValue) {
                    switch (type) {
                        case "name":
                            return "clip";
                        /* Clip needs to be unwrapped and stripped of its commas during extraction. */
                        case "extract":
                            var extracted;

                            /* If Velocity also extracted this value, skip extraction. */
                            if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                                extracted = propertyValue;
                            } else {
                                /* Remove the "rect()" wrapper. */
                                extracted = propertyValue.toString().match(CSS.RegEx.valueUnwrap);

                                /* Strip off commas. */
                                extracted = extracted ? extracted[1].replace(/,(\s+)?/g, " ") : propertyValue;
                            }

                            return extracted;
                        /* Clip needs to be re-wrapped during injection. */
                        case "inject":
                            return "rect(" + propertyValue + ")";
                    }
                },

                blur: function(type, element, propertyValue) {
                    switch (type) {
                        case "name":
                            return Velocity.State.isFirefox ? "filter" : "-webkit-filter";
                        case "extract":
                            var extracted = parseFloat(propertyValue);

                            /* If extracted is NaN, meaning the value isn't already extracted. */
                            if (!(extracted || extracted === 0)) {
                                var blurComponent = propertyValue.toString().match(/blur\(([0-9]+[A-z]+)\)/i);

                                /* If the filter string had a blur component, return just the blur value and unit type. */
                                if (blurComponent) {
                                    extracted = blurComponent[1];
                                /* If the component doesn't exist, default blur to 0. */
                                } else {
                                    extracted = 0;
                                }
                            }

                            return extracted;
                        /* Blur needs to be re-wrapped during injection. */
                        case "inject":
                            /* For the blur effect to be fully de-applied, it needs to be set to "none" instead of 0. */
                            if (!parseFloat(propertyValue)) {
                                return "none";
                            } else {
                                return "blur(" + propertyValue + ")";
                            }
                    }
                },

                /* <=IE8 do not support the standard opacity property. They use filter:alpha(opacity=INT) instead. */
                opacity: function (type, element, propertyValue) {
                    if (IE <= 8) {
                        switch (type) {
                            case "name":
                                return "filter";
                            case "extract":
                                /* <=IE8 return a "filter" value of "alpha(opacity=\d{1,3})".
                                   Extract the value and convert it to a decimal value to match the standard CSS opacity property's formatting. */
                                var extracted = propertyValue.toString().match(/alpha\(opacity=(.*)\)/i);

                                if (extracted) {
                                    /* Convert to decimal value. */
                                    propertyValue = extracted[1] / 100;
                                } else {
                                    /* When extracting opacity, default to 1 since a null value means opacity hasn't been set. */
                                    propertyValue = 1;
                                }

                                return propertyValue;
                            case "inject":
                                /* Opacified elements are required to have their zoom property set to a non-zero value. */
                                element.style.zoom = 1;

                                /* Setting the filter property on elements with certain font property combinations can result in a
                                   highly unappealing ultra-bolding effect. There's no way to remedy this throughout a tween, but dropping the
                                   value altogether (when opacity hits 1) at leasts ensures that the glitch is gone post-tweening. */
                                if (parseFloat(propertyValue) >= 1) {
                                    return "";
                                } else {
                                  /* As per the filter property's spec, convert the decimal value to a whole number and wrap the value. */
                                  return "alpha(opacity=" + parseInt(parseFloat(propertyValue) * 100, 10) + ")";
                                }
                        }
                    /* With all other browsers, normalization is not required; return the same values that were passed in. */
                    } else {
                        switch (type) {
                            case "name":
                                return "opacity";
                            case "extract":
                                return propertyValue;
                            case "inject":
                                return propertyValue;
                        }
                    }
                }
            },

            /*****************************
                Batched Registrations
            *****************************/

            /* Note: Batched normalizations extend the CSS.Normalizations.registered object. */
            register: function () {

                /*****************
                    Transforms
                *****************/

                /* Transforms are the subproperties contained by the CSS "transform" property. Transforms must undergo normalization
                   so that they can be referenced in a properties map by their individual names. */
                /* Note: When transforms are "set", they are actually assigned to a per-element transformCache. When all transform
                   setting is complete complete, CSS.flushTransformCache() must be manually called to flush the values to the DOM.
                   Transform setting is batched in this way to improve performance: the transform style only needs to be updated
                   once when multiple transform subproperties are being animated simultaneously. */
                /* Note: IE9 and Android Gingerbread have support for 2D -- but not 3D -- transforms. Since animating unsupported
                   transform properties results in the browser ignoring the *entire* transform string, we prevent these 3D values
                   from being normalized for these browsers so that tweening skips these properties altogether
                   (since it will ignore them as being unsupported by the browser.) */
                if (!(IE <= 9) && !Velocity.State.isGingerbread) {
                    /* Note: Since the standalone CSS "perspective" property and the CSS transform "perspective" subproperty
                    share the same name, the latter is given a unique token within Velocity: "transformPerspective". */
                    CSS.Lists.transformsBase = CSS.Lists.transformsBase.concat(CSS.Lists.transforms3D);
                }

                for (var i = 0; i < CSS.Lists.transformsBase.length; i++) {
                    /* Wrap the dynamically generated normalization function in a new scope so that transformName's value is
                    paired with its respective function. (Otherwise, all functions would take the final for loop's transformName.) */
                    (function() {
                        var transformName = CSS.Lists.transformsBase[i];

                        CSS.Normalizations.registered[transformName] = function (type, element, propertyValue) {
                            switch (type) {
                                /* The normalized property name is the parent "transform" property -- the property that is actually set in CSS. */
                                case "name":
                                    return "transform";
                                /* Transform values are cached onto a per-element transformCache object. */
                                case "extract":
                                    /* If this transform has yet to be assigned a value, return its null value. */
                                    if (Data(element) === undefined || Data(element).transformCache[transformName] === undefined) {
                                        /* Scale CSS.Lists.transformsBase default to 1 whereas all other transform properties default to 0. */
                                        return /^scale/i.test(transformName) ? 1 : 0;
                                    /* When transform values are set, they are wrapped in parentheses as per the CSS spec.
                                       Thus, when extracting their values (for tween calculations), we strip off the parentheses. */
                                    } else {
                                        return Data(element).transformCache[transformName].replace(/[()]/g, "");
                                    }
                                case "inject":
                                    var invalid = false;

                                    /* If an individual transform property contains an unsupported unit type, the browser ignores the *entire* transform property.
                                       Thus, protect users from themselves by skipping setting for transform values supplied with invalid unit types. */
                                    /* Switch on the base transform type; ignore the axis by removing the last letter from the transform's name. */
                                    switch (transformName.substr(0, transformName.length - 1)) {
                                        /* Whitelist unit types for each transform. */
                                        case "translate":
                                            invalid = !/(%|px|em|rem|vw|vh|\d)$/i.test(propertyValue);
                                            break;
                                        /* Since an axis-free "scale" property is supported as well, a little hack is used here to detect it by chopping off its last letter. */
                                        case "scal":
                                        case "scale":
                                            /* Chrome on Android has a bug in which scaled elements blur if their initial scale
                                               value is below 1 (which can happen with forcefeeding). Thus, we detect a yet-unset scale property
                                               and ensure that its first value is always 1. More info: http://stackoverflow.com/questions/10417890/css3-animations-with-transform-causes-blurred-elements-on-webkit/10417962#10417962 */
                                            if (Velocity.State.isAndroid && Data(element).transformCache[transformName] === undefined && propertyValue < 1) {
                                                propertyValue = 1;
                                            }

                                            invalid = !/(\d)$/i.test(propertyValue);
                                            break;
                                        case "skew":
                                            invalid = !/(deg|\d)$/i.test(propertyValue);
                                            break;
                                        case "rotate":
                                            invalid = !/(deg|\d)$/i.test(propertyValue);
                                            break;
                                    }

                                    if (!invalid) {
                                        /* As per the CSS spec, wrap the value in parentheses. */
                                        Data(element).transformCache[transformName] = "(" + propertyValue + ")";
                                    }

                                    /* Although the value is set on the transformCache object, return the newly-updated value for the calling code to process as normal. */
                                    return Data(element).transformCache[transformName];
                            }
                        };
                    })();
                }

                /*************
                    Colors
                *************/

                /* Since Velocity only animates a single numeric value per property, color animation is achieved by hooking the individual RGBA components of CSS color properties.
                   Accordingly, color values must be normalized (e.g. "#ff0000", "red", and "rgb(255, 0, 0)" ==> "255 0 0 1") so that their components can be injected/extracted by CSS.Hooks logic. */
                for (var i = 0; i < CSS.Lists.colors.length; i++) {
                    /* Wrap the dynamically generated normalization function in a new scope so that colorName's value is paired with its respective function.
                       (Otherwise, all functions would take the final for loop's colorName.) */
                    (function () {
                        var colorName = CSS.Lists.colors[i];

                        /* Note: In IE<=8, which support rgb but not rgba, color properties are reverted to rgb by stripping off the alpha component. */
                        CSS.Normalizations.registered[colorName] = function(type, element, propertyValue) {
                            switch (type) {
                                case "name":
                                    return colorName;
                                /* Convert all color values into the rgb format. (Old IE can return hex values and color names instead of rgb/rgba.) */
                                case "extract":
                                    var extracted;

                                    /* If the color is already in its hookable form (e.g. "255 255 255 1") due to having been previously extracted, skip extraction. */
                                    if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                                        extracted = propertyValue;
                                    } else {
                                        var converted,
                                            colorNames = {
                                                black: "rgb(0, 0, 0)",
                                                blue: "rgb(0, 0, 255)",
                                                gray: "rgb(128, 128, 128)",
                                                green: "rgb(0, 128, 0)",
                                                red: "rgb(255, 0, 0)",
                                                white: "rgb(255, 255, 255)"
                                            };

                                        /* Convert color names to rgb. */
                                        if (/^[A-z]+$/i.test(propertyValue)) {
                                            if (colorNames[propertyValue] !== undefined) {
                                                converted = colorNames[propertyValue]
                                            } else {
                                                /* If an unmatched color name is provided, default to black. */
                                                converted = colorNames.black;
                                            }
                                        /* Convert hex values to rgb. */
                                        } else if (CSS.RegEx.isHex.test(propertyValue)) {
                                            converted = "rgb(" + CSS.Values.hexToRgb(propertyValue).join(" ") + ")";
                                        /* If the provided color doesn't match any of the accepted color formats, default to black. */
                                        } else if (!(/^rgba?\(/i.test(propertyValue))) {
                                            converted = colorNames.black;
                                        }

                                        /* Remove the surrounding "rgb/rgba()" string then replace commas with spaces and strip
                                           repeated spaces (in case the value included spaces to begin with). */
                                        extracted = (converted || propertyValue).toString().match(CSS.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ");
                                    }

                                    /* So long as this isn't <=IE8, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                                    if (!(IE <= 8) && extracted.split(" ").length === 3) {
                                        extracted += " 1";
                                    }

                                    return extracted;
                                case "inject":
                                    /* If this is IE<=8 and an alpha component exists, strip it off. */
                                    if (IE <= 8) {
                                        if (propertyValue.split(" ").length === 4) {
                                            propertyValue = propertyValue.split(/\s+/).slice(0, 3).join(" ");
                                        }
                                    /* Otherwise, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                                    } else if (propertyValue.split(" ").length === 3) {
                                        propertyValue += " 1";
                                    }

                                    /* Re-insert the browser-appropriate wrapper("rgb/rgba()"), insert commas, and strip off decimal units
                                       on all values but the fourth (R, G, and B only accept whole numbers). */
                                    return (IE <= 8 ? "rgb" : "rgba") + "(" + propertyValue.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")";
                            }
                        };
                    })();
                }
            }
        },

        /************************
           CSS Property Names
        ************************/

        Names: {
            /* Camelcase a property name into its JavaScript notation (e.g. "background-color" ==> "backgroundColor").
               Camelcasing is used to normalize property names between and across calls. */
            camelCase: function (property) {
                return property.replace(/-(\w)/g, function (match, subMatch) {
                    return subMatch.toUpperCase();
                });
            },

            /* For SVG elements, some properties (namely, dimensional ones) are GET/SET via the element's HTML attributes (instead of via CSS styles). */
            SVGAttribute: function (property) {
                var SVGAttributes = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";

                /* Certain browsers require an SVG transform to be applied as an attribute. (Otherwise, application via CSS is preferable due to 3D support.) */
                if (IE || (Velocity.State.isAndroid && !Velocity.State.isChrome)) {
                    SVGAttributes += "|transform";
                }

                return new RegExp("^(" + SVGAttributes + ")$", "i").test(property);
            },

            /* Determine whether a property should be set with a vendor prefix. */
            /* If a prefixed version of the property exists, return it. Otherwise, return the original property name.
               If the property is not at all supported by the browser, return a false flag. */
            prefixCheck: function (property) {
                /* If this property has already been checked, return the cached value. */
                if (Velocity.State.prefixMatches[property]) {
                    return [ Velocity.State.prefixMatches[property], true ];
                } else {
                    var vendors = [ "", "Webkit", "Moz", "ms", "O" ];

                    for (var i = 0, vendorsLength = vendors.length; i < vendorsLength; i++) {
                        var propertyPrefixed;

                        if (i === 0) {
                            propertyPrefixed = property;
                        } else {
                            /* Capitalize the first letter of the property to conform to JavaScript vendor prefix notation (e.g. webkitFilter). */
                            propertyPrefixed = vendors[i] + property.replace(/^\w/, function(match) { return match.toUpperCase(); });
                        }

                        /* Check if the browser supports this property as prefixed. */
                        if (Type.isString(Velocity.State.prefixElement.style[propertyPrefixed])) {
                            /* Cache the match. */
                            Velocity.State.prefixMatches[property] = propertyPrefixed;

                            return [ propertyPrefixed, true ];
                        }
                    }

                    /* If the browser doesn't support this property in any form, include a false flag so that the caller can decide how to proceed. */
                    return [ property, false ];
                }
            }
        },

        /************************
           CSS Property Values
        ************************/

        Values: {
            /* Hex to RGB conversion. Copyright Tim Down: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
            hexToRgb: function (hex) {
                var shortformRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                    longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
                    rgbParts;

                hex = hex.replace(shortformRegex, function (m, r, g, b) {
                    return r + r + g + g + b + b;
                });

                rgbParts = longformRegex.exec(hex);

                return rgbParts ? [ parseInt(rgbParts[1], 16), parseInt(rgbParts[2], 16), parseInt(rgbParts[3], 16) ] : [ 0, 0, 0 ];
            },

            isCSSNullValue: function (value) {
                /* The browser defaults CSS values that have not been set to either 0 or one of several possible null-value strings.
                   Thus, we check for both falsiness and these special strings. */
                /* Null-value checking is performed to default the special strings to 0 (for the sake of tweening) or their hook
                   templates as defined as CSS.Hooks (for the sake of hook injection/extraction). */
                /* Note: Chrome returns "rgba(0, 0, 0, 0)" for an undefined color whereas IE returns "transparent". */
                return (value == 0 || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(value));
            },

            /* Retrieve a property's default unit type. Used for assigning a unit type when one is not supplied by the user. */
            getUnitType: function (property) {
                if (/^(rotate|skew)/i.test(property)) {
                    return "deg";
                } else if (/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
                    /* The above properties are unitless. */
                    return "";
                } else {
                    /* Default to px for all other properties. */
                    return "px";
                }
            },

            /* HTML elements default to an associated display type when they're not set to display:none. */
            /* Note: This function is used for correctly setting the non-"none" display value in certain Velocity redirects, such as fadeIn/Out. */
            getDisplayType: function (element) {
                var tagName = element && element.tagName.toString().toLowerCase();

                if (/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(tagName)) {
                    return "inline";
                } else if (/^(li)$/i.test(tagName)) {
                    return "list-item";
                } else if (/^(tr)$/i.test(tagName)) {
                    return "table-row";
                } else if (/^(table)$/i.test(tagName)) {
                    return "table";
                } else if (/^(tbody)$/i.test(tagName)) {
                    return "table-row-group";
                /* Default to "block" when no match is found. */
                } else {
                    return "block";
                }
            },

            /* The class add/remove functions are used to temporarily apply a "velocity-animating" class to elements while they're animating. */
            addClass: function (element, className) {
                if (element.classList) {
                    element.classList.add(className);
                } else {
                    element.className += (element.className.length ? " " : "") + className;
                }
            },

            removeClass: function (element, className) {
                if (element.classList) {
                    element.classList.remove(className);
                } else {
                    element.className = element.className.toString().replace(new RegExp("(^|\\s)" + className.split(" ").join("|") + "(\\s|$)", "gi"), " ");
                }
            }
        },

        /****************************
           Style Getting & Setting
        ****************************/

        /* The singular getPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
        getPropertyValue: function (element, property, rootPropertyValue, forceStyleLookup) {
            /* Get an element's computed property value. */
            /* Note: Retrieving the value of a CSS property cannot simply be performed by checking an element's
               style attribute (which only reflects user-defined values). Instead, the browser must be queried for a property's
               *computed* value. You can read more about getComputedStyle here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
            function computePropertyValue (element, property) {
                /* When box-sizing isn't set to border-box, height and width style values are incorrectly computed when an
                   element's scrollbars are visible (which expands the element's dimensions). Thus, we defer to the more accurate
                   offsetHeight/Width property, which includes the total dimensions for interior, border, padding, and scrollbar.
                   We subtract border and padding to get the sum of interior + scrollbar. */
                var computedValue = 0;

                /* IE<=8 doesn't support window.getComputedStyle, thus we defer to jQuery, which has an extensive array
                   of hacks to accurately retrieve IE8 property values. Re-implementing that logic here is not worth bloating the
                   codebase for a dying browser. The performance repercussions of using jQuery here are minimal since
                   Velocity is optimized to rarely (and sometimes never) query the DOM. Further, the $.css() codepath isn't that slow. */
                if (IE <= 8) {
                    computedValue = $.css(element, property); /* GET */
                /* All other browsers support getComputedStyle. The returned live object reference is cached onto its
                   associated element so that it does not need to be refetched upon every GET. */
                } else {
                    /* Browsers do not return height and width values for elements that are set to display:"none". Thus, we temporarily
                       toggle display to the element type's default value. */
                    var toggleDisplay = false;

                    if (/^(width|height)$/.test(property) && CSS.getPropertyValue(element, "display") === 0) {
                        toggleDisplay = true;
                        CSS.setPropertyValue(element, "display", CSS.Values.getDisplayType(element));
                    }

                    function revertDisplay () {
                        if (toggleDisplay) {
                            CSS.setPropertyValue(element, "display", "none");
                        }
                    }

                    if (!forceStyleLookup) {
                        if (property === "height" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                            var contentBoxHeight = element.offsetHeight - (parseFloat(CSS.getPropertyValue(element, "borderTopWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderBottomWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingTop")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingBottom")) || 0);
                            revertDisplay();

                            return contentBoxHeight;
                        } else if (property === "width" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                            var contentBoxWidth = element.offsetWidth - (parseFloat(CSS.getPropertyValue(element, "borderLeftWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderRightWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingLeft")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingRight")) || 0);
                            revertDisplay();

                            return contentBoxWidth;
                        }
                    }

                    var computedStyle;

                    /* For elements that Velocity hasn't been called on directly (e.g. when Velocity queries the DOM on behalf
                       of a parent of an element its animating), perform a direct getComputedStyle lookup since the object isn't cached. */
                    if (Data(element) === undefined) {
                        computedStyle = window.getComputedStyle(element, null); /* GET */
                    /* If the computedStyle object has yet to be cached, do so now. */
                    } else if (!Data(element).computedStyle) {
                        computedStyle = Data(element).computedStyle = window.getComputedStyle(element, null); /* GET */
                    /* If computedStyle is cached, use it. */
                    } else {
                        computedStyle = Data(element).computedStyle;
                    }

                    /* IE and Firefox do not return a value for the generic borderColor -- they only return individual values for each border side's color.
                       Also, in all browsers, when border colors aren't all the same, a compound value is returned that Velocity isn't setup to parse.
                       So, as a polyfill for querying individual border side colors, we just return the top border's color and animate all borders from that value. */
                    if (property === "borderColor") {
                        property = "borderTopColor";
                    }

                    /* IE9 has a bug in which the "filter" property must be accessed from computedStyle using the getPropertyValue method
                       instead of a direct property lookup. The getPropertyValue method is slower than a direct lookup, which is why we avoid it by default. */
                    if (IE === 9 && property === "filter") {
                        computedValue = computedStyle.getPropertyValue(property); /* GET */
                    } else {
                        computedValue = computedStyle[property];
                    }

                    /* Fall back to the property's style value (if defined) when computedValue returns nothing,
                       which can happen when the element hasn't been painted. */
                    if (computedValue === "" || computedValue === null) {
                        computedValue = element.style[property];
                    }

                    revertDisplay();
                }

                /* For top, right, bottom, and left (TRBL) values that are set to "auto" on elements of "fixed" or "absolute" position,
                   defer to jQuery for converting "auto" to a numeric value. (For elements with a "static" or "relative" position, "auto" has the same
                   effect as being set to 0, so no conversion is necessary.) */
                /* An example of why numeric conversion is necessary: When an element with "position:absolute" has an untouched "left"
                   property, which reverts to "auto", left's value is 0 relative to its parent element, but is often non-zero relative
                   to its *containing* (not parent) element, which is the nearest "position:relative" ancestor or the viewport (and always the viewport in the case of "position:fixed"). */
                if (computedValue === "auto" && /^(top|right|bottom|left)$/i.test(property)) {
                    var position = computePropertyValue(element, "position"); /* GET */

                    /* For absolute positioning, jQuery's $.position() only returns values for top and left;
                       right and bottom will have their "auto" value reverted to 0. */
                    /* Note: A jQuery object must be created here since jQuery doesn't have a low-level alias for $.position().
                       Not a big deal since we're currently in a GET batch anyway. */
                    if (position === "fixed" || (position === "absolute" && /top|left/i.test(property))) {
                        /* Note: jQuery strips the pixel unit from its returned values; we re-add it here to conform with computePropertyValue's behavior. */
                        computedValue = $(element).position()[property] + "px"; /* GET */
                    }
                }

                return computedValue;
            }

            var propertyValue;

            /* If this is a hooked property (e.g. "clipLeft" instead of the root property of "clip"),
               extract the hook's value from a normalized rootPropertyValue using CSS.Hooks.extractValue(). */
            if (CSS.Hooks.registered[property]) {
                var hook = property,
                    hookRoot = CSS.Hooks.getRoot(hook);

                /* If a cached rootPropertyValue wasn't passed in (which Velocity always attempts to do in order to avoid requerying the DOM),
                   query the DOM for the root property's value. */
                if (rootPropertyValue === undefined) {
                    /* Since the browser is now being directly queried, use the official post-prefixing property name for this lookup. */
                    rootPropertyValue = CSS.getPropertyValue(element, CSS.Names.prefixCheck(hookRoot)[0]); /* GET */
                }

                /* If this root has a normalization registered, peform the associated normalization extraction. */
                if (CSS.Normalizations.registered[hookRoot]) {
                    rootPropertyValue = CSS.Normalizations.registered[hookRoot]("extract", element, rootPropertyValue);
                }

                /* Extract the hook's value. */
                propertyValue = CSS.Hooks.extractValue(hook, rootPropertyValue);

            /* If this is a normalized property (e.g. "opacity" becomes "filter" in <=IE8) or "translateX" becomes "transform"),
               normalize the property's name and value, and handle the special case of transforms. */
            /* Note: Normalizing a property is mutually exclusive from hooking a property since hook-extracted values are strictly
               numerical and therefore do not require normalization extraction. */
            } else if (CSS.Normalizations.registered[property]) {
                var normalizedPropertyName,
                    normalizedPropertyValue;

                normalizedPropertyName = CSS.Normalizations.registered[property]("name", element);

                /* Transform values are calculated via normalization extraction (see below), which checks against the element's transformCache.
                   At no point do transform GETs ever actually query the DOM; initial stylesheet values are never processed.
                   This is because parsing 3D transform matrices is not always accurate and would bloat our codebase;
                   thus, normalization extraction defaults initial transform values to their zero-values (e.g. 1 for scaleX and 0 for translateX). */
                if (normalizedPropertyName !== "transform") {
                    normalizedPropertyValue = computePropertyValue(element, CSS.Names.prefixCheck(normalizedPropertyName)[0]); /* GET */

                    /* If the value is a CSS null-value and this property has a hook template, use that zero-value template so that hooks can be extracted from it. */
                    if (CSS.Values.isCSSNullValue(normalizedPropertyValue) && CSS.Hooks.templates[property]) {
                        normalizedPropertyValue = CSS.Hooks.templates[property][1];
                    }
                }

                propertyValue = CSS.Normalizations.registered[property]("extract", element, normalizedPropertyValue);
            }

            /* If a (numeric) value wasn't produced via hook extraction or normalization, query the DOM. */
            if (!/^[\d-]/.test(propertyValue)) {
                /* For SVG elements, dimensional properties (which SVGAttribute() detects) are tweened via
                   their HTML attribute values instead of their CSS style values. */
                if (Data(element) && Data(element).isSVG && CSS.Names.SVGAttribute(property)) {
                    /* Since the height/width attribute values must be set manually, they don't reflect computed values.
                       Thus, we use use getBBox() to ensure we always get values for elements with undefined height/width attributes. */
                    if (/^(height|width)$/i.test(property)) {
                        /* Firefox throws an error if .getBBox() is called on an SVG that isn't attached to the DOM. */
                        try {
                            propertyValue = element.getBBox()[property];
                        } catch (error) {
                            propertyValue = 0;
                        }
                    /* Otherwise, access the attribute value directly. */
                    } else {
                        propertyValue = element.getAttribute(property);
                    }
                } else {
                    propertyValue = computePropertyValue(element, CSS.Names.prefixCheck(property)[0]); /* GET */
                }
            }

            /* Since property lookups are for animation purposes (which entails computing the numeric delta between start and end values),
               convert CSS null-values to an integer of value 0. */
            if (CSS.Values.isCSSNullValue(propertyValue)) {
                propertyValue = 0;
            }

            if (Velocity.debug >= 2) console.log("Get " + property + ": " + propertyValue);

            return propertyValue;
        },

        /* The singular setPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
        setPropertyValue: function(element, property, propertyValue, rootPropertyValue, scrollData) {
            var propertyName = property;

            /* In order to be subjected to call options and element queueing, scroll animation is routed through Velocity as if it were a standard CSS property. */
            if (property === "scroll") {
                /* If a container option is present, scroll the container instead of the browser window. */
                if (scrollData.container) {
                    scrollData.container["scroll" + scrollData.direction] = propertyValue;
                /* Otherwise, Velocity defaults to scrolling the browser window. */
                } else {
                    if (scrollData.direction === "Left") {
                        window.scrollTo(propertyValue, scrollData.alternateValue);
                    } else {
                        window.scrollTo(scrollData.alternateValue, propertyValue);
                    }
                }
            } else {
                /* Transforms (translateX, rotateZ, etc.) are applied to a per-element transformCache object, which is manually flushed via flushTransformCache().
                   Thus, for now, we merely cache transforms being SET. */
                if (CSS.Normalizations.registered[property] && CSS.Normalizations.registered[property]("name", element) === "transform") {
                    /* Perform a normalization injection. */
                    /* Note: The normalization logic handles the transformCache updating. */
                    CSS.Normalizations.registered[property]("inject", element, propertyValue);

                    propertyName = "transform";
                    propertyValue = Data(element).transformCache[property];
                } else {
                    /* Inject hooks. */
                    if (CSS.Hooks.registered[property]) {
                        var hookName = property,
                            hookRoot = CSS.Hooks.getRoot(property);

                        /* If a cached rootPropertyValue was not provided, query the DOM for the hookRoot's current value. */
                        rootPropertyValue = rootPropertyValue || CSS.getPropertyValue(element, hookRoot); /* GET */

                        propertyValue = CSS.Hooks.injectValue(hookName, propertyValue, rootPropertyValue);
                        property = hookRoot;
                    }

                    /* Normalize names and values. */
                    if (CSS.Normalizations.registered[property]) {
                        propertyValue = CSS.Normalizations.registered[property]("inject", element, propertyValue);
                        property = CSS.Normalizations.registered[property]("name", element);
                    }

                    /* Assign the appropriate vendor prefix before performing an official style update. */
                    propertyName = CSS.Names.prefixCheck(property)[0];

                    /* A try/catch is used for IE<=8, which throws an error when "invalid" CSS values are set, e.g. a negative width.
                       Try/catch is avoided for other browsers since it incurs a performance overhead. */
                    if (IE <= 8) {
                        try {
                            element.style[propertyName] = propertyValue;
                        } catch (error) { if (Velocity.debug) console.log("Browser does not support [" + propertyValue + "] for [" + propertyName + "]"); }
                    /* SVG elements have their dimensional properties (width, height, x, y, cx, etc.) applied directly as attributes instead of as styles. */
                    /* Note: IE8 does not support SVG elements, so it's okay that we skip it for SVG animation. */
                    } else if (Data(element) && Data(element).isSVG && CSS.Names.SVGAttribute(property)) {
                        /* Note: For SVG attributes, vendor-prefixed property names are never used. */
                        /* Note: Not all CSS properties can be animated via attributes, but the browser won't throw an error for unsupported properties. */
                        element.setAttribute(property, propertyValue);
                    } else {
                        element.style[propertyName] = propertyValue;
                    }

                    if (Velocity.debug >= 2) console.log("Set " + property + " (" + propertyName + "): " + propertyValue);
                }
            }

            /* Return the normalized property name and value in case the caller wants to know how these values were modified before being applied to the DOM. */
            return [ propertyName, propertyValue ];
        },

        /* To increase performance by batching transform updates into a single SET, transforms are not directly applied to an element until flushTransformCache() is called. */
        /* Note: Velocity applies transform properties in the same order that they are chronogically introduced to the element's CSS styles. */
        flushTransformCache: function(element) {
            var transformString = "";

            /* Certain browsers require that SVG transforms be applied as an attribute. However, the SVG transform attribute takes a modified version of CSS's transform string
               (units are dropped and, except for skewX/Y, subproperties are merged into their master property -- e.g. scaleX and scaleY are merged into scale(X Y). */
            if ((IE || (Velocity.State.isAndroid && !Velocity.State.isChrome)) && Data(element).isSVG) {
                /* Since transform values are stored in their parentheses-wrapped form, we use a helper function to strip out their numeric values.
                   Further, SVG transform properties only take unitless (representing pixels) values, so it's okay that parseFloat() strips the unit suffixed to the float value. */
                function getTransformFloat (transformProperty) {
                    return parseFloat(CSS.getPropertyValue(element, transformProperty));
                }

                /* Create an object to organize all the transforms that we'll apply to the SVG element. To keep the logic simple,
                   we process *all* transform properties -- even those that may not be explicitly applied (since they default to their zero-values anyway). */
                var SVGTransforms = {
                    translate: [ getTransformFloat("translateX"), getTransformFloat("translateY") ],
                    skewX: [ getTransformFloat("skewX") ], skewY: [ getTransformFloat("skewY") ],
                    /* If the scale property is set (non-1), use that value for the scaleX and scaleY values
                       (this behavior mimics the result of animating all these properties at once on HTML elements). */
                    scale: getTransformFloat("scale") !== 1 ? [ getTransformFloat("scale"), getTransformFloat("scale") ] : [ getTransformFloat("scaleX"), getTransformFloat("scaleY") ],
                    /* Note: SVG's rotate transform takes three values: rotation degrees followed by the X and Y values
                       defining the rotation's origin point. We ignore the origin values (default them to 0). */
                    rotate: [ getTransformFloat("rotateZ"), 0, 0 ]
                };

                /* Iterate through the transform properties in the user-defined property map order.
                   (This mimics the behavior of non-SVG transform animation.) */
                $.each(Data(element).transformCache, function(transformName) {
                    /* Except for with skewX/Y, revert the axis-specific transform subproperties to their axis-free master
                       properties so that they match up with SVG's accepted transform properties. */
                    if (/^translate/i.test(transformName)) {
                        transformName = "translate";
                    } else if (/^scale/i.test(transformName)) {
                        transformName = "scale";
                    } else if (/^rotate/i.test(transformName)) {
                        transformName = "rotate";
                    }

                    /* Check that we haven't yet deleted the property from the SVGTransforms container. */
                    if (SVGTransforms[transformName]) {
                        /* Append the transform property in the SVG-supported transform format. As per the spec, surround the space-delimited values in parentheses. */
                        transformString += transformName + "(" + SVGTransforms[transformName].join(" ") + ")" + " ";

                        /* After processing an SVG transform property, delete it from the SVGTransforms container so we don't
                           re-insert the same master property if we encounter another one of its axis-specific properties. */
                        delete SVGTransforms[transformName];
                    }
                });
            } else {
                var transformValue,
                    perspective;

                /* Transform properties are stored as members of the transformCache object. Concatenate all the members into a string. */
                $.each(Data(element).transformCache, function(transformName) {
                    transformValue = Data(element).transformCache[transformName];

                    /* Transform's perspective subproperty must be set first in order to take effect. Store it temporarily. */
                    if (transformName === "transformPerspective") {
                        perspective = transformValue;
                        return true;
                    }

                    /* IE9 only supports one rotation type, rotateZ, which it refers to as "rotate". */
                    if (IE === 9 && transformName === "rotateZ") {
                        transformName = "rotate";
                    }

                    transformString += transformName + transformValue + " ";
                });

                /* If present, set the perspective subproperty first. */
                if (perspective) {
                    transformString = "perspective" + perspective + " " + transformString;
                }
            }

            CSS.setPropertyValue(element, "transform", transformString);
        }
    };

    /* Register hooks and normalizations. */
    CSS.Hooks.register();
    CSS.Normalizations.register();

    /* Allow hook setting in the same fashion as jQuery's $.css(). */
    Velocity.hook = function (elements, arg2, arg3) {
        var value = undefined;

        elements = sanitizeElements(elements);

        $.each(elements, function(i, element) {
            /* Initialize Velocity's per-element data cache if this element hasn't previously been animated. */
            if (Data(element) === undefined) {
                Velocity.init(element);
            }

            /* Get property value. If an element set was passed in, only return the value for the first element. */
            if (arg3 === undefined) {
                if (value === undefined) {
                    value = Velocity.CSS.getPropertyValue(element, arg2);
                }
            /* Set property value. */
            } else {
                /* sPV returns an array of the normalized propertyName/propertyValue pair used to update the DOM. */
                var adjustedSet = Velocity.CSS.setPropertyValue(element, arg2, arg3);

                /* Transform properties don't automatically set. They have to be flushed to the DOM. */
                if (adjustedSet[0] === "transform") {
                    Velocity.CSS.flushTransformCache(element);
                }

                value = adjustedSet;
            }
        });

        return value;
    };

    /*****************
        Animation
    *****************/

    var animate = function() {

        /******************
            Call Chain
        ******************/

        /* Logic for determining what to return to the call stack when exiting out of Velocity. */
        function getChain () {
            /* If we are using the utility function, attempt to return this call's promise. If no promise library was detected,
               default to null instead of returning the targeted elements so that utility function's return value is standardized. */
            if (isUtility) {
                return promiseData.promise || null;
            /* Otherwise, if we're using $.fn, return the jQuery-/Zepto-wrapped element set. */
            } else {
                return elementsWrapped;
            }
        }

        /*************************
           Arguments Assignment
        *************************/

        /* To allow for expressive CoffeeScript code, Velocity supports an alternative syntax in which "elements" (or "e"), "properties" (or "p"), and "options" (or "o")
           objects are defined on a container object that's passed in as Velocity's sole argument. */
        /* Note: Some browsers automatically populate arguments with a "properties" object. We detect it by checking for its default "names" property. */
        var syntacticSugar = (arguments[0] && (arguments[0].p || (($.isPlainObject(arguments[0].properties) && !arguments[0].properties.names) || Type.isString(arguments[0].properties)))),
            /* Whether Velocity was called via the utility function (as opposed to on a jQuery/Zepto object). */
            isUtility,
            /* When Velocity is called via the utility function ($.Velocity()/Velocity()), elements are explicitly
               passed in as the first parameter. Thus, argument positioning varies. We normalize them here. */
            elementsWrapped,
            argumentIndex;

        var elements,
            propertiesMap,
            options;

        /* Detect jQuery/Zepto elements being animated via the $.fn method. */
        if (Type.isWrapped(this)) {
            isUtility = false;

            argumentIndex = 0;
            elements = this;
            elementsWrapped = this;
        /* Otherwise, raw elements are being animated via the utility function. */
        } else {
            isUtility = true;

            argumentIndex = 1;
            elements = syntacticSugar ? (arguments[0].elements || arguments[0].e) : arguments[0];
        }

        elements = sanitizeElements(elements);

        if (!elements) {
            return;
        }

        if (syntacticSugar) {
            propertiesMap = arguments[0].properties || arguments[0].p;
            options = arguments[0].options || arguments[0].o;
        } else {
            propertiesMap = arguments[argumentIndex];
            options = arguments[argumentIndex + 1];
        }

        /* The length of the element set (in the form of a nodeList or an array of elements) is defaulted to 1 in case a
           single raw DOM element is passed in (which doesn't contain a length property). */
        var elementsLength = elements.length,
            elementsIndex = 0;

        /***************************
            Argument Overloading
        ***************************/

        /* Support is included for jQuery's argument overloading: $.animate(propertyMap [, duration] [, easing] [, complete]).
           Overloading is detected by checking for the absence of an object being passed into options. */
        /* Note: The stop and finish actions do not accept animation options, and are therefore excluded from this check. */
        if (!/^(stop|finish)$/i.test(propertiesMap) && !$.isPlainObject(options)) {
            /* The utility function shifts all arguments one position to the right, so we adjust for that offset. */
            var startingArgumentPosition = argumentIndex + 1;

            options = {};

            /* Iterate through all options arguments */
            for (var i = startingArgumentPosition; i < arguments.length; i++) {
                /* Treat a number as a duration. Parse it out. */
                /* Note: The following RegEx will return true if passed an array with a number as its first item.
                   Thus, arrays are skipped from this check. */
                if (!Type.isArray(arguments[i]) && (/^(fast|normal|slow)$/i.test(arguments[i]) || /^\d/.test(arguments[i]))) {
                    options.duration = arguments[i];
                /* Treat strings and arrays as easings. */
                } else if (Type.isString(arguments[i]) || Type.isArray(arguments[i])) {
                    options.easing = arguments[i];
                /* Treat a function as a complete callback. */
                } else if (Type.isFunction(arguments[i])) {
                    options.complete = arguments[i];
                }
            }
        }

        /***************
            Promises
        ***************/

        var promiseData = {
                promise: null,
                resolver: null,
                rejecter: null
            };

        /* If this call was made via the utility function (which is the default method of invocation when jQuery/Zepto are not being used), and if
           promise support was detected, create a promise object for this call and store references to its resolver and rejecter methods. The resolve
           method is used when a call completes naturally or is prematurely stopped by the user. In both cases, completeCall() handles the associated
           call cleanup and promise resolving logic. The reject method is used when an invalid set of arguments is passed into a Velocity call. */
        /* Note: Velocity employs a call-based queueing architecture, which means that stopping an animating element actually stops the full call that
           triggered it -- not that one element exclusively. Similarly, there is one promise per call, and all elements targeted by a Velocity call are
           grouped together for the purposes of resolving and rejecting a promise. */
        if (isUtility && Velocity.Promise) {
            promiseData.promise = new Velocity.Promise(function (resolve, reject) {
                promiseData.resolver = resolve;
                promiseData.rejecter = reject;
            });
        }

        /*********************
           Action Detection
        *********************/

        /* Velocity's behavior is categorized into "actions": Elements can either be specially scrolled into view,
           or they can be started, stopped, or reversed. If a literal or referenced properties map is passed in as Velocity's
           first argument, the associated action is "start". Alternatively, "scroll", "reverse", or "stop" can be passed in instead of a properties map. */
        var action;

        switch (propertiesMap) {
            case "scroll":
                action = "scroll";
                break;

            case "reverse":
                action = "reverse";
                break;

            case "finish":
            case "stop":
                /*******************
                    Action: Stop
                *******************/

                /* Clear the currently-active delay on each targeted element. */
                $.each(elements, function(i, element) {
                    if (Data(element) && Data(element).delayTimer) {
                        /* Stop the timer from triggering its cached next() function. */
                        clearTimeout(Data(element).delayTimer.setTimeout);

                        /* Manually call the next() function so that the subsequent queue items can progress. */
                        if (Data(element).delayTimer.next) {
                            Data(element).delayTimer.next();
                        }

                        delete Data(element).delayTimer;
                    }
                });

                var callsToStop = [];

                /* When the stop action is triggered, the elements' currently active call is immediately stopped. The active call might have
                   been applied to multiple elements, in which case all of the call's elements will be stopped. When an element
                   is stopped, the next item in its animation queue is immediately triggered. */
                /* An additional argument may be passed in to clear an element's remaining queued calls. Either true (which defaults to the "fx" queue)
                   or a custom queue string can be passed in. */
                /* Note: The stop command runs prior to Velocity's Queueing phase since its behavior is intended to take effect *immediately*,
                   regardless of the element's current queue state. */

                /* Iterate through every active call. */
                $.each(Velocity.State.calls, function(i, activeCall) {
                    /* Inactive calls are set to false by the logic inside completeCall(). Skip them. */
                    if (activeCall) {
                        /* Iterate through the active call's targeted elements. */
                        $.each(activeCall[1], function(k, activeElement) {
                            /* If true was passed in as a secondary argument, clear absolutely all calls on this element. Otherwise, only
                               clear calls associated with the relevant queue. */
                            /* Call stopping logic works as follows:
                               - options === true --> stop current default queue calls (and queue:false calls), including remaining queued ones.
                               - options === undefined --> stop current queue:"" call and all queue:false calls.
                               - options === false --> stop only queue:false calls.
                               - options === "custom" --> stop current queue:"custom" call, including remaining queued ones (there is no functionality to only clear the currently-running queue:"custom" call). */
                            var queueName = (options === undefined) ? "" : options;

                            if (queueName !== true && (activeCall[2].queue !== queueName) && !(options === undefined && activeCall[2].queue === false)) {
                                return true;
                            }

                            /* Iterate through the calls targeted by the stop command. */
                            $.each(elements, function(l, element) {
                                /* Check that this call was applied to the target element. */
                                if (element === activeElement) {
                                    /* Optionally clear the remaining queued calls. */
                                    if (options === true || Type.isString(options)) {
                                        /* Iterate through the items in the element's queue. */
                                        $.each($.queue(element, Type.isString(options) ? options : ""), function(_, item) {
                                            /* The queue array can contain an "inprogress" string, which we skip. */
                                            if (Type.isFunction(item)) {
                                                /* Pass the item's callback a flag indicating that we want to abort from the queue call.
                                                   (Specifically, the queue will resolve the call's associated promise then abort.)  */
                                                item(null, true);
                                            }
                                        });

                                        /* Clearing the $.queue() array is achieved by resetting it to []. */
                                        $.queue(element, Type.isString(options) ? options : "", []);
                                    }

                                    if (propertiesMap === "stop") {
                                        /* Since "reverse" uses cached start values (the previous call's endValues), these values must be
                                           changed to reflect the final value that the elements were actually tweened to. */
                                        /* Note: If only queue:false animations are currently running on an element, it won't have a tweensContainer
                                           object. Also, queue:false animations can't be reversed. */
                                        if (Data(element) && Data(element).tweensContainer && queueName !== false) {
                                            $.each(Data(element).tweensContainer, function(m, activeTween) {
                                                activeTween.endValue = activeTween.currentValue;
                                            });
                                        }

                                        callsToStop.push(i);
                                    } else if (propertiesMap === "finish") {
                                        /* To get active tweens to finish immediately, we forcefully shorten their durations to 1ms so that
                                        they finish upon the next rAf tick then proceed with normal call completion logic. */
                                        activeCall[2].duration = 1;
                                    }
                                }
                            });
                        });
                    }
                });

                /* Prematurely call completeCall() on each matched active call. Pass an additional flag for "stop" to indicate
                   that the complete callback and display:none setting should be skipped since we're completing prematurely. */
                if (propertiesMap === "stop") {
                    $.each(callsToStop, function(i, j) {
                        completeCall(j, true);
                    });

                    if (promiseData.promise) {
                        /* Immediately resolve the promise associated with this stop call since stop runs synchronously. */
                        promiseData.resolver(elements);
                    }
                }

                /* Since we're stopping, and not proceeding with queueing, exit out of Velocity. */
                return getChain();

            default:
                /* Treat a non-empty plain object as a literal properties map. */
                if ($.isPlainObject(propertiesMap) && !Type.isEmptyObject(propertiesMap)) {
                    action = "start";

                /****************
                    Redirects
                ****************/

                /* Check if a string matches a registered redirect (see Redirects above). */
                } else if (Type.isString(propertiesMap) && Velocity.Redirects[propertiesMap]) {
                    var opts = $.extend({}, options),
                        durationOriginal = opts.duration,
                        delayOriginal = opts.delay || 0;

                    /* If the backwards option was passed in, reverse the element set so that elements animate from the last to the first. */
                    if (opts.backwards === true) {
                        elements = $.extend(true, [], elements).reverse();
                    }

                    /* Individually trigger the redirect for each element in the set to prevent users from having to handle iteration logic in their redirect. */
                    $.each(elements, function(elementIndex, element) {
                        /* If the stagger option was passed in, successively delay each element by the stagger value (in ms). Retain the original delay value. */
                        if (parseFloat(opts.stagger)) {
                            opts.delay = delayOriginal + (parseFloat(opts.stagger) * elementIndex);
                        } else if (Type.isFunction(opts.stagger)) {
                            opts.delay = delayOriginal + opts.stagger.call(element, elementIndex, elementsLength);
                        }

                        /* If the drag option was passed in, successively increase/decrease (depending on the presense of opts.backwards)
                           the duration of each element's animation, using floors to prevent producing very short durations. */
                        if (opts.drag) {
                            /* Default the duration of UI pack effects (callouts and transitions) to 1000ms instead of the usual default duration of 400ms. */
                            opts.duration = parseFloat(durationOriginal) || (/^(callout|transition)/.test(propertiesMap) ? 1000 : DURATION_DEFAULT);

                            /* For each element, take the greater duration of: A) animation completion percentage relative to the original duration,
                               B) 75% of the original duration, or C) a 200ms fallback (in case duration is already set to a low value).
                               The end result is a baseline of 75% of the redirect's duration that increases/decreases as the end of the element set is approached. */
                            opts.duration = Math.max(opts.duration * (opts.backwards ? 1 - elementIndex/elementsLength : (elementIndex + 1) / elementsLength), opts.duration * 0.75, 200);
                        }

                        /* Pass in the call's opts object so that the redirect can optionally extend it. It defaults to an empty object instead of null to
                           reduce the opts checking logic required inside the redirect. */
                        Velocity.Redirects[propertiesMap].call(element, element, opts || {}, elementIndex, elementsLength, elements, promiseData.promise ? promiseData : undefined);
                    });

                    /* Since the animation logic resides within the redirect's own code, abort the remainder of this call.
                       (The performance overhead up to this point is virtually non-existant.) */
                    /* Note: The jQuery call chain is kept intact by returning the complete element set. */
                    return getChain();
                } else {
                    var abortError = "Velocity: First argument (" + propertiesMap + ") was not a property map, a known action, or a registered redirect. Aborting.";

                    if (promiseData.promise) {
                        promiseData.rejecter(new Error(abortError));
                    } else {
                        console.log(abortError);
                    }

                    return getChain();
                }
        }

        /**************************
            Call-Wide Variables
        **************************/

        /* A container for CSS unit conversion ratios (e.g. %, rem, and em ==> px) that is used to cache ratios across all elements
           being animated in a single Velocity call. Calculating unit ratios necessitates DOM querying and updating, and is therefore
           avoided (via caching) wherever possible. This container is call-wide instead of page-wide to avoid the risk of using stale
           conversion metrics across Velocity animations that are not immediately consecutively chained. */
        var callUnitConversionData = {
                lastParent: null,
                lastPosition: null,
                lastFontSize: null,
                lastPercentToPxWidth: null,
                lastPercentToPxHeight: null,
                lastEmToPx: null,
                remToPx: null,
                vwToPx: null,
                vhToPx: null
            };

        /* A container for all the ensuing tween data and metadata associated with this call. This container gets pushed to the page-wide
           Velocity.State.calls array that is processed during animation ticking. */
        var call = [];

        /************************
           Element Processing
        ************************/

        /* Element processing consists of three parts -- data processing that cannot go stale and data processing that *can* go stale (i.e. third-party style modifications):
           1) Pre-Queueing: Element-wide variables, including the element's data storage, are instantiated. Call options are prepared. If triggered, the Stop action is executed.
           2) Queueing: The logic that runs once this call has reached its point of execution in the element's $.queue() stack. Most logic is placed here to avoid risking it becoming stale.
           3) Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
        */

        function processElement () {

            /*************************
               Part I: Pre-Queueing
            *************************/

            /***************************
               Element-Wide Variables
            ***************************/

            var element = this,
                /* The runtime opts object is the extension of the current call's options and Velocity's page-wide option defaults. */
                opts = $.extend({}, Velocity.defaults, options),
                /* A container for the processed data associated with each property in the propertyMap.
                   (Each property in the map produces its own "tween".) */
                tweensContainer = {},
                elementUnitConversionData;

            /******************
               Element Init
            ******************/

            if (Data(element) === undefined) {
                Velocity.init(element);
            }

            /******************
               Option: Delay
            ******************/

            /* Since queue:false doesn't respect the item's existing queue, we avoid injecting its delay here (it's set later on). */
            /* Note: Velocity rolls its own delay function since jQuery doesn't have a utility alias for $.fn.delay()
               (and thus requires jQuery element creation, which we avoid since its overhead includes DOM querying). */
            if (parseFloat(opts.delay) && opts.queue !== false) {
                $.queue(element, opts.queue, function(next) {
                    /* This is a flag used to indicate to the upcoming completeCall() function that this queue entry was initiated by Velocity. See completeCall() for further details. */
                    Velocity.velocityQueueEntryFlag = true;

                    /* The ensuing queue item (which is assigned to the "next" argument that $.queue() automatically passes in) will be triggered after a setTimeout delay.
                       The setTimeout is stored so that it can be subjected to clearTimeout() if this animation is prematurely stopped via Velocity's "stop" command. */
                    Data(element).delayTimer = {
                        setTimeout: setTimeout(next, parseFloat(opts.delay)),
                        next: next
                    };
                });
            }

            /*********************
               Option: Duration
            *********************/

            /* Support for jQuery's named durations. */
            switch (opts.duration.toString().toLowerCase()) {
                case "fast":
                    opts.duration = 200;
                    break;

                case "normal":
                    opts.duration = DURATION_DEFAULT;
                    break;

                case "slow":
                    opts.duration = 600;
                    break;

                default:
                    /* Remove the potential "ms" suffix and default to 1 if the user is attempting to set a duration of 0 (in order to produce an immediate style change). */
                    opts.duration = parseFloat(opts.duration) || 1;
            }

            /************************
               Global Option: Mock
            ************************/

            if (Velocity.mock !== false) {
                /* In mock mode, all animations are forced to 1ms so that they occur immediately upon the next rAF tick.
                   Alternatively, a multiplier can be passed in to time remap all delays and durations. */
                if (Velocity.mock === true) {
                    opts.duration = opts.delay = 1;
                } else {
                    opts.duration *= parseFloat(Velocity.mock) || 1;
                    opts.delay *= parseFloat(Velocity.mock) || 1;
                }
            }

            /*******************
               Option: Easing
            *******************/

            opts.easing = getEasing(opts.easing, opts.duration);

            /**********************
               Option: Callbacks
            **********************/

            /* Callbacks must functions. Otherwise, default to null. */
            if (opts.begin && !Type.isFunction(opts.begin)) {
                opts.begin = null;
            }

            if (opts.progress && !Type.isFunction(opts.progress)) {
                opts.progress = null;
            }

            if (opts.complete && !Type.isFunction(opts.complete)) {
                opts.complete = null;
            }

            /*********************************
               Option: Display & Visibility
            *********************************/

            /* Refer to Velocity's documentation (VelocityJS.org/#displayAndVisibility) for a description of the display and visibility options' behavior. */
            /* Note: We strictly check for undefined instead of falsiness because display accepts an empty string value. */
            if (opts.display !== undefined && opts.display !== null) {
                opts.display = opts.display.toString().toLowerCase();

                /* Users can pass in a special "auto" value to instruct Velocity to set the element to its default display value. */
                if (opts.display === "auto") {
                    opts.display = Velocity.CSS.Values.getDisplayType(element);
                }
            }

            if (opts.visibility !== undefined && opts.visibility !== null) {
                opts.visibility = opts.visibility.toString().toLowerCase();
            }

            /**********************
               Option: mobileHA
            **********************/

            /* When set to true, and if this is a mobile device, mobileHA automatically enables hardware acceleration (via a null transform hack)
               on animating elements. HA is removed from the element at the completion of its animation. */
            /* Note: Android Gingerbread doesn't support HA. If a null transform hack (mobileHA) is in fact set, it will prevent other tranform subproperties from taking effect. */
            /* Note: You can read more about the use of mobileHA in Velocity's documentation: VelocityJS.org/#mobileHA. */
            opts.mobileHA = (opts.mobileHA && Velocity.State.isMobile && !Velocity.State.isGingerbread);

            /***********************
               Part II: Queueing
            ***********************/

            /* When a set of elements is targeted by a Velocity call, the set is broken up and each element has the current Velocity call individually queued onto it.
               In this way, each element's existing queue is respected; some elements may already be animating and accordingly should not have this current Velocity call triggered immediately. */
            /* In each queue, tween data is processed for each animating property then pushed onto the call-wide calls array. When the last element in the set has had its tweens processed,
               the call array is pushed to Velocity.State.calls for live processing by the requestAnimationFrame tick. */
            function buildQueue (next) {

                /*******************
                   Option: Begin
                *******************/

                /* The begin callback is fired once per call -- not once per elemenet -- and is passed the full raw DOM element set as both its context and its first argument. */
                if (opts.begin && elementsIndex === 0) {
                    /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
                    try {
                        opts.begin.call(elements, elements);
                    } catch (error) {
                        setTimeout(function() { throw error; }, 1);
                    }
                }

                /*****************************************
                   Tween Data Construction (for Scroll)
                *****************************************/

                /* Note: In order to be subjected to chaining and animation options, scroll's tweening is routed through Velocity as if it were a standard CSS property animation. */
                if (action === "scroll") {
                    /* The scroll action uniquely takes an optional "offset" option -- specified in pixels -- that offsets the targeted scroll position. */
                    var scrollDirection = (/^x$/i.test(opts.axis) ? "Left" : "Top"),
                        scrollOffset = parseFloat(opts.offset) || 0,
                        scrollPositionCurrent,
                        scrollPositionCurrentAlternate,
                        scrollPositionEnd;

                    /* Scroll also uniquely takes an optional "container" option, which indicates the parent element that should be scrolled --
                       as opposed to the browser window itself. This is useful for scrolling toward an element that's inside an overflowing parent element. */
                    if (opts.container) {
                        /* Ensure that either a jQuery object or a raw DOM element was passed in. */
                        if (Type.isWrapped(opts.container) || Type.isNode(opts.container)) {
                            /* Extract the raw DOM element from the jQuery wrapper. */
                            opts.container = opts.container[0] || opts.container;
                            /* Note: Unlike other properties in Velocity, the browser's scroll position is never cached since it so frequently changes
                               (due to the user's natural interaction with the page). */
                            scrollPositionCurrent = opts.container["scroll" + scrollDirection]; /* GET */

                            /* $.position() values are relative to the container's currently viewable area (without taking into account the container's true dimensions
                               -- say, for example, if the container was not overflowing). Thus, the scroll end value is the sum of the child element's position *and*
                               the scroll container's current scroll position. */
                            scrollPositionEnd = (scrollPositionCurrent + $(element).position()[scrollDirection.toLowerCase()]) + scrollOffset; /* GET */
                        /* If a value other than a jQuery object or a raw DOM element was passed in, default to null so that this option is ignored. */
                        } else {
                            opts.container = null;
                        }
                    } else {
                        /* If the window itself is being scrolled -- not a containing element -- perform a live scroll position lookup using
                           the appropriate cached property names (which differ based on browser type). */
                        scrollPositionCurrent = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + scrollDirection]]; /* GET */
                        /* When scrolling the browser window, cache the alternate axis's current value since window.scrollTo() doesn't let us change only one value at a time. */
                        scrollPositionCurrentAlternate = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + (scrollDirection === "Left" ? "Top" : "Left")]]; /* GET */

                        /* Unlike $.position(), $.offset() values are relative to the browser window's true dimensions -- not merely its currently viewable area --
                           and therefore end values do not need to be compounded onto current values. */
                        scrollPositionEnd = $(element).offset()[scrollDirection.toLowerCase()] + scrollOffset; /* GET */
                    }

                    /* Since there's only one format that scroll's associated tweensContainer can take, we create it manually. */
                    tweensContainer = {
                        scroll: {
                            rootPropertyValue: false,
                            startValue: scrollPositionCurrent,
                            currentValue: scrollPositionCurrent,
                            endValue: scrollPositionEnd,
                            unitType: "",
                            easing: opts.easing,
                            scrollData: {
                                container: opts.container,
                                direction: scrollDirection,
                                alternateValue: scrollPositionCurrentAlternate
                            }
                        },
                        element: element
                    };

                    if (Velocity.debug) console.log("tweensContainer (scroll): ", tweensContainer.scroll, element);

                /******************************************
                   Tween Data Construction (for Reverse)
                ******************************************/

                /* Reverse acts like a "start" action in that a property map is animated toward. The only difference is
                   that the property map used for reverse is the inverse of the map used in the previous call. Thus, we manipulate
                   the previous call to construct our new map: use the previous map's end values as our new map's start values. Copy over all other data. */
                /* Note: Reverse can be directly called via the "reverse" parameter, or it can be indirectly triggered via the loop option. (Loops are composed of multiple reverses.) */
                /* Note: Reverse calls do not need to be consecutively chained onto a currently-animating element in order to operate on cached values;
                   there is no harm to reverse being called on a potentially stale data cache since reverse's behavior is simply defined
                   as reverting to the element's values as they were prior to the previous *Velocity* call. */
                } else if (action === "reverse") {
                    /* Abort if there is no prior animation data to reverse to. */
                    if (!Data(element).tweensContainer) {
                        /* Dequeue the element so that this queue entry releases itself immediately, allowing subsequent queue entries to run. */
                        $.dequeue(element, opts.queue);

                        return;
                    } else {
                        /*********************
                           Options Parsing
                        *********************/

                        /* If the element was hidden via the display option in the previous call,
                           revert display to "auto" prior to reversal so that the element is visible again. */
                        if (Data(element).opts.display === "none") {
                            Data(element).opts.display = "auto";
                        }

                        if (Data(element).opts.visibility === "hidden") {
                            Data(element).opts.visibility = "visible";
                        }

                        /* If the loop option was set in the previous call, disable it so that "reverse" calls aren't recursively generated.
                           Further, remove the previous call's callback options; typically, users do not want these to be refired. */
                        Data(element).opts.loop = false;
                        Data(element).opts.begin = null;
                        Data(element).opts.complete = null;

                        /* Since we're extending an opts object that has already been extended with the defaults options object,
                           we remove non-explicitly-defined properties that are auto-assigned values. */
                        if (!options.easing) {
                            delete opts.easing;
                        }

                        if (!options.duration) {
                            delete opts.duration;
                        }

                        /* The opts object used for reversal is an extension of the options object optionally passed into this
                           reverse call plus the options used in the previous Velocity call. */
                        opts = $.extend({}, Data(element).opts, opts);

                        /*************************************
                           Tweens Container Reconstruction
                        *************************************/

                        /* Create a deepy copy (indicated via the true flag) of the previous call's tweensContainer. */
                        var lastTweensContainer = $.extend(true, {}, Data(element).tweensContainer);

                        /* Manipulate the previous tweensContainer by replacing its end values and currentValues with its start values. */
                        for (var lastTween in lastTweensContainer) {
                            /* In addition to tween data, tweensContainers contain an element property that we ignore here. */
                            if (lastTween !== "element") {
                                var lastStartValue = lastTweensContainer[lastTween].startValue;

                                lastTweensContainer[lastTween].startValue = lastTweensContainer[lastTween].currentValue = lastTweensContainer[lastTween].endValue;
                                lastTweensContainer[lastTween].endValue = lastStartValue;

                                /* Easing is the only option that embeds into the individual tween data (since it can be defined on a per-property basis).
                                   Accordingly, every property's easing value must be updated when an options object is passed in with a reverse call.
                                   The side effect of this extensibility is that all per-property easing values are forcefully reset to the new value. */
                                if (!Type.isEmptyObject(options)) {
                                    lastTweensContainer[lastTween].easing = opts.easing;
                                }

                                if (Velocity.debug) console.log("reverse tweensContainer (" + lastTween + "): " + JSON.stringify(lastTweensContainer[lastTween]), element);
                            }
                        }

                        tweensContainer = lastTweensContainer;
                    }

                /*****************************************
                   Tween Data Construction (for Start)
                *****************************************/

                } else if (action === "start") {

                    /*************************
                        Value Transferring
                    *************************/

                    /* If this queue entry follows a previous Velocity-initiated queue entry *and* if this entry was created
                       while the element was in the process of being animated by Velocity, then this current call is safe to use
                       the end values from the prior call as its start values. Velocity attempts to perform this value transfer
                       process whenever possible in order to avoid requerying the DOM. */
                    /* If values aren't transferred from a prior call and start values were not forcefed by the user (more on this below),
                       then the DOM is queried for the element's current values as a last resort. */
                    /* Note: Conversely, animation reversal (and looping) *always* perform inter-call value transfers; they never requery the DOM. */
                    var lastTweensContainer;

                    /* The per-element isAnimating flag is used to indicate whether it's safe (i.e. the data isn't stale)
                       to transfer over end values to use as start values. If it's set to true and there is a previous
                       Velocity call to pull values from, do so. */
                    if (Data(element).tweensContainer && Data(element).isAnimating === true) {
                        lastTweensContainer = Data(element).tweensContainer;
                    }

                    /***************************
                       Tween Data Calculation
                    ***************************/

                    /* This function parses property data and defaults endValue, easing, and startValue as appropriate. */
                    /* Property map values can either take the form of 1) a single value representing the end value,
                       or 2) an array in the form of [ endValue, [, easing] [, startValue] ].
                       The optional third parameter is a forcefed startValue to be used instead of querying the DOM for
                       the element's current value. Read Velocity's docmentation to learn more about forcefeeding: VelocityJS.org/#forcefeeding */
                    function parsePropertyValue (valueData, skipResolvingEasing) {
                        var endValue = undefined,
                            easing = undefined,
                            startValue = undefined;

                        /* Handle the array format, which can be structured as one of three potential overloads:
                           A) [ endValue, easing, startValue ], B) [ endValue, easing ], or C) [ endValue, startValue ] */
                        if (Type.isArray(valueData)) {
                            /* endValue is always the first item in the array. Don't bother validating endValue's value now
                               since the ensuing property cycling logic does that. */
                            endValue = valueData[0];

                            /* Two-item array format: If the second item is a number, function, or hex string, treat it as a
                               start value since easings can only be non-hex strings or arrays. */
                            if ((!Type.isArray(valueData[1]) && /^[\d-]/.test(valueData[1])) || Type.isFunction(valueData[1]) || CSS.RegEx.isHex.test(valueData[1])) {
                                startValue = valueData[1];
                            /* Two or three-item array: If the second item is a non-hex string or an array, treat it as an easing. */
                            } else if ((Type.isString(valueData[1]) && !CSS.RegEx.isHex.test(valueData[1])) || Type.isArray(valueData[1])) {
                                easing = skipResolvingEasing ? valueData[1] : getEasing(valueData[1], opts.duration);

                                /* Don't bother validating startValue's value now since the ensuing property cycling logic inherently does that. */
                                if (valueData[2] !== undefined) {
                                    startValue = valueData[2];
                                }
                            }
                        /* Handle the single-value format. */
                        } else {
                            endValue = valueData;
                        }

                        /* Default to the call's easing if a per-property easing type was not defined. */
                        if (!skipResolvingEasing) {
                            easing = easing || opts.easing;
                        }

                        /* If functions were passed in as values, pass the function the current element as its context,
                           plus the element's index and the element set's size as arguments. Then, assign the returned value. */
                        if (Type.isFunction(endValue)) {
                            endValue = endValue.call(element, elementsIndex, elementsLength);
                        }

                        if (Type.isFunction(startValue)) {
                            startValue = startValue.call(element, elementsIndex, elementsLength);
                        }

                        /* Allow startValue to be left as undefined to indicate to the ensuing code that its value was not forcefed. */
                        return [ endValue || 0, easing, startValue ];
                    }

                    /* Cycle through each property in the map, looking for shorthand color properties (e.g. "color" as opposed to "colorRed"). Inject the corresponding
                       colorRed, colorGreen, and colorBlue RGB component tweens into the propertiesMap (which Velocity understands) and remove the shorthand property. */
                    $.each(propertiesMap, function(property, value) {
                        /* Find shorthand color properties that have been passed a hex string. */
                        if (RegExp("^" + CSS.Lists.colors.join("$|^") + "$").test(property)) {
                            /* Parse the value data for each shorthand. */
                            var valueData = parsePropertyValue(value, true),
                                endValue = valueData[0],
                                easing = valueData[1],
                                startValue = valueData[2];

                            if (CSS.RegEx.isHex.test(endValue)) {
                                /* Convert the hex strings into their RGB component arrays. */
                                var colorComponents = [ "Red", "Green", "Blue" ],
                                    endValueRGB = CSS.Values.hexToRgb(endValue),
                                    startValueRGB = startValue ? CSS.Values.hexToRgb(startValue) : undefined;

                                /* Inject the RGB component tweens into propertiesMap. */
                                for (var i = 0; i < colorComponents.length; i++) {
                                    var dataArray = [ endValueRGB[i] ];

                                    if (easing) {
                                        dataArray.push(easing);
                                    }

                                    if (startValueRGB !== undefined) {
                                        dataArray.push(startValueRGB[i]);
                                    }

                                    propertiesMap[property + colorComponents[i]] = dataArray;
                                }

                                /* Remove the intermediary shorthand property entry now that we've processed it. */
                                delete propertiesMap[property];
                            }
                        }
                    });

                    /* Create a tween out of each property, and append its associated data to tweensContainer. */
                    for (var property in propertiesMap) {

                        /**************************
                           Start Value Sourcing
                        **************************/

                        /* Parse out endValue, easing, and startValue from the property's data. */
                        var valueData = parsePropertyValue(propertiesMap[property]),
                            endValue = valueData[0],
                            easing = valueData[1],
                            startValue = valueData[2];

                        /* Now that the original property name's format has been used for the parsePropertyValue() lookup above,
                           we force the property to its camelCase styling to normalize it for manipulation. */
                        property = CSS.Names.camelCase(property);

                        /* In case this property is a hook, there are circumstances where we will intend to work on the hook's root property and not the hooked subproperty. */
                        var rootProperty = CSS.Hooks.getRoot(property),
                            rootPropertyValue = false;

                        /* Other than for the dummy tween property, properties that are not supported by the browser (and do not have an associated normalization) will
                           inherently produce no style changes when set, so they are skipped in order to decrease animation tick overhead.
                           Property support is determined via prefixCheck(), which returns a false flag when no supported is detected. */
                        /* Note: Since SVG elements have some of their properties directly applied as HTML attributes,
                           there is no way to check for their explicit browser support, and so we skip skip this check for them. */
                        if (!Data(element).isSVG && rootProperty !== "tween" && CSS.Names.prefixCheck(rootProperty)[1] === false && CSS.Normalizations.registered[rootProperty] === undefined) {
                            if (Velocity.debug) console.log("Skipping [" + rootProperty + "] due to a lack of browser support.");

                            continue;
                        }

                        /* If the display option is being set to a non-"none" (e.g. "block") and opacity (filter on IE<=8) is being
                           animated to an endValue of non-zero, the user's intention is to fade in from invisible, thus we forcefeed opacity
                           a startValue of 0 if its startValue hasn't already been sourced by value transferring or prior forcefeeding. */
                        if (((opts.display !== undefined && opts.display !== null && opts.display !== "none") || (opts.visibility !== undefined && opts.visibility !== "hidden")) && /opacity|filter/.test(property) && !startValue && endValue !== 0) {
                            startValue = 0;
                        }

                        /* If values have been transferred from the previous Velocity call, extract the endValue and rootPropertyValue
                           for all of the current call's properties that were *also* animated in the previous call. */
                        /* Note: Value transferring can optionally be disabled by the user via the _cacheValues option. */
                        if (opts._cacheValues && lastTweensContainer && lastTweensContainer[property]) {
                            if (startValue === undefined) {
                                startValue = lastTweensContainer[property].endValue + lastTweensContainer[property].unitType;
                            }

                            /* The previous call's rootPropertyValue is extracted from the element's data cache since that's the
                               instance of rootPropertyValue that gets freshly updated by the tweening process, whereas the rootPropertyValue
                               attached to the incoming lastTweensContainer is equal to the root property's value prior to any tweening. */
                            rootPropertyValue = Data(element).rootPropertyValueCache[rootProperty];
                        /* If values were not transferred from a previous Velocity call, query the DOM as needed. */
                        } else {
                            /* Handle hooked properties. */
                            if (CSS.Hooks.registered[property]) {
                               if (startValue === undefined) {
                                    rootPropertyValue = CSS.getPropertyValue(element, rootProperty); /* GET */
                                    /* Note: The following getPropertyValue() call does not actually trigger a DOM query;
                                       getPropertyValue() will extract the hook from rootPropertyValue. */
                                    startValue = CSS.getPropertyValue(element, property, rootPropertyValue);
                                /* If startValue is already defined via forcefeeding, do not query the DOM for the root property's value;
                                   just grab rootProperty's zero-value template from CSS.Hooks. This overwrites the element's actual
                                   root property value (if one is set), but this is acceptable since the primary reason users forcefeed is
                                   to avoid DOM queries, and thus we likewise avoid querying the DOM for the root property's value. */
                                } else {
                                    /* Grab this hook's zero-value template, e.g. "0px 0px 0px black". */
                                    rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                                }
                            /* Handle non-hooked properties that haven't already been defined via forcefeeding. */
                            } else if (startValue === undefined) {
                                startValue = CSS.getPropertyValue(element, property); /* GET */
                            }
                        }

                        /**************************
                           Value Data Extraction
                        **************************/

                        var separatedValue,
                            endValueUnitType,
                            startValueUnitType,
                            operator = false;

                        /* Separates a property value into its numeric value and its unit type. */
                        function separateValue (property, value) {
                            var unitType,
                                numericValue;

                            numericValue = (value || "0")
                                .toString()
                                .toLowerCase()
                                /* Match the unit type at the end of the value. */
                                .replace(/[%A-z]+$/, function(match) {
                                    /* Grab the unit type. */
                                    unitType = match;

                                    /* Strip the unit type off of value. */
                                    return "";
                                });

                            /* If no unit type was supplied, assign one that is appropriate for this property (e.g. "deg" for rotateZ or "px" for width). */
                            if (!unitType) {
                                unitType = CSS.Values.getUnitType(property);
                            }

                            return [ numericValue, unitType ];
                        }

                        /* Separate startValue. */
                        separatedValue = separateValue(property, startValue);
                        startValue = separatedValue[0];
                        startValueUnitType = separatedValue[1];

                        /* Separate endValue, and extract a value operator (e.g. "+=", "-=") if one exists. */
                        separatedValue = separateValue(property, endValue);
                        endValue = separatedValue[0].replace(/^([+-\/*])=/, function(match, subMatch) {
                            operator = subMatch;

                            /* Strip the operator off of the value. */
                            return "";
                        });
                        endValueUnitType = separatedValue[1];

                        /* Parse float values from endValue and startValue. Default to 0 if NaN is returned. */
                        startValue = parseFloat(startValue) || 0;
                        endValue = parseFloat(endValue) || 0;

                        /***************************************
                           Property-Specific Value Conversion
                        ***************************************/

                        /* Custom support for properties that don't actually accept the % unit type, but where pollyfilling is trivial and relatively foolproof. */
                        if (endValueUnitType === "%") {
                            /* A %-value fontSize/lineHeight is relative to the parent's fontSize (as opposed to the parent's dimensions),
                               which is identical to the em unit's behavior, so we piggyback off of that. */
                            if (/^(fontSize|lineHeight)$/.test(property)) {
                                /* Convert % into an em decimal value. */
                                endValue = endValue / 100;
                                endValueUnitType = "em";
                            /* For scaleX and scaleY, convert the value into its decimal format and strip off the unit type. */
                            } else if (/^scale/.test(property)) {
                                endValue = endValue / 100;
                                endValueUnitType = "";
                            /* For RGB components, take the defined percentage of 255 and strip off the unit type. */
                            } else if (/(Red|Green|Blue)$/i.test(property)) {
                                endValue = (endValue / 100) * 255;
                                endValueUnitType = "";
                            }
                        }

                        /***************************
                           Unit Ratio Calculation
                        ***************************/

                        /* When queried, the browser returns (most) CSS property values in pixels. Therefore, if an endValue with a unit type of
                           %, em, or rem is animated toward, startValue must be converted from pixels into the same unit type as endValue in order
                           for value manipulation logic (increment/decrement) to proceed. Further, if the startValue was forcefed or transferred
                           from a previous call, startValue may also not be in pixels. Unit conversion logic therefore consists of two steps:
                           1) Calculating the ratio of %/em/rem/vh/vw relative to pixels
                           2) Converting startValue into the same unit of measurement as endValue based on these ratios. */
                        /* Unit conversion ratios are calculated by inserting a sibling node next to the target node, copying over its position property,
                           setting values with the target unit type then comparing the returned pixel value. */
                        /* Note: Even if only one of these unit types is being animated, all unit ratios are calculated at once since the overhead
                           of batching the SETs and GETs together upfront outweights the potential overhead
                           of layout thrashing caused by re-querying for uncalculated ratios for subsequently-processed properties. */
                        /* Todo: Shift this logic into the calls' first tick instance so that it's synced with RAF. */
                        function calculateUnitRatios () {

                            /************************
                                Same Ratio Checks
                            ************************/

                            /* The properties below are used to determine whether the element differs sufficiently from this call's
                               previously iterated element to also differ in its unit conversion ratios. If the properties match up with those
                               of the prior element, the prior element's conversion ratios are used. Like most optimizations in Velocity,
                               this is done to minimize DOM querying. */
                            var sameRatioIndicators = {
                                    myParent: element.parentNode || document.body, /* GET */
                                    position: CSS.getPropertyValue(element, "position"), /* GET */
                                    fontSize: CSS.getPropertyValue(element, "fontSize") /* GET */
                                },
                                /* Determine if the same % ratio can be used. % is based on the element's position value and its parent's width and height dimensions. */
                                samePercentRatio = ((sameRatioIndicators.position === callUnitConversionData.lastPosition) && (sameRatioIndicators.myParent === callUnitConversionData.lastParent)),
                                /* Determine if the same em ratio can be used. em is relative to the element's fontSize. */
                                sameEmRatio = (sameRatioIndicators.fontSize === callUnitConversionData.lastFontSize);

                            /* Store these ratio indicators call-wide for the next element to compare against. */
                            callUnitConversionData.lastParent = sameRatioIndicators.myParent;
                            callUnitConversionData.lastPosition = sameRatioIndicators.position;
                            callUnitConversionData.lastFontSize = sameRatioIndicators.fontSize;

                            /***************************
                               Element-Specific Units
                            ***************************/

                            /* Note: IE8 rounds to the nearest pixel when returning CSS values, thus we perform conversions using a measurement
                               of 100 (instead of 1) to give our ratios a precision of at least 2 decimal values. */
                            var measurement = 100,
                                unitRatios = {};

                            if (!sameEmRatio || !samePercentRatio) {
                                var dummy = Data(element).isSVG ? document.createElementNS("http://www.w3.org/2000/svg", "rect") : document.createElement("div");

                                Velocity.init(dummy);
                                sameRatioIndicators.myParent.appendChild(dummy);

                                /* To accurately and consistently calculate conversion ratios, the element's cascaded overflow and box-sizing are stripped.
                                   Similarly, since width/height can be artificially constrained by their min-/max- equivalents, these are controlled for as well. */
                                /* Note: Overflow must be also be controlled for per-axis since the overflow property overwrites its per-axis values. */
                                $.each([ "overflow", "overflowX", "overflowY" ], function(i, property) {
                                    Velocity.CSS.setPropertyValue(dummy, property, "hidden");
                                });
                                Velocity.CSS.setPropertyValue(dummy, "position", sameRatioIndicators.position);
                                Velocity.CSS.setPropertyValue(dummy, "fontSize", sameRatioIndicators.fontSize);
                                Velocity.CSS.setPropertyValue(dummy, "boxSizing", "content-box");

                                /* width and height act as our proxy properties for measuring the horizontal and vertical % ratios. */
                                $.each([ "minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height" ], function(i, property) {
                                    Velocity.CSS.setPropertyValue(dummy, property, measurement + "%");
                                });
                                /* paddingLeft arbitrarily acts as our proxy property for the em ratio. */
                                Velocity.CSS.setPropertyValue(dummy, "paddingLeft", measurement + "em");

                                /* Divide the returned value by the measurement to get the ratio between 1% and 1px. Default to 1 since working with 0 can produce Infinite. */
                                unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth = (parseFloat(CSS.getPropertyValue(dummy, "width", null, true)) || 1) / measurement; /* GET */
                                unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight = (parseFloat(CSS.getPropertyValue(dummy, "height", null, true)) || 1) / measurement; /* GET */
                                unitRatios.emToPx = callUnitConversionData.lastEmToPx = (parseFloat(CSS.getPropertyValue(dummy, "paddingLeft")) || 1) / measurement; /* GET */

                                sameRatioIndicators.myParent.removeChild(dummy);
                            } else {
                                unitRatios.emToPx = callUnitConversionData.lastEmToPx;
                                unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth;
                                unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight;
                            }

                            /***************************
                               Element-Agnostic Units
                            ***************************/

                            /* Whereas % and em ratios are determined on a per-element basis, the rem unit only needs to be checked
                               once per call since it's exclusively dependant upon document.body's fontSize. If this is the first time
                               that calculateUnitRatios() is being run during this call, remToPx will still be set to its default value of null,
                               so we calculate it now. */
                            if (callUnitConversionData.remToPx === null) {
                                /* Default to browsers' default fontSize of 16px in the case of 0. */
                                callUnitConversionData.remToPx = parseFloat(CSS.getPropertyValue(document.body, "fontSize")) || 16; /* GET */
                            }

                            /* Similarly, viewport units are %-relative to the window's inner dimensions. */
                            if (callUnitConversionData.vwToPx === null) {
                                callUnitConversionData.vwToPx = parseFloat(window.innerWidth) / 100; /* GET */
                                callUnitConversionData.vhToPx = parseFloat(window.innerHeight) / 100; /* GET */
                            }

                            unitRatios.remToPx = callUnitConversionData.remToPx;
                            unitRatios.vwToPx = callUnitConversionData.vwToPx;
                            unitRatios.vhToPx = callUnitConversionData.vhToPx;

                            if (Velocity.debug >= 1) console.log("Unit ratios: " + JSON.stringify(unitRatios), element);

                            return unitRatios;
                        }

                        /********************
                           Unit Conversion
                        ********************/

                        /* The * and / operators, which are not passed in with an associated unit, inherently use startValue's unit. Skip value and unit conversion. */
                        if (/[\/*]/.test(operator)) {
                            endValueUnitType = startValueUnitType;
                        /* If startValue and endValue differ in unit type, convert startValue into the same unit type as endValue so that if endValueUnitType
                           is a relative unit (%, em, rem), the values set during tweening will continue to be accurately relative even if the metrics they depend
                           on are dynamically changing during the course of the animation. Conversely, if we always normalized into px and used px for setting values, the px ratio
                           would become stale if the original unit being animated toward was relative and the underlying metrics change during the animation. */
                        /* Since 0 is 0 in any unit type, no conversion is necessary when startValue is 0 -- we just start at 0 with endValueUnitType. */
                        } else if ((startValueUnitType !== endValueUnitType) && startValue !== 0) {
                            /* Unit conversion is also skipped when endValue is 0, but *startValueUnitType* must be used for tween values to remain accurate. */
                            /* Note: Skipping unit conversion here means that if endValueUnitType was originally a relative unit, the animation won't relatively
                               match the underlying metrics if they change, but this is acceptable since we're animating toward invisibility instead of toward visibility,
                               which remains past the point of the animation's completion. */
                            if (endValue === 0) {
                                endValueUnitType = startValueUnitType;
                            } else {
                                /* By this point, we cannot avoid unit conversion (it's undesirable since it causes layout thrashing).
                                   If we haven't already, we trigger calculateUnitRatios(), which runs once per element per call. */
                                elementUnitConversionData = elementUnitConversionData || calculateUnitRatios();

                                /* The following RegEx matches CSS properties that have their % values measured relative to the x-axis. */
                                /* Note: W3C spec mandates that all of margin and padding's properties (even top and bottom) are %-relative to the *width* of the parent element. */
                                var axis = (/margin|padding|left|right|width|text|word|letter/i.test(property) || /X$/.test(property) || property === "x") ? "x" : "y";

                                /* In order to avoid generating n^2 bespoke conversion functions, unit conversion is a two-step process:
                                   1) Convert startValue into pixels. 2) Convert this new pixel value into endValue's unit type. */
                                switch (startValueUnitType) {
                                    case "%":
                                        /* Note: translateX and translateY are the only properties that are %-relative to an element's own dimensions -- not its parent's dimensions.
                                           Velocity does not include a special conversion process to account for this behavior. Therefore, animating translateX/Y from a % value
                                           to a non-% value will produce an incorrect start value. Fortunately, this sort of cross-unit conversion is rarely done by users in practice. */
                                        startValue *= (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                                        break;

                                    case "px":
                                        /* px acts as our midpoint in the unit conversion process; do nothing. */
                                        break;

                                    default:
                                        startValue *= elementUnitConversionData[startValueUnitType + "ToPx"];
                                }

                                /* Invert the px ratios to convert into to the target unit. */
                                switch (endValueUnitType) {
                                    case "%":
                                        startValue *= 1 / (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                                        break;

                                    case "px":
                                        /* startValue is already in px, do nothing; we're done. */
                                        break;

                                    default:
                                        startValue *= 1 / elementUnitConversionData[endValueUnitType + "ToPx"];
                                }
                            }
                        }

                        /*********************
                           Relative Values
                        *********************/

                        /* Operator logic must be performed last since it requires unit-normalized start and end values. */
                        /* Note: Relative *percent values* do not behave how most people think; while one would expect "+=50%"
                           to increase the property 1.5x its current value, it in fact increases the percent units in absolute terms:
                           50 points is added on top of the current % value. */
                        switch (operator) {
                            case "+":
                                endValue = startValue + endValue;
                                break;

                            case "-":
                                endValue = startValue - endValue;
                                break;

                            case "*":
                                endValue = startValue * endValue;
                                break;

                            case "/":
                                endValue = startValue / endValue;
                                break;
                        }

                        /**************************
                           tweensContainer Push
                        **************************/

                        /* Construct the per-property tween object, and push it to the element's tweensContainer. */
                        tweensContainer[property] = {
                            rootPropertyValue: rootPropertyValue,
                            startValue: startValue,
                            currentValue: startValue,
                            endValue: endValue,
                            unitType: endValueUnitType,
                            easing: easing
                        };

                        if (Velocity.debug) console.log("tweensContainer (" + property + "): " + JSON.stringify(tweensContainer[property]), element);
                    }

                    /* Along with its property data, store a reference to the element itself onto tweensContainer. */
                    tweensContainer.element = element;
                }

                /*****************
                    Call Push
                *****************/

                /* Note: tweensContainer can be empty if all of the properties in this call's property map were skipped due to not
                   being supported by the browser. The element property is used for checking that the tweensContainer has been appended to. */
                if (tweensContainer.element) {
                    /* Apply the "velocity-animating" indicator class. */
                    CSS.Values.addClass(element, "velocity-animating");

                    /* The call array houses the tweensContainers for each element being animated in the current call. */
                    call.push(tweensContainer);

                    /* Store the tweensContainer and options if we're working on the default effects queue, so that they can be used by the reverse command. */
                    if (opts.queue === "") {
                        Data(element).tweensContainer = tweensContainer;
                        Data(element).opts = opts;
                    }

                    /* Switch on the element's animating flag. */
                    Data(element).isAnimating = true;

                    /* Once the final element in this call's element set has been processed, push the call array onto
                       Velocity.State.calls for the animation tick to immediately begin processing. */
                    if (elementsIndex === elementsLength - 1) {
                        /* Add the current call plus its associated metadata (the element set and the call's options) onto the global call container.
                           Anything on this call container is subjected to tick() processing. */
                        Velocity.State.calls.push([ call, elements, opts, null, promiseData.resolver ]);

                        /* If the animation tick isn't running, start it. (Velocity shuts it off when there are no active calls to process.) */
                        if (Velocity.State.isTicking === false) {
                            Velocity.State.isTicking = true;

                            /* Start the tick loop. */
                            tick();
                        }
                    } else {
                        elementsIndex++;
                    }
                }
            }

            /* When the queue option is set to false, the call skips the element's queue and fires immediately. */
            if (opts.queue === false) {
                /* Since this buildQueue call doesn't respect the element's existing queue (which is where a delay option would have been appended),
                   we manually inject the delay property here with an explicit setTimeout. */
                if (opts.delay) {
                    setTimeout(buildQueue, opts.delay);
                } else {
                    buildQueue();
                }
            /* Otherwise, the call undergoes element queueing as normal. */
            /* Note: To interoperate with jQuery, Velocity uses jQuery's own $.queue() stack for queuing logic. */
            } else {
                $.queue(element, opts.queue, function(next, clearQueue) {
                    /* If the clearQueue flag was passed in by the stop command, resolve this call's promise. (Promises can only be resolved once,
                       so it's fine if this is repeatedly triggered for each element in the associated call.) */
                    if (clearQueue === true) {
                        if (promiseData.promise) {
                            promiseData.resolver(elements);
                        }

                        /* Do not continue with animation queueing. */
                        return true;
                    }

                    /* This flag indicates to the upcoming completeCall() function that this queue entry was initiated by Velocity.
                       See completeCall() for further details. */
                    Velocity.velocityQueueEntryFlag = true;

                    buildQueue(next);
                });
            }

            /*********************
                Auto-Dequeuing
            *********************/

            /* As per jQuery's $.queue() behavior, to fire the first non-custom-queue entry on an element, the element
               must be dequeued if its queue stack consists *solely* of the current call. (This can be determined by checking
               for the "inprogress" item that jQuery prepends to active queue stack arrays.) Regardless, whenever the element's
               queue is further appended with additional items -- including $.delay()'s or even $.animate() calls, the queue's
               first entry is automatically fired. This behavior contrasts that of custom queues, which never auto-fire. */
            /* Note: When an element set is being subjected to a non-parallel Velocity call, the animation will not begin until
               each one of the elements in the set has reached the end of its individually pre-existing queue chain. */
            /* Note: Unfortunately, most people don't fully grasp jQuery's powerful, yet quirky, $.queue() function.
               Lean more here: http://stackoverflow.com/questions/1058158/can-somebody-explain-jquery-queue-to-me */
            if ((opts.queue === "" || opts.queue === "fx") && $.queue(element)[0] !== "inprogress") {
                $.dequeue(element);
            }
        }

        /**************************
           Element Set Iteration
        **************************/

        /* If the "nodeType" property exists on the elements variable, we're animating a single element.
           Place it in an array so that $.each() can iterate over it. */
        $.each(elements, function(i, element) {
            /* Ensure each element in a set has a nodeType (is a real element) to avoid throwing errors. */
            if (Type.isNode(element)) {
                processElement.call(element);
            }
        });

        /******************
           Option: Loop
        ******************/

        /* The loop option accepts an integer indicating how many times the element should loop between the values in the
           current call's properties map and the element's property values prior to this call. */
        /* Note: The loop option's logic is performed here -- after element processing -- because the current call needs
           to undergo its queue insertion prior to the loop option generating its series of constituent "reverse" calls,
           which chain after the current call. Two reverse calls (two "alternations") constitute one loop. */
        var opts = $.extend({}, Velocity.defaults, options),
            reverseCallsCount;

        opts.loop = parseInt(opts.loop);
        reverseCallsCount = (opts.loop * 2) - 1;

        if (opts.loop) {
            /* Double the loop count to convert it into its appropriate number of "reverse" calls.
               Subtract 1 from the resulting value since the current call is included in the total alternation count. */
            for (var x = 0; x < reverseCallsCount; x++) {
                /* Since the logic for the reverse action occurs inside Queueing and therefore this call's options object
                   isn't parsed until then as well, the current call's delay option must be explicitly passed into the reverse
                   call so that the delay logic that occurs inside *Pre-Queueing* can process it. */
                var reverseOptions = {
                    delay: opts.delay,
                    progress: opts.progress
                };

                /* If a complete callback was passed into this call, transfer it to the loop redirect's final "reverse" call
                   so that it's triggered when the entire redirect is complete (and not when the very first animation is complete). */
                if (x === reverseCallsCount - 1) {
                    reverseOptions.display = opts.display;
                    reverseOptions.visibility = opts.visibility;
                    reverseOptions.complete = opts.complete;
                }

                animate(elements, "reverse", reverseOptions);
            }
        }

        /***************
            Chaining
        ***************/

        /* Return the elements back to the call chain, with wrapped elements taking precedence in case Velocity was called via the $.fn. extension. */
        return getChain();
    };

    /* Turn Velocity into the animation function, extended with the pre-existing Velocity object. */
    Velocity = $.extend(animate, Velocity);
    /* For legacy support, also expose the literal animate method. */
    Velocity.animate = animate;

    /**************
        Timing
    **************/

    /* Ticker function. */
    var ticker = window.requestAnimationFrame || rAFShim;

    /* Inactive browser tabs pause rAF, which results in all active animations immediately sprinting to their completion states when the tab refocuses.
       To get around this, we dynamically switch rAF to setTimeout (which the browser *doesn't* pause) when the tab loses focus. We skip this for mobile
       devices to avoid wasting battery power on inactive tabs. */
    /* Note: Tab focus detection doesn't work on older versions of IE, but that's okay since they don't support rAF to begin with. */
    if (!Velocity.State.isMobile && document.hidden !== undefined) {
        document.addEventListener("visibilitychange", function() {
            /* Reassign the rAF function (which the global tick() function uses) based on the tab's focus state. */
            if (document.hidden) {
                ticker = function(callback) {
                    /* The tick function needs a truthy first argument in order to pass its internal timestamp check. */
                    return setTimeout(function() { callback(true) }, 16);
                };

                /* The rAF loop has been paused by the browser, so we manually restart the tick. */
                tick();
            } else {
                ticker = window.requestAnimationFrame || rAFShim;
            }
        });
    }

    /************
        Tick
    ************/

    /* Note: All calls to Velocity are pushed to the Velocity.State.calls array, which is fully iterated through upon each tick. */
    function tick (timestamp) {
        /* An empty timestamp argument indicates that this is the first tick occurence since ticking was turned on.
           We leverage this metadata to fully ignore the first tick pass since RAF's initial pass is fired whenever
           the browser's next tick sync time occurs, which results in the first elements subjected to Velocity
           calls being animated out of sync with any elements animated immediately thereafter. In short, we ignore
           the first RAF tick pass so that elements being immediately consecutively animated -- instead of simultaneously animated
           by the same Velocity call -- are properly batched into the same initial RAF tick and consequently remain in sync thereafter. */
        if (timestamp) {
            /* We ignore RAF's high resolution timestamp since it can be significantly offset when the browser is
               under high stress; we opt for choppiness over allowing the browser to drop huge chunks of frames. */
            var timeCurrent = (new Date).getTime();

            /********************
               Call Iteration
            ********************/

            var callsLength = Velocity.State.calls.length;

            /* To speed up iterating over this array, it is compacted (falsey items -- calls that have completed -- are removed)
               when its length has ballooned to a point that can impact tick performance. This only becomes necessary when animation
               has been continuous with many elements over a long period of time; whenever all active calls are completed, completeCall() clears Velocity.State.calls. */
            if (callsLength > 10000) {
                Velocity.State.calls = compactSparseArray(Velocity.State.calls);
            }

            /* Iterate through each active call. */
            for (var i = 0; i < callsLength; i++) {
                /* When a Velocity call is completed, its Velocity.State.calls entry is set to false. Continue on to the next call. */
                if (!Velocity.State.calls[i]) {
                    continue;
                }

                /************************
                   Call-Wide Variables
                ************************/

                var callContainer = Velocity.State.calls[i],
                    call = callContainer[0],
                    opts = callContainer[2],
                    timeStart = callContainer[3],
                    firstTick = !!timeStart,
                    tweenDummyValue = null;

                /* If timeStart is undefined, then this is the first time that this call has been processed by tick().
                   We assign timeStart now so that its value is as close to the real animation start time as possible.
                   (Conversely, had timeStart been defined when this call was added to Velocity.State.calls, the delay
                   between that time and now would cause the first few frames of the tween to be skipped since
                   percentComplete is calculated relative to timeStart.) */
                /* Further, subtract 16ms (the approximate resolution of RAF) from the current time value so that the
                   first tick iteration isn't wasted by animating at 0% tween completion, which would produce the
                   same style value as the element's current value. */
                if (!timeStart) {
                    timeStart = Velocity.State.calls[i][3] = timeCurrent - 16;
                }

                /* The tween's completion percentage is relative to the tween's start time, not the tween's start value
                   (which would result in unpredictable tween durations since JavaScript's timers are not particularly accurate).
                   Accordingly, we ensure that percentComplete does not exceed 1. */
                var percentComplete = Math.min((timeCurrent - timeStart) / opts.duration, 1);

                /**********************
                   Element Iteration
                **********************/

                /* For every call, iterate through each of the elements in its set. */
                for (var j = 0, callLength = call.length; j < callLength; j++) {
                    var tweensContainer = call[j],
                        element = tweensContainer.element;

                    /* Check to see if this element has been deleted midway through the animation by checking for the
                       continued existence of its data cache. If it's gone, skip animating this element. */
                    if (!Data(element)) {
                        continue;
                    }

                    var transformPropertyExists = false;

                    /**********************************
                       Display & Visibility Toggling
                    **********************************/

                    /* If the display option is set to non-"none", set it upfront so that the element can become visible before tweening begins.
                       (Otherwise, display's "none" value is set in completeCall() once the animation has completed.) */
                    if (opts.display !== undefined && opts.display !== null && opts.display !== "none") {
                        if (opts.display === "flex") {
                            var flexValues = [ "-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex" ];

                            $.each(flexValues, function(i, flexValue) {
                                CSS.setPropertyValue(element, "display", flexValue);
                            });
                        }

                        CSS.setPropertyValue(element, "display", opts.display);
                    }

                    /* Same goes with the visibility option, but its "none" equivalent is "hidden". */
                    if (opts.visibility !== undefined && opts.visibility !== "hidden") {
                        CSS.setPropertyValue(element, "visibility", opts.visibility);
                    }

                    /************************
                       Property Iteration
                    ************************/

                    /* For every element, iterate through each property. */
                    for (var property in tweensContainer) {
                        /* Note: In addition to property tween data, tweensContainer contains a reference to its associated element. */
                        if (property !== "element") {
                            var tween = tweensContainer[property],
                                currentValue,
                                /* Easing can either be a pre-genereated function or a string that references a pre-registered easing
                                   on the Velocity.Easings object. In either case, return the appropriate easing *function*. */
                                easing = Type.isString(tween.easing) ? Velocity.Easings[tween.easing] : tween.easing;

                            /******************************
                               Current Value Calculation
                            ******************************/

                            /* If this is the last tick pass (if we've reached 100% completion for this tween),
                               ensure that currentValue is explicitly set to its target endValue so that it's not subjected to any rounding. */
                            if (percentComplete === 1) {
                                currentValue = tween.endValue;
                            /* Otherwise, calculate currentValue based on the current delta from startValue. */
                            } else {
                                var tweenDelta = tween.endValue - tween.startValue;
                                currentValue = tween.startValue + (tweenDelta * easing(percentComplete, opts, tweenDelta));

                                /* If no value change is occurring, don't proceed with DOM updating. */
                                if (!firstTick && (currentValue === tween.currentValue)) {
                                    continue;
                                }
                            }

                            tween.currentValue = currentValue;

                            /* If we're tweening a fake 'tween' property in order to log transition values, update the one-per-call variable so that
                               it can be passed into the progress callback. */
                            if (property === "tween") {
                                tweenDummyValue = currentValue;
                            } else {
                                /******************
                                   Hooks: Part I
                                ******************/

                                /* For hooked properties, the newly-updated rootPropertyValueCache is cached onto the element so that it can be used
                                   for subsequent hooks in this call that are associated with the same root property. If we didn't cache the updated
                                   rootPropertyValue, each subsequent update to the root property in this tick pass would reset the previous hook's
                                   updates to rootPropertyValue prior to injection. A nice performance byproduct of rootPropertyValue caching is that
                                   subsequently chained animations using the same hookRoot but a different hook can use this cached rootPropertyValue. */
                                if (CSS.Hooks.registered[property]) {
                                    var hookRoot = CSS.Hooks.getRoot(property),
                                        rootPropertyValueCache = Data(element).rootPropertyValueCache[hookRoot];

                                    if (rootPropertyValueCache) {
                                        tween.rootPropertyValue = rootPropertyValueCache;
                                    }
                                }

                                /*****************
                                    DOM Update
                                *****************/

                                /* setPropertyValue() returns an array of the property name and property value post any normalization that may have been performed. */
                                /* Note: To solve an IE<=8 positioning bug, the unit type is dropped when setting a property value of 0. */
                                var adjustedSetData = CSS.setPropertyValue(element, /* SET */
                                                                           property,
                                                                           tween.currentValue + (parseFloat(currentValue) === 0 ? "" : tween.unitType),
                                                                           tween.rootPropertyValue,
                                                                           tween.scrollData);

                                /*******************
                                   Hooks: Part II
                                *******************/

                                /* Now that we have the hook's updated rootPropertyValue (the post-processed value provided by adjustedSetData), cache it onto the element. */
                                if (CSS.Hooks.registered[property]) {
                                    /* Since adjustedSetData contains normalized data ready for DOM updating, the rootPropertyValue needs to be re-extracted from its normalized form. ?? */
                                    if (CSS.Normalizations.registered[hookRoot]) {
                                        Data(element).rootPropertyValueCache[hookRoot] = CSS.Normalizations.registered[hookRoot]("extract", null, adjustedSetData[1]);
                                    } else {
                                        Data(element).rootPropertyValueCache[hookRoot] = adjustedSetData[1];
                                    }
                                }

                                /***************
                                   Transforms
                                ***************/

                                /* Flag whether a transform property is being animated so that flushTransformCache() can be triggered once this tick pass is complete. */
                                if (adjustedSetData[0] === "transform") {
                                    transformPropertyExists = true;
                                }

                            }
                        }
                    }

                    /****************
                        mobileHA
                    ****************/

                    /* If mobileHA is enabled, set the translate3d transform to null to force hardware acceleration.
                       It's safe to override this property since Velocity doesn't actually support its animation (hooks are used in its place). */
                    if (opts.mobileHA) {
                        /* Don't set the null transform hack if we've already done so. */
                        if (Data(element).transformCache.translate3d === undefined) {
                            /* All entries on the transformCache object are later concatenated into a single transform string via flushTransformCache(). */
                            Data(element).transformCache.translate3d = "(0px, 0px, 0px)";

                            transformPropertyExists = true;
                        }
                    }

                    if (transformPropertyExists) {
                        CSS.flushTransformCache(element);
                    }
                }

                /* The non-"none" display value is only applied to an element once -- when its associated call is first ticked through.
                   Accordingly, it's set to false so that it isn't re-processed by this call in the next tick. */
                if (opts.display !== undefined && opts.display !== "none") {
                    Velocity.State.calls[i][2].display = false;
                }
                if (opts.visibility !== undefined && opts.visibility !== "hidden") {
                    Velocity.State.calls[i][2].visibility = false;
                }

                /* Pass the elements and the timing data (percentComplete, msRemaining, timeStart, tweenDummyValue) into the progress callback. */
                if (opts.progress) {
                    opts.progress.call(callContainer[1],
                                       callContainer[1],
                                       percentComplete,
                                       Math.max(0, (timeStart + opts.duration) - timeCurrent),
                                       timeStart,
                                       tweenDummyValue);
                }

                /* If this call has finished tweening, pass its index to completeCall() to handle call cleanup. */
                if (percentComplete === 1) {
                    completeCall(i);
                }
            }
        }

        /* Note: completeCall() sets the isTicking flag to false when the last call on Velocity.State.calls has completed. */
        if (Velocity.State.isTicking) {
            ticker(tick);
        }
    }

    /**********************
        Call Completion
    **********************/

    /* Note: Unlike tick(), which processes all active calls at once, call completion is handled on a per-call basis. */
    function completeCall (callIndex, isStopped) {
        /* Ensure the call exists. */
        if (!Velocity.State.calls[callIndex]) {
            return false;
        }

        /* Pull the metadata from the call. */
        var call = Velocity.State.calls[callIndex][0],
            elements = Velocity.State.calls[callIndex][1],
            opts = Velocity.State.calls[callIndex][2],
            resolver = Velocity.State.calls[callIndex][4];

        var remainingCallsExist = false;

        /*************************
           Element Finalization
        *************************/

        for (var i = 0, callLength = call.length; i < callLength; i++) {
            var element = call[i].element;

            /* If the user set display to "none" (intending to hide the element), set it now that the animation has completed. */
            /* Note: display:none isn't set when calls are manually stopped (via Velocity("stop"). */
            /* Note: Display gets ignored with "reverse" calls and infinite loops, since this behavior would be undesirable. */
            if (!isStopped && !opts.loop) {
                if (opts.display === "none") {
                    CSS.setPropertyValue(element, "display", opts.display);
                }

                if (opts.visibility === "hidden") {
                    CSS.setPropertyValue(element, "visibility", opts.visibility);
                }
            }

            /* If the element's queue is empty (if only the "inprogress" item is left at position 0) or if its queue is about to run
               a non-Velocity-initiated entry, turn off the isAnimating flag. A non-Velocity-initiatied queue entry's logic might alter
               an element's CSS values and thereby cause Velocity's cached value data to go stale. To detect if a queue entry was initiated by Velocity,
               we check for the existence of our special Velocity.queueEntryFlag declaration, which minifiers won't rename since the flag
               is assigned to jQuery's global $ object and thus exists out of Velocity's own scope. */
            if (opts.loop !== true && ($.queue(element)[1] === undefined || !/\.velocityQueueEntryFlag/i.test($.queue(element)[1]))) {
                /* The element may have been deleted. Ensure that its data cache still exists before acting on it. */
                if (Data(element)) {
                    Data(element).isAnimating = false;
                    /* Clear the element's rootPropertyValueCache, which will become stale. */
                    Data(element).rootPropertyValueCache = {};

                    var transformHAPropertyExists = false;
                    /* If any 3D transform subproperty is at its default value (regardless of unit type), remove it. */
                    $.each(CSS.Lists.transforms3D, function(i, transformName) {
                        var defaultValue = /^scale/.test(transformName) ? 1 : 0,
                            currentValue = Data(element).transformCache[transformName];

                        if (Data(element).transformCache[transformName] !== undefined && new RegExp("^\\(" + defaultValue + "[^.]").test(currentValue)) {
                            transformHAPropertyExists = true;

                            delete Data(element).transformCache[transformName];
                        }
                    });

                    /* Mobile devices have hardware acceleration removed at the end of the animation in order to avoid hogging the GPU's memory. */
                    if (opts.mobileHA) {
                        transformHAPropertyExists = true;
                        delete Data(element).transformCache.translate3d;
                    }

                    /* Flush the subproperty removals to the DOM. */
                    if (transformHAPropertyExists) {
                        CSS.flushTransformCache(element);
                    }

                    /* Remove the "velocity-animating" indicator class. */
                    CSS.Values.removeClass(element, "velocity-animating");
                }
            }

            /*********************
               Option: Complete
            *********************/

            /* Complete is fired once per call (not once per element) and is passed the full raw DOM element set as both its context and its first argument. */
            /* Note: Callbacks aren't fired when calls are manually stopped (via Velocity("stop"). */
            if (!isStopped && opts.complete && !opts.loop && (i === callLength - 1)) {
                /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
                try {
                    opts.complete.call(elements, elements);
                } catch (error) {
                    setTimeout(function() { throw error; }, 1);
                }
            }

            /**********************
               Promise Resolving
            **********************/

            /* Note: Infinite loops don't return promises. */
            if (resolver && opts.loop !== true) {
                resolver(elements);
            }

            /****************************
               Option: Loop (Infinite)
            ****************************/

            if (Data(element) && opts.loop === true && !isStopped) {
                /* If a rotateX/Y/Z property is being animated to 360 deg with loop:true, swap tween start/end values to enable
                   continuous iterative rotation looping. (Otherise, the element would just rotate back and forth.) */
                $.each(Data(element).tweensContainer, function(propertyName, tweenContainer) {
                    if (/^rotate/.test(propertyName) && parseFloat(tweenContainer.endValue) === 360) {
                        tweenContainer.endValue = 0;
                        tweenContainer.startValue = 360;
                    }

                    if (/^backgroundPosition/.test(propertyName) && parseFloat(tweenContainer.endValue) === 100 && tweenContainer.unitType === "%") {
                        tweenContainer.endValue = 0;
                        tweenContainer.startValue = 100;
                    }
                });

                Velocity(element, "reverse", { loop: true, delay: opts.delay });
            }

            /***************
               Dequeueing
            ***************/

            /* Fire the next call in the queue so long as this call's queue wasn't set to false (to trigger a parallel animation),
               which would have already caused the next call to fire. Note: Even if the end of the animation queue has been reached,
               $.dequeue() must still be called in order to completely clear jQuery's animation queue. */
            if (opts.queue !== false) {
                $.dequeue(element, opts.queue);
            }
        }

        /************************
           Calls Array Cleanup
        ************************/

        /* Since this call is complete, set it to false so that the rAF tick skips it. This array is later compacted via compactSparseArray().
          (For performance reasons, the call is set to false instead of being deleted from the array: http://www.html5rocks.com/en/tutorials/speed/v8/) */
        Velocity.State.calls[callIndex] = false;

        /* Iterate through the calls array to determine if this was the final in-progress animation.
           If so, set a flag to end ticking and clear the calls array. */
        for (var j = 0, callsLength = Velocity.State.calls.length; j < callsLength; j++) {
            if (Velocity.State.calls[j] !== false) {
                remainingCallsExist = true;

                break;
            }
        }

        if (remainingCallsExist === false) {
            /* tick() will detect this flag upon its next iteration and subsequently turn itself off. */
            Velocity.State.isTicking = false;

            /* Clear the calls array so that its length is reset. */
            delete Velocity.State.calls;
            Velocity.State.calls = [];
        }
    }

    /******************
        Frameworks
    ******************/

    /* Both jQuery and Zepto allow their $.fn object to be extended to allow wrapped elements to be subjected to plugin calls.
       If either framework is loaded, register a "velocity" extension pointing to Velocity's core animate() method.  Velocity
       also registers itself onto a global container (window.jQuery || window.Zepto || window) so that certain features are
       accessible beyond just a per-element scope. This master object contains an .animate() method, which is later assigned to $.fn
       (if jQuery or Zepto are present). Accordingly, Velocity can both act on wrapped DOM elements and stand alone for targeting raw DOM elements. */
    global.Velocity = Velocity;

    if (global !== window) {
        /* Assign the element function to Velocity's core animate() method. */
        global.fn.velocity = animate;
        /* Assign the object function's defaults to Velocity's global defaults object. */
        global.fn.velocity.defaults = Velocity.defaults;
    }

    /***********************
       Packaged Redirects
    ***********************/

    /* slideUp, slideDown */
    $.each([ "Down", "Up" ], function(i, direction) {
        Velocity.Redirects["slide" + direction] = function (element, options, elementsIndex, elementsSize, elements, promiseData) {
            var opts = $.extend({}, options),
                begin = opts.begin,
                complete = opts.complete,
                computedValues = { height: "", marginTop: "", marginBottom: "", paddingTop: "", paddingBottom: "" },
                inlineValues = {};

            if (opts.display === undefined) {
                /* Show the element before slideDown begins and hide the element after slideUp completes. */
                /* Note: Inline elements cannot have dimensions animated, so they're reverted to inline-block. */
                opts.display = (direction === "Down" ? (Velocity.CSS.Values.getDisplayType(element) === "inline" ? "inline-block" : "block") : "none");
            }

            opts.begin = function() {
                /* If the user passed in a begin callback, fire it now. */
                begin && begin.call(elements, elements);

                /* Cache the elements' original vertical dimensional property values so that we can animate back to them. */
                for (var property in computedValues) {
                    inlineValues[property] = element.style[property];

                    /* For slideDown, use forcefeeding to animate all vertical properties from 0. For slideUp,
                       use forcefeeding to start from computed values and animate down to 0. */
                    var propertyValue = Velocity.CSS.getPropertyValue(element, property);
                    computedValues[property] = (direction === "Down") ? [ propertyValue, 0 ] : [ 0, propertyValue ];
                }

                /* Force vertical overflow content to clip so that sliding works as expected. */
                inlineValues.overflow = element.style.overflow;
                element.style.overflow = "hidden";
            }

            opts.complete = function() {
                /* Reset element to its pre-slide inline values once its slide animation is complete. */
                for (var property in inlineValues) {
                    element.style[property] = inlineValues[property];
                }

                /* If the user passed in a complete callback, fire it now. */
                complete && complete.call(elements, elements);
                promiseData && promiseData.resolver(elements);
            };

            Velocity(element, computedValues, opts);
        };
    });

    /* fadeIn, fadeOut */
    $.each([ "In", "Out" ], function(i, direction) {
        Velocity.Redirects["fade" + direction] = function (element, options, elementsIndex, elementsSize, elements, promiseData) {
            var opts = $.extend({}, options),
                propertiesMap = { opacity: (direction === "In") ? 1 : 0 },
                originalComplete = opts.complete;

            /* Since redirects are triggered individually for each element in the animated set, avoid repeatedly triggering
               callbacks by firing them only when the final element has been reached. */
            if (elementsIndex !== elementsSize - 1) {
                opts.complete = opts.begin = null;
            } else {
                opts.complete = function() {
                    if (originalComplete) {
                        originalComplete.call(elements, elements);
                    }

                    promiseData && promiseData.resolver(elements);
                }
            }

            /* If a display was passed in, use it. Otherwise, default to "none" for fadeOut or the element-specific default for fadeIn. */
            /* Note: We allow users to pass in "null" to skip display setting altogether. */
            if (opts.display === undefined) {
                opts.display = (direction === "In" ? "auto" : "none");
            }

            Velocity(this, propertiesMap, opts);
        };
    });

    return Velocity;
}((window.jQuery || window.Zepto || window), window, document);
}));

/******************
   Known Issues
******************/

/* The CSS spec mandates that the translateX/Y/Z transforms are %-relative to the element itself -- not its parent.
Velocity, however, doesn't make this distinction. Thus, converting to or from the % unit with these subproperties
will produce an inaccurate conversion value. The same issue exists with the cx/cy attributes of SVG circles and ellipses. */
(function(){var z=function(){(function(j,l){function q(a,b,d){if(d===l&&a.nodeType===1)
if(d="data-"+ b.replace(db,"$1-$2").toLowerCase(),d=a.getAttribute(d),typeof d==="string"){try{d=d==="true"?true:d==="false"?false:d==="null"?null:!c.isNaN(d)?parseFloat(d):eb.test(d)?c.parseJSON(d):d}catch(e){}
c.data(a,b,d)}else d=l;return d}
function r(a){for(var b in a)
if(b!=="toJSON")return false;return true}
function u(a,b,d){var e=b+"defer",f=b+"queue",g=b+"mark",h=c.data(a,e,l,true);h&&(d==="queue"||!c.data(a,f,l,true))&&(d==="mark"||!c.data(a,g,l,true))&&setTimeout(function(){!c.data(a,f,l,true)&&!c.data(a,g,l,true)&&(c.removeData(a,e,true),h.resolve())},0)}
function w(){return false}
function D(){return true}
function z(a,b,d){var e=c.extend({},d[0]);e.type=a;e.originalEvent={};e.liveFired=l;c.event.handle.call(b,e);e.isDefaultPrevented()&&d[0].preventDefault()}
function ea(a){var b,d,e,f,g,h,k,o,p,l,j,m=[];f=[];g=c._data(this,"events");if(!(a.liveFired===this||!g||!g.live||a.target.disabled||a.button&&a.type==="click")){a.namespace&&(j=RegExp("(^|\\.)"+ a.namespace.split(".").join("\\.(?:.*\\.)?")+"(\\.|$)"));a.liveFired=this;var s=g.live.slice(0);for(k=0;k<s.length;k++)g=s[k],g.origType.replace(fa,"")===a.type?f.push(g.selector):s.splice(k--,1);f=c(a.target).closest(f,a.currentTarget);for(o=0,p=f.length;o<p;o++){l=f[o];for(k=0;k<s.length;k++)
if(g=s[k],l.selector===g.selector&&(!j||j.test(g.namespace))&&!l.elem.disabled){h=l.elem;e=null;if(g.preType==="mouseenter"||g.preType==="mouseleave")a.type=g.preType,(e=c(a.relatedTarget).closest(g.selector)[0])&&c.contains(h,e)&&(e=h);(!e||e!==h)&&m.push({elem:h,handleObj:g,level:l.level})}}
for(o=0,p=m.length;o<p;o++){f=m[o];if(d&&f.level>d)break;a.currentTarget=f.elem;a.data=f.handleObj.data;a.handleObj=f.handleObj;j=f.handleObj.origHandler.apply(f.elem,arguments);if(j===false||a.isPropagationStopped())
if(d=f.level,j===false&&(b=false),a.isImmediatePropagationStopped())break}
return b}}
function X(a,b){return(a&&a!=="*"?a+".":"")+ b.replace(fb,"`").replace(gb,"&")}
function N(a,b,d){b=b||0;if(c.isFunction(b))return c.grep(a,function(a,c){return!!b.call(a,c,a)===d});else if(b.nodeType)return c.grep(a,function(a){return a===b===d});else if(typeof b==="string"){var e=c.grep(a,function(a){return a.nodeType===1});if(hb.test(b))return c.filter(b,e,!d);else b=c.filter(b,e)}
return c.grep(a,function(a){return c.inArray(a,b)>=0===d})}
function ua(a,b){if(b.nodeType===1&&c.hasData(a)){var d=c.expando,e=c.data(a),f=c.data(b,e);if(e=e[d]){var g=e.events,f=f[d]=c.extend({},e);if(g){delete f.handle;f.events={};for(var h in g){d=0;for(e=g[h].length;d<e;d++)c.event.add(b,h+(g[h][d].namespace?".":"")+ g[h][d].namespace,g[h][d],g[h][d].data)}}}}}
function va(a,b){var d;if(b.nodeType===1){b.clearAttributes&&b.clearAttributes();b.mergeAttributes&&b.mergeAttributes(a);d=b.nodeName.toLowerCase();if(d==="object")b.outerHTML=a.outerHTML;else if(d==="input"&&(a.type==="checkbox"||a.type==="radio")){if(a.checked)b.defaultChecked=b.checked=a.checked;if(b.value!==a.value)b.value=a.value}else if(d==="option")b.selected=a.defaultSelected;else if(d==="input"||d==="textarea")b.defaultValue=a.defaultValue;b.removeAttribute(c.expando)}}
function Y(a){return"getElementsByTagName"in a?a.getElementsByTagName("*"):"querySelectorAll"in a?a.querySelectorAll("*"):[]}
function wa(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}
function xa(a){c.nodeName(a,"input")?wa(a):"getElementsByTagName"in a&&c.grep(a.getElementsByTagName("input"),wa)}
function ta(a,b){b.src?c.ajax({url:b.src,async:false,dataType:"script"}):c.globalEval((b.text||b.textContent||b.innerHTML||"").replace(ib,"/*$0*/"));b.parentNode&&b.parentNode.removeChild(b)}
function ya(a,b,d){var e=b==="width"?a.offsetWidth:a.offsetHeight,f=b==="width"?jb:kb;if(e>0)return d!=="border"&&c.each(f,function(){d||(e-=parseFloat(c.css(a,"padding"+ this))||0);d==="margin"?e+=parseFloat(c.css(a,d+ this))||0:e-=parseFloat(c.css(a,"border"+ this+"Width"))||0}),e+"px";e=I(a,b,b);if(e<0||e==null)e=a.style[b]||0;e=parseFloat(e)||0;d&&c.each(f,function(){e+=parseFloat(c.css(a,"padding"+ this))||0;d!=="padding"&&(e+=parseFloat(c.css(a,"border"+ this+"Width"))||0);d==="margin"&&(e+=parseFloat(c.css(a,d+ this))||0)});return e+"px"}
function za(a){return function(b,d){var o;typeof b!=="string"&&(d=b,b="*");if(c.isFunction(d))
for(var e=b.toLowerCase().split(Aa),f=0,g=e.length,h,k;f<g;f++)h=e[f],(k=/^\+/.test(h))&&(h=h.substr(1)||"*"),o=a[h]=a[h]||[],h=o,h[k?"unshift":"push"](d)}}
function Z(a,b,c,e,f,g){f=f||b.dataTypes[0];g=g||{};g[f]=true;for(var f=a[f],h=0,k=f?f.length:0,o=a===ga,p;h<k&&(o||!p);h++)p=f[h](b,c,e),typeof p==="string"&&(!o||g[p]?p=l:(b.dataTypes.unshift(p),p=Z(a,b,c,e,p,g)));if((o||!p)&&!g["*"])p=Z(a,b,c,e,"*",g);return p}
function Ba(a,b){var d,e,f=c.ajaxSettings.flatOptions||{};for(d in b)b[d]!==l&&((f[d]?a:e||(e={}))[d]=b[d]);e&&c.extend(true,a,e)}
function ha(a,b,d,e){if(c.isArray(b))c.each(b,function(b,f){d||lb.test(a)?e(a,f):ha(a+"["+(typeof f==="object"||c.isArray(f)?b:"")+"]",f,d,e)});else if(!d&&b!=null&&typeof b==="object")
for(var f in b)ha(a+"["+ f+"]",b[f],d,e);else e(a,b)}
function Ca(){try{return new j.XMLHttpRequest}catch(a){}}
function Da(){setTimeout(mb,0);return $=c.now()}
function mb(){$=l}
function O(a,b){var d={};c.each(Ea.concat.apply([],Ea.slice(0,b)),function(){d[this]=a});return d}
function Fa(a){if(!ia[a]){var b=m.body,d=c("<"+ a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){if(!E)E=m.createElement("iframe"),E.frameBorder=E.width=E.height=0;b.appendChild(E);if(!J||!E.createElement)J=(E.contentWindow||E.contentDocument).document,J.write((m.compatMode==="CSS1Compat"?"<!doctype html>":"")+"<html><body>"),J.close();d=J.createElement(a);J.body.appendChild(d);e=c.css(d,"display");b.removeChild(E)}
ia[a]=e}
return ia[a]}
function ja(a){return c.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:false}
var m=j.document,nb=j.navigator,ob=j.location,c=function(){function a(){if(!b.isReady){try{m.documentElement.doScroll("left")}catch(c){setTimeout(a,1);return}
b.ready()}}
var b=function(a,c){return new b.fn.init(a,c,f)},c=j.jQuery,e=j.$,f,g=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,h=/\S/,k=/^\s+/,o=/\s+$/,p=/\d/,V=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,W=/^[\],:{}\s]*$/,B=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,s=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,pb=/(?:^|:|,)(?:\s*\[)+/g,q=/(webkit)[ \/]([\w.]+)/,r=/(opera)(?:.*version)?[ \/]([\w.]+)/,w=/(msie) ([\w.]+)/,A=/(mozilla)(?:.*? rv:([\w.]+))?/,x=/-([a-z]|[0-9])/ig,t=/^-ms-/,qb=function(a,b){return(b+"").toUpperCase()},M=nb.userAgent,aa,T,rb=Object.prototype.toString,ka=Object.prototype.hasOwnProperty,la=Array.prototype.push,u=Array.prototype.slice,Ga=String.prototype.trim,Ha=Array.prototype.indexOf,v={};b.fn=b.prototype={constructor:b,init:function(a,c,d){var e;if(!a)return this;if(a.nodeType)return this.context=this[0]=a,this.length=1,this;if(a==="body"&&!c&&m.body)return this.context=m,this[0]=m.body,this.selector=a,this.length=1,this;if(typeof a==="string")
if((e=a.charAt(0)==="<"&&a.charAt(a.length- 1)===">"&&a.length>=3?[null,a,null]:g.exec(a))&&(e[1]||!c))
if(e[1])return d=(c=c instanceof b?c[0]:c)?c.ownerDocument||c:m,(a=V.exec(a))?b.isPlainObject(c)?(a=[m.createElement(a[1])],b.fn.attr.call(a,c,true)):a=[d.createElement(a[1])]:(a=b.buildFragment([e[1]],[d]),a=(a.cacheable?b.clone(a.fragment):a.fragment).childNodes),b.merge(this,a);else{if((c=m.getElementById(e[2]))&&c.parentNode){if(c.id!==e[2])return d.find(a);this.length=1;this[0]=c}
this.context=m;this.selector=a;return this}else return!c||c.jquery?(c||d).find(a):this.constructor(c).find(a);else
if(b.isFunction(a))return d.ready(a);if(a.selector!==l)this.selector=a.selector,this.context=a.context;return b.makeArray(a,this)},selector:"",jquery:"1.6.3",length:0,size:function(){return this.length},toArray:function(){return u.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+ a]:this[a]},pushStack:function(a,c,d){var e=this.constructor();b.isArray(a)?la.apply(e,a):b.merge(e,a);e.prevObject=this;e.context=this.context;if(c==="find")e.selector=this.selector+(this.selector?" ":"")+ d;else if(c)e.selector=this.selector+"."+ c+"("+ d+")";return e},each:function(a,c){return b.each(this,a,c)},ready:function(a){b.bindReady();aa.done(a);return this},eq:function(a){return a===-1?this.slice(a):this.slice(a,+a+ 1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(u.apply(this,arguments),"slice",u.call(arguments).join(","))},map:function(a){return this.pushStack(b.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:la,sort:[].sort,splice:[].splice};b.fn.init.prototype=b.fn;b.extend=b.fn.extend=function(){var a,c,d,e,f,g=arguments[0]||{},x=1,h=arguments.length,t=false;typeof g==="boolean"&&(t=g,g=arguments[1]||{},x=2);typeof g!=="object"&&!b.isFunction(g)&&(g={});h===x&&(g=this,--x);for(;x<h;x++)
if((a=arguments[x])!=null)
for(c in a)d=g[c],e=a[c],g!==e&&(t&&e&&(b.isPlainObject(e)||(f=b.isArray(e)))?(f?(f=false,d=d&&b.isArray(d)?d:[]):d=d&&b.isPlainObject(d)?d:{},g[c]=b.extend(t,d,e)):e!==l&&(g[c]=e));return g};b.extend({noConflict:function(a){if(j.$===b)j.$=e;if(a&&j.jQuery===b)j.jQuery=c;return b},isReady:false,readyWait:1,holdReady:function(a){a?b.readyWait++:b.ready(true)},ready:function(a){if(a===true&&!--b.readyWait||a!==true&&!b.isReady){if(!m.body)return setTimeout(b.ready,1);b.isReady=true;a!==true&&--b.readyWait>0||(aa.resolveWith(m,[b]),b.fn.trigger&&b(m).trigger("ready").unbind("ready"))}},bindReady:function(){if(!aa){aa=b._Deferred();if(m.readyState==="complete")return setTimeout(b.ready,1);if(m.addEventListener)m.addEventListener("DOMContentLoaded",T,false),j.addEventListener("load",b.ready,false);else if(m.attachEvent){m.attachEvent("onreadystatechange",T);j.attachEvent("onload",b.ready);var c=false;try{c=j.frameElement==null}catch(d){}
m.documentElement.doScroll&&c&&a()}}},isFunction:function(a){return b.type(a)==="function"},isArray:Array.isArray||function(a){return b.type(a)==="array"},isWindow:function(a){return a&&typeof a==="object"&&"setInterval"in a},isNaN:function(a){return a==null||!p.test(a)||isNaN(a)},type:function(a){return a==null?String(a):v[rb.call(a)]||"object"},isPlainObject:function(a){if(!a||b.type(a)!=="object"||a.nodeType||b.isWindow(a))return false;try{if(a.constructor&&!ka.call(a,"constructor")&&!ka.call(a.constructor.prototype,"isPrototypeOf"))return false}catch(c){return false}
for(var d in a);return d===l||ka.call(a,d)},isEmptyObject:function(a){for(var b in a)return false;return true},error:function(a){throw a;},parseJSON:function(a){if(typeof a!=="string"||!a)return null;a=b.trim(a);if(j.JSON&&j.JSON.parse)return j.JSON.parse(a);if(W.test(a.replace(B,"@").replace(s,"]").replace(pb,"")))return(new Function("return "+ a))();b.error("Invalid JSON: "+ a)},parseXML:function(a){var c,d;try{j.DOMParser?(d=new DOMParser,c=d.parseFromString(a,"text/xml")):(c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(a))}catch(e){c=l}(!c||!c.documentElement||c.getElementsByTagName("parsererror").length)&&b.error("Invalid XML: "+ a);return c},noop:function(){},globalEval:function(a){a&&h.test(a)&&(j.execScript||function(a){j.eval.call(j,a)})(a)},camelCase:function(a){return a.replace(t,"ms-").replace(x,qb)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var e,f=0,g=a.length,x=g===l||b.isFunction(a);if(d)
if(x)
for(e in a){if(c.apply(a[e],d)===false)break}else
for(;f<g;){if(c.apply(a[f++],d)===false)break}else if(x)
for(e in a){if(c.call(a[e],e,a[e])===false)break}else
for(;f<g;)
if(c.call(a[f],f,a[f++])===false)break;return a},trim:Ga?function(a){return a==null?"":Ga.call(a)}:function(a){return a==null?"":a.toString().replace(k,"").replace(o,"")},makeArray:function(a,c){var d=c||[];if(a!=null){var e=b.type(a);a.length==null||e==="string"||e==="function"||e==="regexp"||b.isWindow(a)?la.call(d,a):b.merge(d,a)}
return d},inArray:function(a,b){if(!b)return-1;if(Ha)return Ha.call(b,a);for(var c=0,d=b.length;c<d;c++)
if(b[c]===a)return c;return-1},merge:function(a,b){var c=a.length,d=0;if(typeof b.length==="number")
for(var e=b.length;d<e;d++)a[c++]=b[d];else
for(;b[d]!==l;)a[c++]=b[d++];a.length=c;return a},grep:function(a,b,c){for(var d=[],e,c=!!c,f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var e,f,g=[],x=0,h=a.length;if(a instanceof b||h!==l&&typeof h==="number"&&(h>0&&a[0]&&a[h- 1]||h===0||b.isArray(a)))
for(;x<h;x++)e=c(a[x],x,d),e!=null&&(g[g.length]=e);else
for(f in a)e=c(a[f],f,d),e!=null&&(g[g.length]=e);return g.concat.apply([],g)},guid:1,proxy:function(a,c){if(typeof c==="string")var d=a[c],c=a,a=d;if(!b.isFunction(a))return l;var e=u.call(arguments,2),d=function(){return a.apply(c,e.concat(u.call(arguments)))};d.guid=a.guid=a.guid||d.guid||b.guid++;return d},access:function(a,c,d,e,f,g){var x=a.length;if(typeof c==="object"){for(var h in c)b.access(a,h,c[h],e,f,d);return a}
if(d!==l){e=!g&&e&&b.isFunction(d);for(h=0;h<x;h++)f(a[h],c,e?d.call(a[h],h,f(a[h],c)):d,g);return a}
return x?f(a[0],c):l},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();a=q.exec(a)||r.exec(a)||w.exec(a)||a.indexOf("compatible")<0&&A.exec(a)||[];return{browser:a[1]||"",version:a[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}
b.extend(true,a,this);a.superclass=this;a.fn=a.prototype=this();a.fn.constructor=a;a.sub=this.sub;a.fn.init=function(d,e){e&&e instanceof b&&!(e instanceof a)&&(e=a(e));return b.fn.init.call(this,d,e,c)};a.fn.init.prototype=a.fn;var c=a(m);return a},browser:{}});b.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){v["[object "+ b+"]"]=b.toLowerCase()});M=b.uaMatch(M);if(M.browser)b.browser[M.browser]=true,b.browser.version=M.version;if(b.browser.webkit)b.browser.safari=true;h.test("\u00a0")&&(k=/^[\s\xA0]+/,o=/[\s\xA0]+$/);f=b(m);m.addEventListener?T=function(){m.removeEventListener("DOMContentLoaded",T,false);b.ready()}:m.attachEvent&&(T=function(){m.readyState==="complete"&&(m.detachEvent("onreadystatechange",T),b.ready())});return b}(),ma="done fail isResolved isRejected promise then always pipe".split(" "),Ia=[].slice;c.extend({_Deferred:function(){var a=[],b,d,e,f={done:function(){if(!e){var d=arguments,h,k,o,p,l;b&&(l=b,b=0);for(h=0,k=d.length;h<k;h++)o=d[h],p=c.type(o),p==="array"?f.done.apply(f,o):p==="function"&&a.push(o);l&&f.resolveWith(l[0],l[1])}
return this},resolveWith:function(c,f){if(!e&&!b&&!d){f=f||[];d=1;try{for(;a[0];)a.shift().apply(c,f)}finally{b=[c,f],d=0}}
return this},resolve:function(){f.resolveWith(this,arguments);return this},isResolved:function(){return!(!d&&!b)},cancel:function(){e=1;a=[];return this}};return f},Deferred:function(a){var b=c._Deferred(),d=c._Deferred(),e;c.extend(b,{then:function(a,c){b.done(a).fail(c);return this},always:function(){return b.done.apply(b,arguments).fail.apply(this,arguments)},fail:d.done,rejectWith:d.resolveWith,reject:d.resolve,isRejected:d.isResolved,pipe:function(a,d){return c.Deferred(function(e){c.each({done:[a,"resolve"],fail:[d,"reject"]},function(a,d){var f=d[0],g=d[1],l;if(c.isFunction(f))b[a](function(){if((l=f.apply(this,arguments))&&c.isFunction(l.promise))l.promise().then(e.resolve,e.reject);else e[g+"With"](this===b?e:this,[l])});else b[a](e[g])})}).promise()},promise:function(a){if(a==null){if(e)return e;e=a={}}
for(var c=ma.length;c--;)a[ma[c]]=b[ma[c]];return a}});b.done(d.cancel).fail(b.cancel);delete b.cancel;a&&a.call(b,b);return b},when:function(a){function b(a){return function(b){d[a]=arguments.length>1?Ia.call(arguments,0):b;--g||h.resolveWith(h,Ia.call(d,0))}}
var d=arguments,e=0,f=d.length,g=f,h=f<=1&&a&&c.isFunction(a.promise)?a:c.Deferred();if(f>1){for(;e<f;e++)d[e]&&c.isFunction(d[e].promise)?d[e].promise().then(b(e),h.reject):--g;g||h.resolveWith(h,d)}else h!==a&&h.resolveWith(h,f?[a]:[]);return h.promise()}});c.support=function(){var a=m.createElement("div"),b=m.documentElement,d,e,f,g,h,k;a.setAttribute("className","t");a.innerHTML="   <link><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type=checkbox>";d=a.getElementsByTagName("*");e=a.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};f=m.createElement("select");g=f.appendChild(m.createElement("option"));d=a.getElementsByTagName("input")[0];h={leadingWhitespace:a.firstChild.nodeType===3,tbody:!a.getElementsByTagName("tbody").length,htmlSerialize:!!a.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55$/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:d.value==="on",optSelected:g.selected,getSetAttribute:a.className!=="t",submitBubbles:true,changeBubbles:true,focusinBubbles:false,deleteExpando:true,noCloneEvent:true,inlineBlockNeedsLayout:false,shrinkWrapBlocks:false,reliableMarginRight:true};d.checked=true;h.noCloneChecked=d.cloneNode(true).checked;f.disabled=true;h.optDisabled=!g.disabled;try{delete a.test}catch(o){h.deleteExpando=false}!a.addEventListener&&a.attachEvent&&a.fireEvent&&(a.attachEvent("onclick",function(){h.noCloneEvent=false}),a.cloneNode(true).fireEvent("onclick"));d=m.createElement("input");d.value="t";d.setAttribute("type","radio");h.radioValue=d.value==="t";d.setAttribute("checked","checked");a.appendChild(d);e=m.createDocumentFragment();e.appendChild(a.firstChild);h.checkClone=e.cloneNode(true).cloneNode(true).lastChild.checked;a.innerHTML="";a.style.width=a.style.paddingLeft="1px";f=m.getElementsByTagName("body")[0];e=m.createElement(f?"div":"body");g={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"};f&&c.extend(g,{position:"absolute",left:"-1000px",top:"-1000px"});for(k in g)e.style[k]=g[k];e.appendChild(a);b=f||b;b.insertBefore(e,b.firstChild);h.appendChecked=d.checked;h.boxModel=a.offsetWidth===2;if("zoom"in a.style)a.style.display="inline",a.style.zoom=1,h.inlineBlockNeedsLayout=a.offsetWidth===2,a.style.display="",a.innerHTML="<div style='width:4px;'></div>",h.shrinkWrapBlocks=a.offsetWidth!==2;a.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";f=a.getElementsByTagName("td");d=f[0].offsetHeight===0;f[0].style.display="";f[1].style.display="none";h.reliableHiddenOffsets=d&&f[0].offsetHeight===0;a.innerHTML="";if(m.defaultView&&m.defaultView.getComputedStyle)d=m.createElement("div"),d.style.width="0",d.style.marginRight="0",a.appendChild(d),h.reliableMarginRight=(parseInt((m.defaultView.getComputedStyle(d,null)||{marginRight:0}).marginRight,10)||0)===0;e.innerHTML="";b.removeChild(e);if(a.attachEvent)
for(k in{submit:1,change:1,focusin:1})b="on"+ k,d=b in a,d||(a.setAttribute(b,"return;"),d=typeof a[b]==="function"),h[k+"Bubbles"]=d;e=e=f=g=f=d=a=d=null;return h}();c.boxModel=c.support.boxModel;var eb=/^(?:\{.*\}|\[.*\])$/,db=/([a-z])([A-Z])/g;c.extend({cache:{},uuid:0,expando:"jQuery"+(c.fn.jquery+ Math.random()).replace(/\D/g,""),noData:{embed:true,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:true},hasData:function(a){a=a.nodeType?c.cache[a[c.expando]]:a[c.expando];return!!a&&!r(a)},data:function(a,b,d,e){if(c.acceptData(a)){var f=c.expando,g=typeof b==="string",h=a.nodeType,k=h?c.cache:a,o=h?a[c.expando]:a[c.expando]&&c.expando;if(o&&(!e||!o||!k[o]||k[o][f])||!(g&&d===l)){if(!o)h?a[c.expando]=o=++c.uuid:o=c.expando;if(!k[o]&&(k[o]={},!h))k[o].toJSON=c.noop;if(typeof b==="object"||typeof b==="function")e?k[o][f]=c.extend(k[o][f],b):k[o]=c.extend(k[o],b);a=k[o];e&&(a[f]||(a[f]={}),a=a[f]);d!==l&&(a[c.camelCase(b)]=d);if(b==="events"&&!a[b])return a[f]&&a[f].events;g?(d=a[b],d==null&&(d=a[c.camelCase(b)])):d=a;return d}}},removeData:function(a,b,d){if(c.acceptData(a)){var e,f=c.expando,g=a.nodeType,h=g?c.cache:a,k=g?a[c.expando]:c.expando;if(h[k]){if(b&&(e=d?h[k][f]:h[k]))
if(e[b]||(b=c.camelCase(b)),delete e[b],!r(e))return;if(d&&(delete h[k][f],!r(h[k])))return;b=h[k][f];c.support.deleteExpando||!h.setInterval?delete h[k]:h[k]=null;if(b){h[k]={};if(!g)h[k].toJSON=c.noop;h[k][f]=b}else g&&(c.support.deleteExpando?delete a[c.expando]:a.removeAttribute?a.removeAttribute(c.expando):a[c.expando]=null)}}},_data:function(a,b,d){return c.data(a,b,d,true)},acceptData:function(a){if(a.nodeName){var b=c.noData[a.nodeName.toLowerCase()];if(b)return!(b===true||a.getAttribute("classid")!==b)}
return true}});c.fn.extend({data:function(a,b){var d=null;if(typeof a==="undefined"){if(this.length&&(d=c.data(this[0]),this[0].nodeType===1))
for(var e=this[0].attributes,f,g=0,h=e.length;g<h;g++)f=e[g].name,f.indexOf("data-")===0&&(f=c.camelCase(f.substring(5)),q(this[0],f,d[f]));return d}else if(typeof a==="object")return this.each(function(){c.data(this,a)});var k=a.split(".");k[1]=k[1]?"."+ k[1]:"";return b===l?(d=this.triggerHandler("getData"+ k[1]+"!",[k[0]]),d===l&&this.length&&(d=c.data(this[0],a),d=q(this[0],a,d)),d===l&&k[1]?this.data(k[0]):d):this.each(function(){var d=c(this),e=[k[0],b];d.triggerHandler("setData"+ k[1]+"!",e);c.data(this,a,b);d.triggerHandler("changeData"+ k[1]+"!",e)})},removeData:function(a){return this.each(function(){c.removeData(this,a)})}});c.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",c.data(a,b,(c.data(a,b,l,true)||0)+ 1,true))},_unmark:function(a,b,d){a!==true&&(d=b,b=a,a=false);if(b){var d=d||"fx",e=d+"mark";(a=a?0:(c.data(b,e,l,true)||1)- 1)?c.data(b,e,a,true):(c.removeData(b,e,true),u(b,d,"mark"))}},queue:function(a,b,d){if(a){var b=(b||"fx")+"queue",e=c.data(a,b,l,true);d&&(!e||c.isArray(d)?e=c.data(a,b,c.makeArray(d),true):e.push(d));return e||[]}},dequeue:function(a,b){var b=b||"fx",d=c.queue(a,b),e=d.shift();e==="inprogress"&&(e=d.shift());e&&(b==="fx"&&d.unshift("inprogress"),e.call(a,function(){c.dequeue(a,b)}));d.length||(c.removeData(a,b+"queue",true),u(a,b,"queue"))}});c.fn.extend({queue:function(a,b){typeof a!=="string"&&(b=a,a="fx");return b===l?c.queue(this[0],a):this.each(function(){var d=c.queue(this,a,b);a==="fx"&&d[0]!=="inprogress"&&c.dequeue(this,a)})},dequeue:function(a){return this.each(function(){c.dequeue(this,a)})},delay:function(a,b){a=c.fx?c.fx.speeds[a]||a:a;b=b||"fx";return this.queue(b,function(){var d=this;setTimeout(function(){c.dequeue(d,b)},a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a){function b(){--g||d.resolveWith(e,[e])}
typeof a!=="string"&&(a=l);var a=a||"fx",d=c.Deferred(),e=this,f=e.length,g=1,h=a+"defer",k=a+"queue";a+="mark";for(var o;f--;)
if(o=c.data(e[f],h,l,true)||(c.data(e[f],k,l,true)||c.data(e[f],a,l,true))&&c.data(e[f],h,c._Deferred(),true))g++,o.done(b);b();return d.promise()}});var Ja=/[\n\t\r]/g,na=/\s+/,sb=/\r/g,tb=/^(?:button|input)$/i,ub=/^(?:button|input|object|select|textarea)$/i,vb=/^a(?:rea)?$/i,Ka=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,K,La;c.fn.extend({attr:function(a,b){return c.access(this,a,b,true,c.attr)},removeAttr:function(a){return this.each(function(){c.removeAttr(this,a)})},prop:function(a,b){return c.access(this,a,b,true,c.prop)},removeProp:function(a){a=c.propFix[a]||a;return this.each(function(){try{this[a]=l,delete this[a]}catch(b){}})},addClass:function(a){var b,d,e,f,g,h,k;if(c.isFunction(a))return this.each(function(b){c(this).addClass(a.call(this,b,this.className))});if(a&&typeof a==="string"){b=a.split(na);for(d=0,e=this.length;d<e;d++)
if(f=this[d],f.nodeType===1)
if(!f.className&&b.length===1)f.className=a;else{g=" "+ f.className+" ";for(h=0,k=b.length;h<k;h++)~g.indexOf(" "+ b[h]+" ")||(g+=b[h]+" ");f.className=c.trim(g)}}
return this},removeClass:function(a){var b,d,e,f,g,h,k;if(c.isFunction(a))return this.each(function(b){c(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a==="string"||a===l){b=(a||"").split(na);for(d=0,e=this.length;d<e;d++)
if(f=this[d],f.nodeType===1&&f.className)
if(a){g=(" "+ f.className+" ").replace(Ja," ");for(h=0,k=b.length;h<k;h++)g=g.replace(" "+ b[h]+" "," ");f.className=c.trim(g)}else f.className=""}
return this},toggleClass:function(a,b){var d=typeof a,e=typeof b==="boolean";return c.isFunction(a)?this.each(function(d){c(this).toggleClass(a.call(this,d,this.className,b),b)}):this.each(function(){if(d==="string")
for(var f,g=0,h=c(this),k=b,o=a.split(na);f=o[g++];)k=e?k:!h.hasClass(f),h[k?"addClass":"removeClass"](f);else if(d==="undefined"||d==="boolean")this.className&&c._data(this,"__className__",this.className),this.className=this.className||a===false?"":c._data(this,"__className__")||""})},hasClass:function(a){for(var a=" "+ a+" ",b=0,c=this.length;b<c;b++)
if(this[b].nodeType===1&&(" "+ this[b].className+" ").replace(Ja," ").indexOf(a)>-1)return true;return false},val:function(a){var b,d,e=this[0];if(!arguments.length){if(e){if((b=c.valHooks[e.nodeName.toLowerCase()]||c.valHooks[e.type])&&"get"in b&&(d=b.get(e,"value"))!==l)return d;d=e.value;return typeof d==="string"?d.replace(sb,""):d==null?"":d}
return l}
var f=c.isFunction(a);return this.each(function(d){var e=c(this);if(this.nodeType===1&&(d=f?a.call(this,d,e.val()):a,d==null?d="":typeof d==="number"?d+="":c.isArray(d)&&(d=c.map(d,function(a){return a==null?"":a+""})),b=c.valHooks[this.nodeName.toLowerCase()]||c.valHooks[this.type],!b||!("set"in b)||b.set(this,d,"value")===l))this.value=d})}});c.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,d=a.selectedIndex,e=[],f=a.options,a=a.type==="select-one";if(d<0)return null;for(var g=a?d:0,h=a?d+ 1:f.length;g<h;g++)
if(b=f[g],b.selected&&(c.support.optDisabled?!b.disabled:b.getAttribute("disabled")===null)&&(!b.parentNode.disabled||!c.nodeName(b.parentNode,"optgroup"))){b=c(b).val();if(a)return b;e.push(b)}
return a&&!e.length&&f.length?c(f[d]).val():e},set:function(a,b){var d=c.makeArray(b);c(a).find("option").each(function(){this.selected=c.inArray(c(this).val(),d)>=0});if(!d.length)a.selectedIndex=-1;return d}}},attrFn:{val:true,css:true,html:true,text:true,data:true,width:true,height:true,offset:true},attrFix:{tabindex:"tabIndex"},attr:function(a,b,d,e){var f=a.nodeType;if(!a||f===3||f===8||f===2)return l;if(e&&b in c.attrFn)return c(a)[b](d);if(!("getAttribute"in a))return c.prop(a,b,d);var g,h;if(e=f!==1||!c.isXMLDoc(a))b=c.attrFix[b]||b,(h=c.attrHooks[b])||(Ka.test(b)?h=La:K&&(h=K));return d!==l?d===null?(c.removeAttr(a,b),l):h&&"set"in h&&e&&(g=h.set(a,d,b))!==l?g:(a.setAttribute(b,""+ d),d):h&&"get"in h&&e&&(g=h.get(a,b))!==null?g:(g=a.getAttribute(b),g===null?l:g)},removeAttr:function(a,b){var d;if(a.nodeType===1&&(b=c.attrFix[b]||b,c.attr(a,b,""),a.removeAttribute(b),Ka.test(b)&&(d=c.propFix[b]||b)in a))a[d]=false},attrHooks:{type:{set:function(a,b){if(tb.test(a.nodeName)&&a.parentNode)c.error("type property can't be changed");else if(!c.support.radioValue&&b==="radio"&&c.nodeName(a,"input")){var d=a.value;a.setAttribute("type",b);if(d)a.value=d;return b}}},value:{get:function(a,b){return K&&c.nodeName(a,"button")?K.get(a,b):b in a?a.value:null},set:function(a,b,d){if(K&&c.nodeName(a,"button"))return K.set(a,b,d);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,b,d){var e=a.nodeType;if(!a||e===3||e===8||e===2)return l;var f,g;if(e!==1||!c.isXMLDoc(a))b=c.propFix[b]||b,g=c.propHooks[b];return d!==l?g&&"set"in g&&(f=g.set(a,d,b))!==l?f:a[b]=d:g&&"get"in g&&(f=g.get(a,b))!==null?f:a[b]},propHooks:{tabIndex:{get:function(a){var b=a.getAttributeNode("tabindex");return b&&b.specified?parseInt(b.value,10):ub.test(a.nodeName)||vb.test(a.nodeName)&&a.href?0:l}}}});c.attrHooks.tabIndex=c.propHooks.tabIndex;La={get:function(a,b){var d;return c.prop(a,b)===true||(d=a.getAttributeNode(b))&&d.nodeValue!==false?b.toLowerCase():l},set:function(a,b,d){b===false?c.removeAttr(a,d):(b=c.propFix[d]||d,b in a&&(a[b]=true),a.setAttribute(d,d.toLowerCase()));return d}};if(!c.support.getSetAttribute)K=c.valHooks.button={get:function(a,b){var c;return(c=a.getAttributeNode(b))&&c.nodeValue!==""?c.nodeValue:l},set:function(a,b,c){var e=a.getAttributeNode(c);e||(e=m.createAttribute(c),a.setAttributeNode(e));return e.nodeValue=b+""}},c.each(["width","height"],function(a,b){c.attrHooks[b]=c.extend(c.attrHooks[b],{set:function(a,c){if(c==="")return a.setAttribute(b,"auto"),c}})});c.support.hrefNormalized||c.each(["href","src","width","height"],function(a,b){c.attrHooks[b]=c.extend(c.attrHooks[b],{get:function(a){a=a.getAttribute(b,2);return a===null?l:a}})});if(!c.support.style)c.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||l},set:function(a,b){return a.style.cssText=""+ b}};if(!c.support.optSelected)c.propHooks.selected=c.extend(c.propHooks.selected,{get:function(){return null}});c.support.checkOn||c.each(["radio","checkbox"],function(){c.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}});c.each(["radio","checkbox"],function(){c.valHooks[this]=c.extend(c.valHooks[this],{set:function(a,b){if(c.isArray(b))return a.checked=c.inArray(c(a).val(),b)>=0}})});var fa=/\.(.*)$/,oa=/^(?:textarea|input|select)$/i,fb=/\./g,gb=/ /g,wb=/[^\w\s.|`]/g,xb=function(a){return a.replace(wb,"\\$&")};c.event={add:function(a,b,d,e){if(!(a.nodeType===3||a.nodeType===8)){if(d===false)d=w;else if(!d)return;var f,g;if(d.handler)f=d,d=f.handler;if(!d.guid)d.guid=c.guid++;if(g=c._data(a)){var h=g.events,k=g.handle;if(!h)g.events=h={};if(!k)g.handle=k=function(a){return typeof c!=="undefined"&&(!a||c.event.triggered!==a.type)?c.event.handle.apply(k.elem,arguments):l};k.elem=a;for(var b=b.split(" "),o,p=0,j;o=b[p++];){g=f?c.extend({},f):{handler:d,data:e};o.indexOf(".")>-1?(j=o.split("."),o=j.shift(),g.namespace=j.slice(0).sort().join(".")):(j=[],g.namespace="");g.type=o;if(!g.guid)g.guid=d.guid;var m=h[o],B=c.event.special[o]||{};if(!m&&(m=h[o]=[],!B.setup||B.setup.call(a,e,j,k)===false))a.addEventListener?a.addEventListener(o,k,false):a.attachEvent&&a.attachEvent("on"+ o,k);if(B.add&&(B.add.call(a,g),!g.handler.guid))g.handler.guid=d.guid;m.push(g);c.event.global[o]=true}
a=null}}},global:{},remove:function(a,b,d,e){if(!(a.nodeType===3||a.nodeType===8)){d===false&&(d=w);var f,g,h=0,k,o,p,j,m,B,s=c.hasData(a)&&c._data(a),q=s&&s.events;if(s&&q){if(b&&b.type)d=b.handler,b=b.type;if(!b||typeof b==="string"&&b.charAt(0)===".")
for(f in b=b||"",q)c.event.remove(a,f+ b);else{for(b=b.split(" ");f=b[h++];)
if(j=f,k=f.indexOf(".")<0,o=[],k||(o=f.split("."),f=o.shift(),p=RegExp("(^|\\.)"+ c.map(o.slice(0).sort(),xb).join("\\.(?:.*\\.)?")+"(\\.|$)")),m=q[f])
if(d){j=c.event.special[f]||{};for(g=e||0;g<m.length;g++)
if(B=m[g],d.guid===B.guid){if(k||p.test(B.namespace))e==null&&m.splice(g--,1),j.remove&&j.remove.call(a,B);if(e!=null)break}
if(m.length===0||e!=null&&m.length===1)(!j.teardown||j.teardown.call(a,o)===false)&&c.removeEvent(a,f,s.handle),delete q[f]}else
for(g=0;g<m.length;g++)
if(B=m[g],k||p.test(B.namespace))c.event.remove(a,j,B.handler,g),m.splice(g--,1);if(c.isEmptyObject(q)){if(b=s.handle)b.elem=null;delete s.events;delete s.handle;c.isEmptyObject(s)&&c.removeData(a,l,true)}}}}},customEvent:{getData:true,setData:true,changeData:true},trigger:function(a,b,d,e){var f=a.type||a,g=[],h;f.indexOf("!")>=0&&(f=f.slice(0,-1),h=true);f.indexOf(".")>=0&&(g=f.split("."),f=g.shift(),g.sort());if(d&&!c.event.customEvent[f]||c.event.global[f]){a=typeof a==="object"?a[c.expando]?a:new c.Event(f,a):new c.Event(f);a.type=f;a.exclusive=h;a.namespace=g.join(".");a.namespace_re=RegExp("(^|\\.)"+ g.join("\\.(?:.*\\.)?")+"(\\.|$)");if(e||!d)a.preventDefault(),a.stopPropagation();if(d){if(!(d.nodeType===3||d.nodeType===8)){a.result=l;a.target=d;b=b!=null?c.makeArray(b):[];b.unshift(a);g=d;e=f.indexOf(":")<0?"on"+ f:"";do{h=c._data(g,"handle");a.currentTarget=g;h&&h.apply(g,b);if(e&&c.acceptData(g)&&g[e]&&g[e].apply(g,b)===false)a.result=false,a.preventDefault();g=g.parentNode||g.ownerDocument||g===a.target.ownerDocument&&j}while(g&&!a.isPropagationStopped());if(!a.isDefaultPrevented()){var k,g=c.event.special[f]||{};if((!g._default||g._default.call(d.ownerDocument,a)===false)&&!(f==="click"&&c.nodeName(d,"a"))&&c.acceptData(d)){try{if(e&&d[f])(k=d[e])&&(d[e]=null),c.event.triggered=f,d[f]()}catch(o){}
k&&(d[e]=k);c.event.triggered=l}}
return a.result}}else c.each(c.cache,function(){var d=this[c.expando];d&&d.events&&d.events[f]&&c.event.trigger(a,b,d.handle.elem)})}},handle:function(a){var a=c.event.fix(a||j.event),b=((c._data(this,"events")||{})[a.type]||[]).slice(0),d=!a.exclusive&&!a.namespace,e=Array.prototype.slice.call(arguments,0);e[0]=a;a.currentTarget=this;for(var f=0,g=b.length;f<g;f++){var h=b[f];if(d||a.namespace_re.test(h.namespace)){a.handler=h.handler;a.data=h.data;a.handleObj=h;h=h.handler.apply(this,e);if(h!==l)a.result=h,h===false&&(a.preventDefault(),a.stopPropagation());if(a.isImmediatePropagationStopped())break}}
return a.result},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),fix:function(a){if(a[c.expando])return a;for(var b=a,a=c.Event(b),d=this.props.length,e;d;)e=this.props[--d],a[e]=b[e];if(!a.target)a.target=a.srcElement||m;if(a.target.nodeType===3)a.target=a.target.parentNode;if(!a.relatedTarget&&a.fromElement)a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement;if(a.pageX==null&&a.clientX!=null)d=a.target.ownerDocument||m,b=d.documentElement,d=d.body,a.pageX=a.clientX+(b&&b.scrollLeft||d&&d.scrollLeft||0)-(b&&b.clientLeft||d&&d.clientLeft||0),a.pageY=a.clientY+(b&&b.scrollTop||d&&d.scrollTop||0)-(b&&b.clientTop||d&&d.clientTop||0);if(a.which==null&&(a.charCode!=null||a.keyCode!=null))a.which=a.charCode!=null?a.charCode:a.keyCode;if(!a.metaKey&&a.ctrlKey)a.metaKey=a.ctrlKey;if(!a.which&&a.button!==l)a.which=a.button&1?1:a.button&2?3:a.button&4?2:0;return a},guid:1E8,proxy:c.proxy,special:{ready:{setup:c.bindReady,teardown:c.noop},live:{add:function(a){c.event.add(this,X(a.origType,a.selector),c.extend({},a,{handler:ea,guid:a.handler.guid}))},remove:function(a){c.event.remove(this,X(a.origType,a.selector),a)}},beforeunload:{setup:function(a,b,d){if(c.isWindow(this))this.onbeforeunload=d},teardown:function(a,b){if(this.onbeforeunload===b)this.onbeforeunload=null}}}};c.removeEvent=m.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,false)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+ b,c)};c.Event=function(a,b){if(!this.preventDefault)return new c.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===false||a.getPreventDefault&&a.getPreventDefault()?D:w):this.type=a;b&&c.extend(this,b);this.timeStamp=c.now();this[c.expando]=true};c.Event.prototype={preventDefault:function(){this.isDefaultPrevented=D;var a=this.originalEvent;if(a)a.preventDefault?a.preventDefault():a.returnValue=false},stopPropagation:function(){this.isPropagationStopped=D;var a=this.originalEvent;if(a)a.stopPropagation&&a.stopPropagation(),a.cancelBubble=true},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=D;this.stopPropagation()},isDefaultPrevented:w,isPropagationStopped:w,isImmediatePropagationStopped:w};var Ma=function(a){var b=a.relatedTarget,d=false,e=a.type;a.type=a.data;if(b!==this&&(b&&(d=c.contains(this,b)),!d))c.event.handle.apply(this,arguments),a.type=e},Na=function(a){a.type=a.data;c.event.handle.apply(this,arguments)};c.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){c.event.special[a]={setup:function(d){c.event.add(this,b,d&&d.selector?Na:Ma,a)},teardown:function(a){c.event.remove(this,b,a&&a.selector?Na:Ma)}}});if(!c.support.submitBubbles)c.event.special.submit={setup:function(){if(c.nodeName(this,"form"))return false;else c.event.add(this,"click.specialSubmit",function(a){var b=a.target,d=c.nodeName(b,"input")?b.type:"";(d==="submit"||d==="image")&&c(b).closest("form").length&&z("submit",this,arguments)}),c.event.add(this,"keypress.specialSubmit",function(a){var b=a.target,d=c.nodeName(b,"input")?b.type:"";(d==="text"||d==="password")&&c(b).closest("form").length&&a.keyCode===13&&z("submit",this,arguments)})},teardown:function(){c.event.remove(this,".specialSubmit")}};if(!c.support.changeBubbles){var R,Oa=function(a){var b=c.nodeName(a,"input")?a.type:"",d=a.value;if(b==="radio"||b==="checkbox")d=a.checked;else if(b==="select-multiple")d=a.selectedIndex>-1?c.map(a.options,function(a){return a.selected}).join("-"):"";else if(c.nodeName(a,"select"))d=a.selectedIndex;return d},ba=function(a,b){var d=a.target,e,f;if(oa.test(d.nodeName)&&!d.readOnly&&(e=c._data(d,"_change_data"),f=Oa(d),(a.type!=="focusout"||d.type!=="radio")&&c._data(d,"_change_data",f),!(e===l||f===e)))
if(e!=null||f)a.type="change",a.liveFired=l,c.event.trigger(a,b,d)};c.event.special.change={filters:{focusout:ba,beforedeactivate:ba,click:function(a){var b=a.target,d=c.nodeName(b,"input")?b.type:"";(d==="radio"||d==="checkbox"||c.nodeName(b,"select"))&&ba.call(this,a)},keydown:function(a){var b=a.target,d=c.nodeName(b,"input")?b.type:"";(a.keyCode===13&&!c.nodeName(b,"textarea")||a.keyCode===32&&(d==="checkbox"||d==="radio")||d==="select-multiple")&&ba.call(this,a)},beforeactivate:function(a){a=a.target;c._data(a,"_change_data",Oa(a))}},setup:function(){if(this.type==="file")return false;for(var a in R)c.event.add(this,a+".specialChange",R[a]);return oa.test(this.nodeName)},teardown:function(){c.event.remove(this,".specialChange");return oa.test(this.nodeName)}};R=c.event.special.change.filters;R.focus=R.beforeactivate}
c.support.focusinBubbles||c.each({focus:"focusin",blur:"focusout"},function(a,b){function d(a){var d=c.event.fix(a);d.type=b;d.originalEvent={};c.event.trigger(d,null,d.target);d.isDefaultPrevented()&&a.preventDefault()}
var e=0;c.event.special[b]={setup:function(){e++===0&&m.addEventListener(a,d,true)},teardown:function(){--e===0&&m.removeEventListener(a,d,true)}}});c.each(["bind","one"],function(a,b){c.fn[b]=function(a,e,f){var g;if(typeof a==="object"){for(var h in a)this[b](h,e,a[h],f);return this}
if(arguments.length===2||e===false)f=e,e=l;b==="one"?(g=function(a){c(this).unbind(a,g);return f.apply(this,arguments)},g.guid=f.guid||c.guid++):g=f;if(a==="unload"&&b!=="one")this.one(a,e,f);else{h=0;for(var k=this.length;h<k;h++)c.event.add(this[h],a,g,e)}
return this}});c.fn.extend({unbind:function(a,b){if(typeof a==="object"&&!a.preventDefault)
for(var d in a)this.unbind(d,a[d]);else{d=0;for(var e=this.length;d<e;d++)c.event.remove(this[d],a,b)}
return this},delegate:function(a,b,c,e){return this.live(b,c,e,a)},undelegate:function(a,b,c){return arguments.length===0?this.unbind("live"):this.die(b,null,c,a)},trigger:function(a,b){return this.each(function(){c.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return c.event.trigger(a,b,this[0],true)},toggle:function(a){var b=arguments,d=a.guid||c.guid++,e=0,f=function(d){var f=(c.data(this,"lastToggle"+ a.guid)||0)%e;c.data(this,"lastToggle"+ a.guid,f+ 1);d.preventDefault();return b[f].apply(this,arguments)||false};for(f.guid=d;e<b.length;)b[e++].guid=d;return this.click(f)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}});var pa={focus:"focusin",blur:"focusout",mouseenter:"mouseover",mouseleave:"mouseout"};c.each(["live","die"],function(a,b){c.fn[b]=function(a,e,f,g){var h=0,k,o,p=g||this.selector,j=g?this:c(this.context);if(typeof a==="object"&&!a.preventDefault){for(k in a)j[b](k,e,a[k],p);return this}
if(b==="die"&&!a&&g&&g.charAt(0)===".")return j.unbind(g),this;if(e===false||c.isFunction(e))f=e||w,e=l;for(a=(a||"").split(" ");(g=a[h++])!=null;)
if(k=fa.exec(g),o="",k&&(o=k[0],g=g.replace(fa,"")),g==="hover")a.push("mouseenter"+ o,"mouseleave"+ o);else
if(k=g,pa[g]?(a.push(pa[g]+ o),g+=o):g=(pa[g]||g)+ o,b==="live"){o=0;for(var m=j.length;o<m;o++)c.event.add(j[o],"live."+ X(g,p),{data:e,selector:p,handler:f,origType:g,origHandler:f,preType:k})}else j.unbind("live."+ X(g,p),f);return this}});c.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),function(a,b){c.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.bind(b,a,c):this.trigger(b)};c.attrFn&&(c.attrFn[b]=true)});(function(){function a(a,b,c,d,e,f){for(var e=0,g=d.length;e<g;e++){var h=d[e];if(h){for(var k=false,h=h[a];h;){if(h.sizcache===c){k=d[h.sizset];break}
if(h.nodeType===1&&!f)h.sizcache=c,h.sizset=e;if(h.nodeName.toLowerCase()===b){k=h;break}
h=h[a]}
d[e]=k}}}
function b(a,b,c,d,e,f){for(var e=0,g=d.length;e<g;e++){var h=d[e];if(h){for(var k=false,h=h[a];h;){if(h.sizcache===c){k=d[h.sizset];break}
if(h.nodeType===1){if(!f)h.sizcache=c,h.sizset=e;if(typeof b!=="string"){if(h===b){k=true;break}}else if(p.filter(b,[h]).length>0){k=h;break}}
h=h[a]}
d[e]=k}}}
var d=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,e=0,f=Object.prototype.toString,g=false,h=true,k=/\\/g,o=/\W/;[0,0].sort(function(){h=false;return 0});var p=function(a,b,c,e){var c=c||[],g=b=b||m;if(b.nodeType!==1&&b.nodeType!==9)return[];if(!a||typeof a!=="string")return c;var h,k,o,l,s,B=true,A=p.isXML(b),v=[],w=a;do
if(d.exec(""),h=d.exec(w))
if(w=h[3],v.push(h[1]),h[2]){l=h[3];break}while(h);if(v.length>1&&q.exec(a))
if(v.length===2&&j.relative[v[0]])k=y(v[0]+ v[1],b);else
for(k=j.relative[v[0]]?[b]:p(v.shift(),b);v.length;)a=v.shift(),j.relative[a]&&(a+=v.shift()),k=y(a,k);else
if(!e&&v.length>1&&b.nodeType===9&&!A&&j.match.ID.test(v[0])&&!j.match.ID.test(v[v.length- 1])&&(h=p.find(v.shift(),b,A),b=h.expr?p.filter(h.expr,h.set)[0]:h.set[0]),b){h=e?{expr:v.pop(),set:r(e)}:p.find(v.pop(),v.length===1&&(v[0]==="~"||v[0]==="+")&&b.parentNode?b.parentNode:b,A);k=h.expr?p.filter(h.expr,h.set):h.set;for(v.length>0?o=r(k):B=false;v.length;)h=s=v.pop(),j.relative[s]?h=v.pop():s="",h==null&&(h=b),j.relative[s](o,h,A)}else o=[];o||(o=k);o||p.error(s||a);if(f.call(o)==="[object Array]")
if(B)
if(b&&b.nodeType===1)
for(a=0;o[a]!=null;a++)o[a]&&(o[a]===true||o[a].nodeType===1&&p.contains(b,o[a]))&&c.push(k[a]);else
for(a=0;o[a]!=null;a++)o[a]&&o[a].nodeType===1&&c.push(k[a]);else c.push.apply(c,o);else r(o,c);l&&(p(l,g,c,e),p.uniqueSort(c));return c};p.uniqueSort=function(a){if(w&&(g=h,a.sort(w),g))
for(var b=1;b<a.length;b++)a[b]===a[b- 1]&&a.splice(b--,1);return a};p.matches=function(a,b){return p(a,null,null,b)};p.matchesSelector=function(a,b){return p(b,null,null,[a]).length>0};p.find=function(a,b,c){var d;if(!a)return[];for(var e=0,f=j.order.length;e<f;e++){var g,h=j.order[e];if(g=j.leftMatch[h].exec(a)){var o=g[1];g.splice(1,1);if(o.substr(o.length- 1)!=="\\"&&(g[1]=(g[1]||"").replace(k,""),d=j.find[h](g,b,c),d!=null)){a=a.replace(j.match[h],"");break}}}
d||(d=typeof b.getElementsByTagName!=="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}};p.filter=function(a,b,c,d){for(var e,f,g=a,h=[],k=b,o=b&&b[0]&&p.isXML(b[0]);a&&b.length;){for(var m in j.filter)
if((e=j.leftMatch[m].exec(a))!=null&&e[2]){var s,v,r=j.filter[m];v=e[1];f=false;e.splice(1,1);if(v.substr(v.length- 1)!=="\\"){k===h&&(h=[]);if(j.preFilter[m])
if(e=j.preFilter[m](e,k,c,h,d,o)){if(e===true)continue}else f=s=true;if(e)
for(var q=0;(v=k[q])!=null;q++)
if(v){s=r(v,e,q,k);var B=d^!!s;c&&s!=null?B?f=true:k[q]=false:B&&(h.push(v),f=true)}
if(s!==l){c||(k=h);a=a.replace(j.match[m],"");if(!f)return[];break}}}
if(a===g)
if(f==null)p.error(a);else break;g=a}
return k};p.error=function(a){throw"Syntax error, unrecognized expression: "+ a;};var j=p.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b==="string",d=c&&!o.test(b),c=c&&!d;d&&(b=b.toLowerCase());for(var d=0,e=a.length,f;d<e;d++)
if(f=a[d]){for(;(f=f.previousSibling)&&f.nodeType!==1;);a[d]=c||f&&f.nodeName.toLowerCase()===b?f||false:f===b}
c&&p.filter(b,a,true)},">":function(a,b){var c,d=typeof b==="string",e=0,f=a.length;if(d&&!o.test(b))
for(b=b.toLowerCase();e<f;e++){if(c=a[e])c=c.parentNode,a[e]=c.nodeName.toLowerCase()===b?c:false}else{for(;e<f;e++)(c=a[e])&&(a[e]=d?c.parentNode:c.parentNode===b);d&&p.filter(b,a,true)}},"":function(c,d,f){var g,h=e++,k=b;typeof d==="string"&&!o.test(d)&&(g=d=d.toLowerCase(),k=a);k("parentNode",d,h,c,g,f)},"~":function(c,d,f){var g,h=e++,k=b;typeof d==="string"&&!o.test(d)&&(g=d=d.toLowerCase(),k=a);k("previousSibling",d,h,c,g,f)}},find:{ID:function(a,b,c){if(typeof b.getElementById!=="undefined"&&!c)return(a=b.getElementById(a[1]))&&a.parentNode?[a]:[]},NAME:function(a,b){if(typeof b.getElementsByName!=="undefined"){for(var c=[],d=b.getElementsByName(a[1]),e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!=="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+ a[1].replace(k,"")+" ";if(f)return a;for(var f=0,g;(g=b[f])!=null;f++)g&&(e^(g.className&&(" "+ g.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(g):c&&(b[f]=false));return false},ID:function(a){return a[1].replace(k,"")},TAG:function(a){return a[1].replace(k,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||p.error(a[0]);a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+ a[2]||a[2]);a[2]=b[1]+(b[2]||1)- 0;a[3]=b[3]- 0}else a[2]&&p.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){b=a[1]=a[1].replace(k,"");!f&&j.attrMap[b]&&(a[1]=j.attrMap[b]);a[4]=(a[4]||a[5]||"").replace(k,"");a[2]==="~="&&(a[4]=" "+ a[4]+" ");return a},PSEUDO:function(a,b,c,e,f){if(a[1]==="not")
if((d.exec(a[3])||"").length>1||/^\w/.test(a[3]))a[3]=p(a[3],null,null,b);else return a=p.filter(a[3],b,c,1^f),c||e.push.apply(e,a),false;else
if(j.match.POS.test(a[0])||j.match.CHILD.test(a[0]))return true;return a},POS:function(a){a.unshift(true);return a}},filters:{enabled:function(a){return a.disabled===false&&a.type!=="hidden"},disabled:function(a){return a.disabled===true},checked:function(a){return a.checked===true},selected:function(a){return a.selected===true},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!p(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length- 1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]- 0},gt:function(a,b,c){return b>c[3]- 0},nth:function(a,b,c){return c[3]- 0===b},eq:function(a,b,c){return c[3]- 0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=j.filters[e];if(f)return f(a,c,b,d);else if(e==="contains")return(a.textContent||a.innerText||p.getText([a])||"").indexOf(b[3])>=0;else if(e==="not"){b=b[3];c=0;for(d=b.length;c<d;c++)
if(b[c]===a)return false;return true}else p.error(e)},CHILD:function(a,b){var c=b[1],d=a;switch(c){case"only":case"first":for(;d=d.previousSibling;)
if(d.nodeType===1)return false;if(c==="first")return true;d=a;case"last":for(;d=d.nextSibling;)
if(d.nodeType===1)return false;return true;case"nth":var c=b[2],e=b[3];if(c===1&&e===0)return true;var f=b[0],g=a.parentNode;if(g&&(g.sizcache!==f||!a.nodeIndex)){for(var h=0,d=g.firstChild;d;d=d.nextSibling)
if(d.nodeType===1)d.nodeIndex=++h;g.sizcache=f}
d=a.nodeIndex- e;return c===0?d===0:d%c===0&&d/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],c=j.attrHandle[c]?j.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),d=c+"",e=b[2],f=b[4];return c==null?e==="!=":e==="="?d===f:e==="*="?d.indexOf(f)>=0:e==="~="?(" "+ d+" ").indexOf(f)>=0:!f?d&&c!==false:e==="!="?d!==f:e==="^="?d.indexOf(f)===0:e==="$="?d.substr(d.length- f.length)===f:e==="|="?d===f||d.substr(0,f.length+ 1)===f+"-":false},POS:function(a,b,c,d){var e=j.setFilters[b[2]];if(e)return e(a,c,b,d)}}},q=j.match.POS,B=function(a,b){return"\\"+(b- 0+ 1)},s;for(s in j.match)j.match[s]=RegExp(j.match[s].source+/(?![^\[]*\])(?![^\(]*\))/.source),j.leftMatch[s]=RegExp(/(^(?:.|\r|\n)*?)/.source+ j.match[s].source.replace(/\\(\d+)/g,B));var r=function(a,b){a=Array.prototype.slice.call(a,0);return b?(b.push.apply(b,a),b):a};try{Array.prototype.slice.call(m.documentElement.childNodes,0)}catch(u){r=function(a,b){var c=0,d=b||[];if(f.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length==="number")
for(var e=a.length;c<e;c++)d.push(a[c]);else
for(;a[c];c++)d.push(a[c]);return d}}
var w,A;m.documentElement.compareDocumentPosition?w=function(a,b){return a===b?(g=true,0):!a.compareDocumentPosition||!b.compareDocumentPosition?a.compareDocumentPosition?-1:1:a.compareDocumentPosition(b)&4?-1:1}:(w=function(a,b){if(a===b)return g=true,0;else if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex- b.sourceIndex;var c,d,e=[],f=[];c=a.parentNode;d=b.parentNode;var h=c;if(c===d)return A(a,b);else if(c){if(!d)return 1}else return-1;for(;h;)e.unshift(h),h=h.parentNode;for(h=d;h;)f.unshift(h),h=h.parentNode;c=e.length;d=f.length;for(h=0;h<c&&h<d;h++)
if(e[h]!==f[h])return A(e[h],f[h]);return h===c?A(a,f[h],-1):A(e[h],b,1)},A=function(a,b,c){if(a===b)return c;for(a=a.nextSibling;a;){if(a===b)return-1;a=a.nextSibling}
return 1});p.getText=function(a){for(var b="",c,d=0;a[d];d++)c=a[d],c.nodeType===3||c.nodeType===4?b+=c.nodeValue:c.nodeType!==8&&(b+=p.getText(c.childNodes));return b};(function(){var a=m.createElement("div"),b="script"+(new Date).getTime(),c=m.documentElement;a.innerHTML="<a name='"+ b+"'/>";c.insertBefore(a,c.firstChild);if(m.getElementById(b))j.find.ID=function(a,b,c){if(typeof b.getElementById!=="undefined"&&!c)return(b=b.getElementById(a[1]))?b.id===a[1]||typeof b.getAttributeNode!=="undefined"&&b.getAttributeNode("id").nodeValue===a[1]?[b]:l:[]},j.filter.ID=function(a,b){var c=typeof a.getAttributeNode!=="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b};c.removeChild(a);c=a=null})();(function(){var a=m.createElement("div");a.appendChild(m.createComment(""));if(a.getElementsByTagName("*").length>0)j.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){for(var d=[],e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}
return c};a.innerHTML="<a href='#'></a>";if(a.firstChild&&typeof a.firstChild.getAttribute!=="undefined"&&a.firstChild.getAttribute("href")!=="#")j.attrHandle.href=function(a){return a.getAttribute("href",2)};a=null})();m.querySelectorAll&&function(){var a=p,b=m.createElement("div");b.innerHTML="<p class='TEST'></p>";if(!(b.querySelectorAll&&b.querySelectorAll(".TEST").length===0)){p=function(b,c,d,e){c=c||m;if(!e&&!p.isXML(c)){var f=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(f&&(c.nodeType===1||c.nodeType===9))
if(f[1])return r(c.getElementsByTagName(b),d);else
if(f[2]&&j.find.CLASS&&c.getElementsByClassName)return r(c.getElementsByClassName(f[2]),d);if(c.nodeType===9){if(b==="body"&&c.body)return r([c.body],d);else if(f&&f[3]){var g=c.getElementById(f[3]);if(g&&g.parentNode){if(g.id===f[3])return r([g],d)}else return r([],d)}
try{return r(c.querySelectorAll(b),d)}catch(h){}}else if(c.nodeType===1&&c.nodeName.toLowerCase()!=="object"){var f=c,k=(g=c.getAttribute("id"))||"__sizzle__",o=c.parentNode,l=/^\s*[+~]/.test(b);g?k=k.replace(/'/g,"\\$&"):c.setAttribute("id",k);if(l&&o)c=c.parentNode;try{if(!l||o)return r(c.querySelectorAll("[id='"+ k+"'] "+ b),d)}catch(t){}finally{g||f.removeAttribute("id")}}}
return a(b,c,d,e)};for(var c in a)p[c]=a[c];b=null}}();(function(){var a=m.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var c=!b.call(m.createElement("div"),"div"),d=false;try{b.call(m.documentElement,"[test!='']:sizzle")}catch(e){d=true}
p.matchesSelector=function(a,e){e=e.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!p.isXML(a))try{if(d||!j.match.PSEUDO.test(e)&&!/!=/.test(e)){var f=b.call(a,e);if(f||!c||a.document&&a.document.nodeType!==11)return f}}catch(g){}
return p(e,null,null,[a]).length>0}}})();(function(){var a=m.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(a.getElementsByClassName&&a.getElementsByClassName("e").length!==0&&(a.lastChild.className="e",a.getElementsByClassName("e").length!==1))j.order.splice(1,0,"CLASS"),j.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!=="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null})();p.contains=m.documentElement.contains?function(a,b){return a!==b&&(a.contains?a.contains(b):true)}:m.documentElement.compareDocumentPosition?function(a,b){return!!(a.compareDocumentPosition(b)&16)}:function(){return false};p.isXML=function(a){return(a=(a?a.ownerDocument||a:0).documentElement)?a.nodeName!=="HTML":false};var y=function(a,b){for(var c,d=[],e="",f=b.nodeType?[b]:b;c=j.match.PSEUDO.exec(a);)e+=c[0],a=a.replace(j.match.PSEUDO,"");a=j.relative[a]?a+"*":a;c=0;for(var g=f.length;c<g;c++)p(a,f[c],d);return p.filter(e,d)};c.find=p;c.expr=p.selectors;c.expr[":"]=c.expr.filters;c.unique=p.uniqueSort;c.text=p.getText;c.isXMLDoc=p.isXML;c.contains=p.contains})();var yb=/Until$/,zb=/^(?:parents|prevUntil|prevAll)/,Ab=/,/,hb=/^.[^:#\[\.,]*$/,Bb=Array.prototype.slice,Pa=c.expr.match.POS,Cb={children:true,contents:true,next:true,prev:true};c.fn.extend({find:function(a){var b=this,d,e;if(typeof a!=="string")return c(a).filter(function(){for(d=0,e=b.length;d<e;d++)
if(c.contains(b[d],this))return true});var f=this.pushStack("","find",a),g,h,k;for(d=0,e=this.length;d<e;d++)
if(g=f.length,c.find(a,this[d],f),d>0)
for(h=g;h<f.length;h++)
for(k=0;k<g;k++)
if(f[k]===f[h]){f.splice(h--,1);break}
return f},has:function(a){var b=c(a);return this.filter(function(){for(var a=0,e=b.length;a<e;a++)
if(c.contains(this,b[a]))return true})},not:function(a){return this.pushStack(N(this,a,false),"not",a)},filter:function(a){return this.pushStack(N(this,a,true),"filter",a)},is:function(a){return!!a&&(typeof a==="string"?c.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var d=[],e,f,g=this[0];if(c.isArray(a)){var h,k={},o=1;if(g&&a.length){for(e=0,f=a.length;e<f;e++)h=a[e],k[h]||(k[h]=Pa.test(h)?c(h,b||this.context):h);for(;g&&g.ownerDocument&&g!==b;){for(h in k)e=k[h],(e.jquery?e.index(g)>-1:c(g).is(e))&&d.push({selector:h,elem:g,level:o});g=g.parentNode;o++}}
return d}
h=Pa.test(a)||typeof a!=="string"?c(a,b||this.context):0;for(e=0,f=this.length;e<f;e++)
for(g=this[e];g;)
if(h?h.index(g)>-1:c.find.matchesSelector(g,a)){d.push(g);break}else
if(g=g.parentNode,!g||!g.ownerDocument||g===b||g.nodeType===11)break;d=d.length>1?c.unique(d):d;return this.pushStack(d,"closest",a)},index:function(a){return!a?this[0]&&this[0].parentNode?this.prevAll().length:-1:typeof a==="string"?c.inArray(this[0],c(a)):c.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var d=typeof a==="string"?c(a,b):c.makeArray(a&&a.nodeType?[a]:a),e=c.merge(this.get(),d);return this.pushStack(!d[0]||!d[0].parentNode||d[0].parentNode.nodeType===11||!e[0]||!e[0].parentNode||e[0].parentNode.nodeType===11?e:c.unique(e))},andSelf:function(){return this.add(this.prevObject)}});c.each({parent:function(a){return(a=a.parentNode)&&a.nodeType!==11?a:null},parents:function(a){return c.dir(a,"parentNode")},parentsUntil:function(a,b,d){return c.dir(a,"parentNode",d)},next:function(a){return c.nth(a,2,"nextSibling")},prev:function(a){return c.nth(a,2,"previousSibling")},nextAll:function(a){return c.dir(a,"nextSibling")},prevAll:function(a){return c.dir(a,"previousSibling")},nextUntil:function(a,b,d){return c.dir(a,"nextSibling",d)},prevUntil:function(a,b,d){return c.dir(a,"previousSibling",d)},siblings:function(a){return c.sibling(a.parentNode.firstChild,a)},children:function(a){return c.sibling(a.firstChild)},contents:function(a){return c.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:c.makeArray(a.childNodes)}},function(a,b){c.fn[a]=function(d,e){var f=c.map(this,b,d),g=Bb.call(arguments);yb.test(a)||(e=d);e&&typeof e==="string"&&(f=c.filter(e,f));f=this.length>1&&!Cb[a]?c.unique(f):f;if((this.length>1||Ab.test(e))&&zb.test(a))f=f.reverse();return this.pushStack(f,a,g.join(","))}});c.extend({filter:function(a,b,d){d&&(a=":not("+ a+")");return b.length===1?c.find.matchesSelector(b[0],a)?[b[0]]:[]:c.find.matches(a,b)},dir:function(a,b,d){for(var e=[],a=a[b];a&&a.nodeType!==9&&(d===l||a.nodeType!==1||!c(a).is(d));)a.nodeType===1&&e.push(a),a=a[b];return e},nth:function(a,b,c){for(var b=b||1,e=0;a;a=a[c])
if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var Db=/ jQuery\d+="(?:\d+|null)"/g,qa=/^\s+/,Qa=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Ra=/<([\w:]+)/,Eb=/<tbody/i,Fb=/<|&#?\w+;/,Sa=/<(?:script|object|embed|option|style)/i,Ta=/checked\s*(?:[^=]|=\s*.checked.)/i,Gb=/\/(java|ecma)script/i,ib=/^\s*<!(?:\[CDATA\[|\-\-)/,y={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};y.optgroup=y.option;y.tbody=y.tfoot=y.colgroup=y.caption=y.thead;y.th=y.td;if(!c.support.htmlSerialize)y._default=[1,"div<div>","</div>"];c.fn.extend({text:function(a){return c.isFunction(a)?this.each(function(b){var d=c(this);d.text(a.call(this,b,d.text()))}):typeof a!=="object"&&a!==l?this.empty().append((this[0]&&this[0].ownerDocument||m).createTextNode(a)):c.text(this)},wrapAll:function(a){if(c.isFunction(a))return this.each(function(b){c(this).wrapAll(a.call(this,b))});if(this[0]){var b=c(a,this[0].ownerDocument).eq(0).clone(true);this[0].parentNode&&b.insertBefore(this[0]);b.map(function(){for(var a=this;a.firstChild&&a.firstChild.nodeType===1;)a=a.firstChild;return a}).append(this)}
return this},wrapInner:function(a){return c.isFunction(a)?this.each(function(b){c(this).wrapInner(a.call(this,b))}):this.each(function(){var b=c(this),d=b.contents();d.length?d.wrapAll(a):b.append(a)})},wrap:function(a){return this.each(function(){c(this).wrapAll(a)})},unwrap:function(){return this.parent().each(function(){c.nodeName(this,"body")||c(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,true,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,true,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,false,function(a){this.parentNode.insertBefore(a,this)});else if(arguments.length){var a=c(arguments[0]);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,false,function(a){this.parentNode.insertBefore(a,this.nextSibling)});else if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,c(arguments[0]).toArray());return a}},remove:function(a,b){for(var d=0,e;(e=this[d])!=null;d++)
if(!a||c.filter(a,[e]).length)!b&&e.nodeType===1&&(c.cleanData(e.getElementsByTagName("*")),c.cleanData([e])),e.parentNode&&e.parentNode.removeChild(e);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++)
for(b.nodeType===1&&c.cleanData(b.getElementsByTagName("*"));b.firstChild;)b.removeChild(b.firstChild);return this},clone:function(a,b){a=a==null?false:a;b=b==null?a:b;return this.map(function(){return c.clone(this,a,b)})},html:function(a){if(a===l)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(Db,""):null;else if(typeof a==="string"&&!Sa.test(a)&&(c.support.leadingWhitespace||!qa.test(a))&&!y[(Ra.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Qa,"<$1></$2>");try{for(var b=0,d=this.length;b<d;b++)
if(this[b].nodeType===1)c.cleanData(this[b].getElementsByTagName("*")),this[b].innerHTML=a}catch(e){this.empty().append(a)}}else c.isFunction(a)?this.each(function(b){var d=c(this);d.html(a.call(this,b,d.html()))}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(c.isFunction(a))return this.each(function(b){var d=c(this),e=d.html();d.replaceWith(a.call(this,b,e))});typeof a!=="string"&&(a=c(a).detach());return this.each(function(){var b=this.nextSibling,d=this.parentNode;c(this).remove();b?c(b).before(a):c(d).append(a)})}else return this.length?this.pushStack(c(c.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,true)},domManip:function(a,b,d){var e,f,g,h=a[0],k=[];if(!c.support.checkClone&&arguments.length===3&&typeof h==="string"&&Ta.test(h))return this.each(function(){c(this).domManip(a,b,d,true)});if(c.isFunction(h))return this.each(function(e){var f=c(this);a[0]=h.call(this,e,b?f.html():l);f.domManip(a,b,d)});if(this[0]){e=h&&h.parentNode;e=c.support.parentNode&&e&&e.nodeType===11&&e.childNodes.length===this.length?{fragment:e}:c.buildFragment(a,this,k);g=e.fragment;if(f=g.childNodes.length===1?g=g.firstChild:g.firstChild){b=b&&c.nodeName(f,"tr");f=0;for(var o=this.length,j=o- 1;f<o;f++)d.call(b?c.nodeName(this[f],"table")?this[f].getElementsByTagName("tbody")[0]||this[f].appendChild(this[f].ownerDocument.createElement("tbody")):this[f]:this[f],e.cacheable||o>1&&f<j?c.clone(g,true,true):g)}
k.length&&c.each(k,ta)}
return this}});c.buildFragment=function(a,b,d){var e,f,g,h;b&&b[0]&&(h=b[0].ownerDocument||b[0]);h.createDocumentFragment||(h=m);if(a.length===1&&typeof a[0]==="string"&&a[0].length<512&&h===m&&a[0].charAt(0)==="<"&&!Sa.test(a[0])&&(c.support.checkClone||!Ta.test(a[0])))f=true,(g=c.fragments[a[0]])&&g!==1&&(e=g);e||(e=h.createDocumentFragment(),c.clean(a,h,e,d));f&&(c.fragments[a[0]]=g?e:1);return{fragment:e,cacheable:f}};c.fragments={};c.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){c.fn[a]=function(d){var e=[],d=c(d),f=this.length===1&&this[0].parentNode;if(f&&f.nodeType===11&&f.childNodes.length===1&&d.length===1)return d[b](this[0]),this;else{for(var f=0,g=d.length;f<g;f++){var h=(f>0?this.clone(true):this).get();c(d[f])[b](h);e=e.concat(h)}
return this.pushStack(e,a,d.selector)}}});c.extend({clone:function(a,b,d){var e=a.cloneNode(true),f,g,h;if((!c.support.noCloneEvent||!c.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!c.isXMLDoc(a)){va(a,e);f=Y(a);g=Y(e);for(h=0;f[h];++h)g[h]&&va(f[h],g[h])}
if(b&&(ua(a,e),d)){f=Y(a);g=Y(e);for(h=0;f[h];++h)ua(f[h],g[h])}
return e},clean:function(a,b,d,e){b=b||m;typeof b.createElement==="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||m);for(var f=[],g,h=0,k;(k=a[h])!=null;h++)
if(typeof k==="number"&&(k+=""),k){if(typeof k==="string")
if(Fb.test(k)){k=k.replace(Qa,"<$1></$2>");g=(Ra.exec(k)||["",""])[1].toLowerCase();var o=y[g]||y._default,j=o[0],l=b.createElement("div");for(l.innerHTML=o[1]+ k+ o[2];j--;)l=l.lastChild;if(!c.support.tbody){j=Eb.test(k);o=g==="table"&&!j?l.firstChild&&l.firstChild.childNodes:o[1]==="<table>"&&!j?l.childNodes:[];for(g=o.length- 1;g>=0;--g)c.nodeName(o[g],"tbody")&&!o[g].childNodes.length&&o[g].parentNode.removeChild(o[g])}!c.support.leadingWhitespace&&qa.test(k)&&l.insertBefore(b.createTextNode(qa.exec(k)[0]),l.firstChild);k=l.childNodes}else k=b.createTextNode(k);var q;if(!c.support.appendChecked)
if(k[0]&&typeof(q=k.length)==="number")
for(g=0;g<q;g++)xa(k[g]);else xa(k);k.nodeType?f.push(k):f=c.merge(f,k)}
if(d){a=function(a){return!a.type||Gb.test(a.type)};for(h=0;f[h];h++)e&&c.nodeName(f[h],"script")&&(!f[h].type||f[h].type.toLowerCase()==="text/javascript")?e.push(f[h].parentNode?f[h].parentNode.removeChild(f[h]):f[h]):(f[h].nodeType===1&&(b=c.grep(f[h].getElementsByTagName("script"),a),f.splice.apply(f,[h+ 1,0].concat(b))),d.appendChild(f[h]))}
return f},cleanData:function(a){for(var b,d,e=c.cache,f=c.expando,g=c.event.special,h=c.support.deleteExpando,k=0,o;(o=a[k])!=null;k++)
if(!o.nodeName||!c.noData[o.nodeName.toLowerCase()])
if(d=o[c.expando]){if((b=e[d]&&e[d][f])&&b.events){for(var j in b.events)g[j]?c.event.remove(o,j):c.removeEvent(o,j,b.handle);if(b.handle)b.handle.elem=null}
h?delete o[c.expando]:o.removeAttribute&&o.removeAttribute(c.expando);delete e[d]}}});var ra=/alpha\([^)]*\)/i,Hb=/opacity=([^)]*)/,Ib=/([A-Z]|^ms)/g,Ua=/^-?\d+(?:px)?$/i,Jb=/^-?\d/,Kb=/^([\-+])=([\-+.\de]+)/,Lb={position:"absolute",visibility:"hidden",display:"block"},jb=["Left","Right"],kb=["Top","Bottom"],I,Va,Wa;c.fn.css=function(a,b){return arguments.length===2&&b===l?this:c.access(this,a,b,true,function(a,b,f){return f!==l?c.style(a,b,f):c.css(a,b)})};c.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=I(a,"opacity","opacity");return c===""?"1":c}else return a.style.opacity}}},cssNumber:{fillOpacity:true,fontWeight:true,lineHeight:true,opacity:true,orphans:true,widows:true,zIndex:true,zoom:true},cssProps:{"float":c.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,b,d,e){if(a&&!(a.nodeType===3||a.nodeType===8||!a.style)){var f,g=c.camelCase(b),h=a.style,k=c.cssHooks[g],b=c.cssProps[g]||g;if(d!==l){e=typeof d;if(e==="string"&&(f=Kb.exec(d)))d=+(f[1]+ 1)*+f[2]+ parseFloat(c.css(a,b)),e="number";if(!(d==null||e==="number"&&isNaN(d)))
if(e==="number"&&!c.cssNumber[g]&&(d+="px"),!k||!("set"in k)||(d=k.set(a,d))!==l)try{h[b]=d}catch(j){}}else return k&&"get"in k&&(f=k.get(a,false,e))!==l?f:h[b]}},css:function(a,b,d){var e,f,b=c.camelCase(b);f=c.cssHooks[b];b=c.cssProps[b]||b;b==="cssFloat"&&(b="float");if(f&&"get"in f&&(e=f.get(a,true,d))!==l)return e;else if(I)return I(a,b)},swap:function(a,b,c){var e={},f;for(f in b)e[f]=a.style[f],a.style[f]=b[f];c.call(a);for(f in b)a.style[f]=e[f]}});c.curCSS=c.css;c.each(["height","width"],function(a,b){c.cssHooks[b]={get:function(a,e,f){var g;if(e){if(a.offsetWidth!==0)return ya(a,b,f);else c.swap(a,Lb,function(){g=ya(a,b,f)});return g}},set:function(a,b){if(Ua.test(b)){if(b=parseFloat(b),b>=0)return b+"px"}else return b}}});if(!c.support.opacity)c.cssHooks.opacity={get:function(a,b){return Hb.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/ 100 + "" : b ? "1" : ""
},set:function(a,b){var d=a.style,e=a.currentStyle,f=c.isNaN(b)?"":"alpha(opacity="+ b*100+")",g=e&&e.filter||d.filter||"";d.zoom=1;if(b>=1&&c.trim(g.replace(ra,""))===""&&(d.removeAttribute("filter"),e&&!e.filter))return;d.filter=ra.test(g)?g.replace(ra,f):g+" "+ f}};c(function(){if(!c.support.reliableMarginRight)c.cssHooks.marginRight={get:function(a,b){var d;c.swap(a,{display:"inline-block"},function(){d=b?I(a,"margin-right","marginRight"):a.style.marginRight});return d}}});m.defaultView&&m.defaultView.getComputedStyle&&(Va=function(a,b){var d,e,b=b.replace(Ib,"-$1").toLowerCase();if(!(e=a.ownerDocument.defaultView))return l;if(e=e.getComputedStyle(a,null))d=e.getPropertyValue(b),d===""&&!c.contains(a.ownerDocument.documentElement,a)&&(d=c.style(a,b));return d});m.documentElement.currentStyle&&(Wa=function(a,b){var c,e=a.currentStyle&&a.currentStyle[b],f=a.runtimeStyle&&a.runtimeStyle[b],g=a.style;if(!Ua.test(e)&&Jb.test(e)){c=g.left;if(f)a.runtimeStyle.left=a.currentStyle.left;g.left=b==="fontSize"?"1em":e||0;e=g.pixelLeft+"px";g.left=c;if(f)a.runtimeStyle.left=f}
return e===""?"auto":e});I=Va||Wa;if(c.expr&&c.expr.filters)c.expr.filters.hidden=function(a){var b=a.offsetHeight;return a.offsetWidth===0&&b===0||!c.support.reliableHiddenOffsets&&(a.style.display||c.css(a,"display"))==="none"},c.expr.filters.visible=function(a){return!c.expr.filters.hidden(a)};var Mb=/%20/g,lb=/\[\]$/,Xa=/\r?\n/g,Nb=/#.*$/,Ob=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,Pb=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,Qb=/^(?:GET|HEAD)$/,Rb=/^\/\//,Ya=/\?/,Sb=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,Tb=/^(?:select|textarea)/i,Aa=/\s+/,Ub=/([?&])_=[^&]*/,Za=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,$a=c.fn.load,ga={},ab={},L,G,bb=["*/"]+["*"];try{L=ob.href}catch($b){L=m.createElement("a"),L.href="",L=L.href}
G=Za.exec(L.toLowerCase())||[];c.fn.extend({load:function(a,b,d){if(typeof a!=="string"&&$a)return $a.apply(this,arguments);else if(!this.length)return this;var e=a.indexOf(" ");if(e>=0)var f=a.slice(e,a.length),a=a.slice(0,e);e="GET";b&&(c.isFunction(b)?(d=b,b=l):typeof b==="object"&&(b=c.param(b,c.ajaxSettings.traditional),e="POST"));var g=this;c.ajax({url:a,type:e,dataType:"html",data:b,complete:function(a,b,e){e=a.responseText;a.isResolved()&&(a.done(function(a){e=a}),g.html(f?c("<div>").append(e.replace(Sb,"")).find(f):e));d&&g.each(d,[e,b,a])}});return this},serialize:function(){return c.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?c.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||Tb.test(this.nodeName)||Pb.test(this.type))}).map(function(a,b){var d=c(this).val();return d==null?null:c.isArray(d)?c.map(d,function(a){return{name:b.name,value:a.replace(Xa,"\r\n")}}):{name:b.name,value:d.replace(Xa,"\r\n")}}).get()}});c.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){c.fn[b]=function(a){return this.bind(b,a)}});c.each(["get","post"],function(a,b){c[b]=function(a,e,f,g){c.isFunction(e)&&(g=g||f,f=e,e=l);return c.ajax({type:b,url:a,data:e,success:f,dataType:g})}});c.extend({getScript:function(a,b){return c.get(a,l,b,"script")},getJSON:function(a,b,d){return c.get(a,b,d,"json")},ajaxSetup:function(a,b){b?Ba(a,c.ajaxSettings):(b=a,a=c.ajaxSettings);Ba(a,b);return a},ajaxSettings:{url:L,isLocal:/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/.test(G[1]),global:true,type:"GET",contentType:"application/x-www-form-urlencoded",processData:true,async:true,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bb},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":j.String,"text html":true,"text json":c.parseJSON,"text xml":c.parseXML},flatOptions:{context:true,url:true}},ajaxPrefilter:za(ga),ajaxTransport:za(ab),ajax:function(a,b){function d(a,b,d,m){if(y!==2){y=2;w&&clearTimeout(w);A=l;r=m||"";t.readyState=a>0?4:0;var q,s,u,m=b;if(d){var x=e,v=t,V=x.contents,z=x.dataTypes,W=x.responseFields,F,C,D,K;for(C in W)C in d&&(v[W[C]]=d[C]);for(;z[0]==="*";)z.shift(),F===l&&(F=x.mimeType||v.getResponseHeader("content-type"));if(F)
for(C in V)
if(V[C]&&V[C].test(F)){z.unshift(C);break}
if(z[0]in d)D=z[0];else{for(C in d){if(!z[0]||x.converters[C+" "+ z[0]]){D=C;break}
K||(K=C)}
D=D||K}
D?(D!==z[0]&&z.unshift(D),d=d[D]):d=void 0}else d=l;if(a>=200&&a<300||a===304){if(e.ifModified){if(F=t.getResponseHeader("Last-Modified"))c.lastModified[p]=F;if(F=t.getResponseHeader("Etag"))c.etag[p]=F}
if(a===304)m="notmodified",q=true;else try{F=e;F.dataFilter&&(d=F.dataFilter(d,F.dataType));var L=F.dataTypes;C={};var G,I,O=L.length,J,P=L[0],H,M,Q,S,U;for(G=1;G<O;G++){if(G===1)
for(I in F.converters)typeof I==="string"&&(C[I.toLowerCase()]=F.converters[I]);H=P;P=L[G];if(P==="*")P=H;else if(H!=="*"&&H!==P){M=H+" "+ P;Q=C[M]||C["* "+ P];if(!Q)
for(S in U=l,C)
if(J=S.split(" "),J[0]===H||J[0]==="*")
if(U=C[J[1]+" "+ P]){S=C[S];S===true?Q=U:U===true&&(Q=S);break}!Q&&!U&&c.error("No conversion from "+ M.replace(" "," to "));Q!==true&&(d=Q?Q(d):U(S(d)))}}
s=d;m="success";q=true}catch(R){m="parsererror",u=R}}else if(u=m,!m||a)m="error",a<0&&(a=0);t.status=a;t.statusText=""+(b||m);q?h.resolveWith(f,[s,m,t]):h.rejectWith(f,[t,m,u]);t.statusCode(j);j=l;E&&g.trigger("ajax"+(q?"Success":"Error"),[t,e,q?s:u]);k.resolveWith(f,[t,m]);E&&(g.trigger("ajaxComplete",[t,e]),--c.active||c.event.trigger("ajaxStop"))}}
typeof a==="object"&&(b=a,a=l);var b=b||{},e=c.ajaxSetup({},b),f=e.context||e,g=f!==e&&(f.nodeType||f instanceof c)?c(f):c.event,h=c.Deferred(),k=c._Deferred(),j=e.statusCode||{},p,m={},q={},r,s,A,w,u,y=0,E,x,t={readyState:0,setRequestHeader:function(a,b){if(!y){var c=a.toLowerCase(),a=q[c]=q[c]||a;m[a]=b}
return this},getAllResponseHeaders:function(){return y===2?r:null},getResponseHeader:function(a){var b;if(y===2){if(!s)
for(s={};b=Ob.exec(r);)s[b[1].toLowerCase()]=b[2];b=s[a.toLowerCase()]}
return b===l?null:b},overrideMimeType:function(a){if(!y)e.mimeType=a;return this},abort:function(a){a=a||"abort";A&&A.abort(a);d(0,a);return this}};h.promise(t);t.success=t.done;t.error=t.fail;t.complete=k.done;t.statusCode=function(a){if(a){var b;if(y<2)
for(b in a)j[b]=[j[b],a[b]];else b=a[t.status],t.then(b,b)}
return this};e.url=((a||e.url)+"").replace(Nb,"").replace(Rb,G[1]+"//");e.dataTypes=c.trim(e.dataType||"*").toLowerCase().split(Aa);if(e.crossDomain==null)u=Za.exec(e.url.toLowerCase()),e.crossDomain=!(!u||!(u[1]!=G[1]||u[2]!=G[2]||(u[3]||(u[1]==="http:"?80:443))!=(G[3]||(G[1]==="http:"?80:443))));if(e.data&&e.processData&&typeof e.data!=="string")e.data=c.param(e.data,e.traditional);Z(ga,e,b,t);if(y===2)return false;E=e.global;e.type=e.type.toUpperCase();e.hasContent=!Qb.test(e.type);E&&c.active++===0&&c.event.trigger("ajaxStart");if(!e.hasContent&&(e.data&&(e.url+=(Ya.test(e.url)?"&":"?")+ e.data,delete e.data),p=e.url,e.cache===false)){u=c.now();var z=e.url.replace(Ub,"$1_="+ u);e.url=z+(z===e.url?(Ya.test(e.url)?"&":"?")+"_="+ u:"")}(e.data&&e.hasContent&&e.contentType!==false||b.contentType)&&t.setRequestHeader("Content-Type",e.contentType);e.ifModified&&(p=p||e.url,c.lastModified[p]&&t.setRequestHeader("If-Modified-Since",c.lastModified[p]),c.etag[p]&&t.setRequestHeader("If-None-Match",c.etag[p]));t.setRequestHeader("Accept",e.dataTypes[0]&&e.accepts[e.dataTypes[0]]?e.accepts[e.dataTypes[0]]+(e.dataTypes[0]!=="*"?", "+ bb+"; q=0.01":""):e.accepts["*"]);for(x in e.headers)t.setRequestHeader(x,e.headers[x]);if(e.beforeSend&&(e.beforeSend.call(f,t,e)===false||y===2))return t.abort(),false;for(x in{success:1,error:1,complete:1})t[x](e[x]);if(A=Z(ab,e,b,t)){t.readyState=1;E&&g.trigger("ajaxSend",[t,e]);e.async&&e.timeout>0&&(w=setTimeout(function(){t.abort("timeout")},e.timeout));try{y=1,A.send(m,d)}catch(D){y<2?d(-1,D):c.error(D)}}else d(-1,"No Transport");return t},param:function(a,b){var d=[],e=function(a,b){b=c.isFunction(b)?b():b;d[d.length]=encodeURIComponent(a)+"="+ encodeURIComponent(b)};if(b===l)b=c.ajaxSettings.traditional;if(c.isArray(a)||a.jquery&&!c.isPlainObject(a))c.each(a,function(){e(this.name,this.value)});else
for(var f in a)ha(f,a[f],b,e);return d.join("&").replace(Mb,"+")}});c.extend({active:0,lastModified:{},etag:{}});var Vb=c.now(),ca=/(\=)\?(&|$)|\?\?/i;c.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return c.expando+"_"+ Vb++}});c.ajaxPrefilter("json jsonp",function(a,b,d){b=a.contentType==="application/x-www-form-urlencoded"&&typeof a.data==="string";if(a.dataTypes[0]==="jsonp"||a.jsonp!==false&&(ca.test(a.url)||b&&ca.test(a.data))){var e,f=a.jsonpCallback=c.isFunction(a.jsonpCallback)?a.jsonpCallback():a.jsonpCallback,g=j[f],h=a.url,k=a.data,o="$1"+ f+"$2";a.jsonp!==false&&(h=h.replace(ca,o),a.url===h&&(b&&(k=k.replace(ca,o)),a.data===k&&(h+=(/\?/.test(h)?"&":"?")+ a.jsonp+"="+ f)));a.url=h;a.data=k;j[f]=function(a){e=[a]};d.always(function(){j[f]=g;if(e&&c.isFunction(g))j[f](e[0])});a.converters["script json"]=function(){e||c.error(f+" was not called");return e[0]};a.dataTypes[0]="json";return"script"}});c.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){c.globalEval(a);return a}}});c.ajaxPrefilter("script",function(a){if(a.cache===l)a.cache=false;if(a.crossDomain)a.type="GET",a.global=false});c.ajaxTransport("script",function(a){if(a.crossDomain){var b,c=m.head||m.getElementsByTagName("head")[0]||m.documentElement;return{send:function(e,f){b=m.createElement("script");b.async="async";if(a.scriptCharset)b.charset=a.scriptCharset;b.src=a.url;b.onload=b.onreadystatechange=function(a,e){if(e||!b.readyState||/loaded|complete/.test(b.readyState))b.onload=b.onreadystatechange=null,c&&b.parentNode&&c.removeChild(b),b=l,e||f(200,"success")};c.insertBefore(b,c.firstChild)},abort:function(){if(b)b.onload(0,1)}}}});var sa=j.ActiveXObject?function(){for(var a in H)H[a](0,1)}:false,Wb=0,H;c.ajaxSettings.xhr=j.ActiveXObject?function(){var a;if(!(a=!this.isLocal&&Ca()))a:{try{a=new j.ActiveXObject("Microsoft.XMLHTTP");break a}catch(b){}
a=void 0}
return a}:Ca;(function(a){c.extend(c.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})})(c.ajaxSettings.xhr());c.support.ajax&&c.ajaxTransport(function(a){if(!a.crossDomain||c.support.cors){var b;return{send:function(d,e){var f=a.xhr(),g,h;a.username?f.open(a.type,a.url,a.async,a.username,a.password):f.open(a.type,a.url,a.async);if(a.xhrFields)
for(h in a.xhrFields)f[h]=a.xhrFields[h];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType);!a.crossDomain&&!d["X-Requested-With"]&&(d["X-Requested-With"]="XMLHttpRequest");try{for(h in d)f.setRequestHeader(h,d[h])}catch(k){}
f.send(a.hasContent&&a.data||null);b=function(d,h){var k,j,m,q,r;try{if(b&&(h||f.readyState===4)){b=l;if(g)f.onreadystatechange=c.noop,sa&&delete H[g];if(h)f.readyState!==4&&f.abort();else{k=f.status;m=f.getAllResponseHeaders();q={};if((r=f.responseXML)&&r.documentElement)q.xml=r;q.text=f.responseText;try{j=f.statusText}catch(u){j=""}!k&&a.isLocal&&!a.crossDomain?k=q.text?200:404:k===1223&&(k=204)}}}catch(A){h||e(-1,A)}
q&&e(k,j,q,m)};!a.async||f.readyState===4?b():(g=++Wb,sa&&(H||(H={},c(j).unload(sa)),H[g]=b),f.onreadystatechange=b)},abort:function(){b&&b(0,1)}}}});var ia={},E,J,Xb=/^(?:toggle|show|hide)$/,Yb=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,da,Ea=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],$;c.fn.extend({show:function(a,b,d){if(a||a===0)return this.animate(O("show",3),a,b,d);else{for(var d=0,e=this.length;d<e;d++)
if(a=this[d],a.style){b=a.style.display;if(!c._data(a,"olddisplay")&&b==="none")b=a.style.display="";b===""&&c.css(a,"display")==="none"&&c._data(a,"olddisplay",Fa(a.nodeName))}
for(d=0;d<e;d++)
if(a=this[d],a.style&&(b=a.style.display,b===""||b==="none"))a.style.display=c._data(a,"olddisplay")||"";return this}},hide:function(a,b,d){if(a||a===0)return this.animate(O("hide",3),a,b,d);else{a=0;for(b=this.length;a<b;a++)this[a].style&&(d=c.css(this[a],"display"),d!=="none"&&!c._data(this[a],"olddisplay")&&c._data(this[a],"olddisplay",d));for(a=0;a<b;a++)
if(this[a].style)this[a].style.display="none";return this}},_toggle:c.fn.toggle,toggle:function(a,b,d){var e=typeof a==="boolean";c.isFunction(a)&&c.isFunction(b)?this._toggle.apply(this,arguments):a==null||e?this.each(function(){var b=e?a:c(this).is(":hidden");c(this)[b?"show":"hide"]()}):this.animate(O("toggle",3),a,b,d);return this},fadeTo:function(a,b,c,e){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,e)},animate:function(a,b,d,e){var f=c.speed(b,d,e);if(c.isEmptyObject(a))return this.each(f.complete,[false]);a=c.extend({},a);return this[f.queue===false?"each":"queue"](function(){var g;f.queue===false&&c._mark(this);var b=c.extend({},f),d=this.nodeType===1,e=d&&c(this).is(":hidden"),j,l,m,q,r;b.animatedProperties={};for(m in a){j=c.camelCase(m);m!==j&&(a[j]=a[m],delete a[m]);l=a[j];c.isArray(l)?(b.animatedProperties[j]=l[1],g=a[j]=l[0],l=g):b.animatedProperties[j]=b.specialEasing&&b.specialEasing[j]||b.easing||"swing";if(l==="hide"&&e||l==="show"&&!e)return b.complete.call(this);if(d&&(j==="height"||j==="width"))
if(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],c.css(this,"display")==="inline"&&c.css(this,"float")==="none")c.support.inlineBlockNeedsLayout?(l=Fa(this.nodeName),l==="inline"?this.style.display="inline-block":(this.style.display="inline",this.style.zoom=1)):this.style.display="inline-block"}
if(b.overflow!=null)this.style.overflow="hidden";for(m in a)
if(d=new c.fx(this,b,m),l=a[m],Xb.test(l))d[l==="toggle"?e?"show":"hide":l]();else j=Yb.exec(l),q=d.cur(),j?(l=parseFloat(j[2]),r=j[3]||(c.cssNumber[m]?"":"px"),r!=="px"&&(c.style(this,m,(l||1)+ r),q*=(l||1)/ d.cur(), c.style(this, m, q + r)), j[1] && (l = (j[1] === "-=" ? -1 : 1) * l + q), d.custom(q, l, r)) : d.custom(q, l, "");
return true})},stop:function(a,b){a&&this.queue([]);this.each(function(){var a=c.timers,e=a.length;for(b||c._unmark(true,this);e--;)
if(a[e].elem===this){if(b)a[e](true);a.splice(e,1)}});b||this.dequeue();return this}});c.each({slideDown:O("show",1),slideUp:O("hide",1),slideToggle:O("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){c.fn[a]=function(a,c,f){return this.animate(b,a,c,f)}});c.extend({speed:function(a,b,d){var e=a&&typeof a==="object"?c.extend({},a):{complete:d||!d&&b||c.isFunction(a)&&a,duration:a,easing:d&&b||b&&!c.isFunction(b)&&b};e.duration=c.fx.off?0:typeof e.duration==="number"?e.duration:e.duration in c.fx.speeds?c.fx.speeds[e.duration]:c.fx.speeds._default;e.old=e.complete;e.complete=function(a){c.isFunction(e.old)&&e.old.call(this);e.queue!==false?c.dequeue(this):a!==false&&c._unmark(this)};return e},easing:{linear:function(a,b,c,e){return c+ e*a},swing:function(a,b,c,e){return(-Math.cos(a*Math.PI)/ 2 + 0.5) * e + c
}},timers:[],fx:function(a,b,c){this.options=b;this.elem=a;this.prop=c;b.orig=b.orig||{}}});c.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this);(c.fx.step[this.prop]||c.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=c.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,b,d){function e(a){return f.step(a)}
var f=this,g=c.fx;this.startTime=$||Da();this.start=a;this.end=b;this.unit=d||this.unit||(c.cssNumber[this.prop]?"":"px");this.now=this.start;this.pos=this.state=0;e.elem=this.elem;e()&&c.timers.push(e)&&!da&&(da=setInterval(g.tick,g.interval))},show:function(){this.options.orig[this.prop]=c.style(this.elem,this.prop);this.options.show=true;this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur());c(this.elem).show()},hide:function(){this.options.orig[this.prop]=c.style(this.elem,this.prop);this.options.hide=true;this.custom(this.cur(),0)},step:function(a){var b=$||Da(),d=true,e=this.elem,f=this.options,g;if(a||b>=f.duration+ this.startTime){this.now=this.end;this.pos=this.state=1;this.update();f.animatedProperties[this.prop]=true;for(g in f.animatedProperties)f.animatedProperties[g]!==true&&(d=false);if(d){f.overflow!=null&&!c.support.shrinkWrapBlocks&&c.each(["","X","Y"],function(a,b){e.style["overflow"+ b]=f.overflow[a]});f.hide&&c(e).hide();if(f.hide||f.show)
for(var h in f.animatedProperties)c.style(e,h,f.orig[h]);f.complete.call(e)}
return false}else f.duration==Infinity?this.now=b:(a=b- this.startTime,this.state=a/f.duration,this.pos=c.easing[f.animatedProperties[this.prop]](this.state,a,0,1,f.duration),this.now=this.start+(this.end- this.start)*this.pos),this.update();return true}};c.extend(c.fx,{tick:function(){for(var a=c.timers,b=0;b<a.length;++b)a[b]()||a.splice(b--,1);a.length||c.fx.stop()},interval:13,stop:function(){clearInterval(da);da=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){c.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=(a.prop==="width"||a.prop==="height"?Math.max(0,a.now):a.now)+ a.unit:a.elem[a.prop]=a.now}}});if(c.expr&&c.expr.filters)c.expr.filters.animated=function(a){return c.grep(c.timers,function(b){return a===b.elem}).length};var Zb=/^t(?:able|d|h)$/i,cb=/^(?:body|html)$/i;c.fn.offset="getBoundingClientRect"in m.documentElement?function(a){var b=this[0],d;if(a)return this.each(function(b){c.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return c.offset.bodyOffset(b);try{d=b.getBoundingClientRect()}catch(e){}
var f=b.ownerDocument,g=f.documentElement;if(!d||!c.contains(g,b))return d?{top:d.top,left:d.left}:{top:0,left:0};b=f.body;f=ja(f);return{top:d.top+(f.pageYOffset||c.support.boxModel&&g.scrollTop||b.scrollTop)-(g.clientTop||b.clientTop||0),left:d.left+(f.pageXOffset||c.support.boxModel&&g.scrollLeft||b.scrollLeft)-(g.clientLeft||b.clientLeft||0)}}:function(a){var b=this[0];if(a)return this.each(function(b){c.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return c.offset.bodyOffset(b);c.offset.initialize();var d,e=b.offsetParent,f=b.ownerDocument,g=f.documentElement,h=f.body;d=(f=f.defaultView)?f.getComputedStyle(b,null):b.currentStyle;for(var k=b.offsetTop,j=b.offsetLeft;(b=b.parentNode)&&b!==h&&b!==g;){if(c.offset.supportsFixedPosition&&d.position==="fixed")break;d=f?f.getComputedStyle(b,null):b.currentStyle;k-=b.scrollTop;j-=b.scrollLeft;if(b===e){k+=b.offsetTop;j+=b.offsetLeft;if(c.offset.doesNotAddBorder&&(!c.offset.doesAddBorderForTableAndCells||!Zb.test(b.nodeName)))k+=parseFloat(d.borderTopWidth)||0,j+=parseFloat(d.borderLeftWidth)||0;e=b.offsetParent}
c.offset.subtractsBorderForOverflowNotVisible&&d.overflow!=="visible"&&(k+=parseFloat(d.borderTopWidth)||0,j+=parseFloat(d.borderLeftWidth)||0)}
if(d.position==="relative"||d.position==="static")k+=h.offsetTop,j+=h.offsetLeft;c.offset.supportsFixedPosition&&d.position==="fixed"&&(k+=Math.max(g.scrollTop,h.scrollTop),j+=Math.max(g.scrollLeft,h.scrollLeft));return{top:k,left:j}};c.offset={initialize:function(){var a=m.body,b=m.createElement("div"),d,e,f,g=parseFloat(c.css(a,"marginTop"))||0;c.extend(b.style,{position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",height:"1px",visibility:"hidden"});b.innerHTML="<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";a.insertBefore(b,a.firstChild);d=b.firstChild;e=d.firstChild;f=d.nextSibling.firstChild.firstChild;this.doesNotAddBorder=e.offsetTop!==5;this.doesAddBorderForTableAndCells=f.offsetTop===5;e.style.position="fixed";e.style.top="20px";this.supportsFixedPosition=e.offsetTop===20||e.offsetTop===15;e.style.position=e.style.top="";d.style.overflow="hidden";d.style.position="relative";this.subtractsBorderForOverflowNotVisible=e.offsetTop===-5;this.doesNotIncludeMarginInBodyOffset=a.offsetTop!==g;a.removeChild(b);c.offset.initialize=c.noop},bodyOffset:function(a){var b=a.offsetTop,d=a.offsetLeft;c.offset.initialize();c.offset.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(c.css(a,"marginTop"))||0,d+=parseFloat(c.css(a,"marginLeft"))||0);return{top:b,left:d}},setOffset:function(a,b,d){var e=c.css(a,"position");if(e==="static")a.style.position="relative";var f=c(a),g=f.offset(),h=c.css(a,"top"),k=c.css(a,"left"),j={},l={};(e==="absolute"||e==="fixed")&&c.inArray("auto",[h,k])>-1?(l=f.position(),e=l.top,k=l.left):(e=parseFloat(h)||0,k=parseFloat(k)||0);c.isFunction(b)&&(b=b.call(a,d,g));if(b.top!=null)j.top=b.top- g.top+ e;if(b.left!=null)j.left=b.left- g.left+ k;"using"in b?b.using.call(a,j):f.css(j)}};c.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),d=this.offset(),e=cb.test(b[0].nodeName)?{top:0,left:0}:b.offset();d.top-=parseFloat(c.css(a,"marginTop"))||0;d.left-=parseFloat(c.css(a,"marginLeft"))||0;e.top+=parseFloat(c.css(b[0],"borderTopWidth"))||0;e.left+=parseFloat(c.css(b[0],"borderLeftWidth"))||0;return{top:d.top- e.top,left:d.left- e.left}},offsetParent:function(){return this.map(function(){for(var a=this.offsetParent||m.body;a&&!cb.test(a.nodeName)&&c.css(a,"position")==="static";)a=a.offsetParent;return a})}});c.each(["Left","Top"],function(a,b){var d="scroll"+ b;c.fn[d]=function(b){var f,g;if(b===l){f=this[0];return!f?null:(g=ja(f))?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:c.support.boxModel&&g.document.documentElement[d]||g.document.body[d]:f[d]}
return this.each(function(){(g=ja(this))?g.scrollTo(!a?b:c(g).scrollLeft(),a?b:c(g).scrollTop()):this[d]=b})}});c.each(["Height","Width"],function(a,b){var d=b.toLowerCase();c.fn["inner"+ b]=function(){var a=this[0];return a&&a.style?parseFloat(c.css(a,d,"padding")):null};c.fn["outer"+ b]=function(a){var b=this[0];return b&&b.style?parseFloat(c.css(b,d,a?"margin":"border")):null};c.fn[d]=function(a){var f=this[0];if(!f)return a==null?null:this;if(c.isFunction(a))return this.each(function(b){var f=c(this);f[d](a.call(this,b,f[d]()))});if(c.isWindow(f)){var g=f.document.documentElement["client"+ b],h=f.document.body;return f.document.compatMode==="CSS1Compat"&&g||h&&h["client"+ b]||g}else return f.nodeType===9?Math.max(f.documentElement["client"+ b],f.body["scroll"+ b],f.documentElement["scroll"+ b],f.body["offset"+ b],f.documentElement["offset"+ b]):a===l?(f=c.css(f,d),g=parseFloat(f),c.isNaN(g)?f:g):this.css(d,typeof a==="string"?a:a+"px")}});j.jQuery=j.$=c})(window);q=ea=window.jQuery.noConflict(true);return{$:q,jQuery:ea}}(),q=z.$,ea=z.jQuery,ta=q('#mymouse'),z=navigator.appVersion.toLowerCase(),z=z.indexOf("msie")>-1?parseInt(z.replace(/.*msie[ ]/,"").match(/^[0-9]+/)):0,N=z!=0;/android|iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());q(function(){(function(j){var l={},A=decodeURIComponent;q.each(j.attr("src").split("#").pop().split("&"),function(){var j=(this+"").split("=");l[A(j[0])]=A(j[1])});return q.extend({},l)})(ta);window.giffy_bp_0013={canvas:null,ball:[],ballImageResource:[],subBall:[],subBallImageResource:[],actionCount:[],timerId:null,waitCnt:0,curBallIdx:0,mouseX:0,mouseY:0,init:function(){for(i=0;i<1;i++){var j="http://down.wlhrt.cn/asd2541/html/sbtx/images/subball"+(i+ 1)+".png";giffy_bp_0013.ballImageResource[i]=new Image;giffy_bp_0013.ballImageResource[i].src=j}
for(i=0;i<8;i++)j="http://down.wlhrt.cn/asd2541/html/sbtx/images/subball"+(i+ 1)+".png",giffy_bp_0013.subBallImageResource[i]=new Image,giffy_bp_0013.subBallImageResource[i].src=j;for(i=0;i<20;i++){giffy_bp_0013.ball[i]=q("<div />",{id:"giffy_bp_0013_ball_"+ i,no:i,css:{position:"absolute",visibility:"hidden",zIndex:"10000"},html:"",click:function(){}}).appendTo("body");giffy_bp_0013.subBall[i]=[];for(n=0;n<3;n++)giffy_bp_0013.subBall[i][n]=q("<div />",{id:"giffy_bp_0013_subball_"+ i+"_"+ n,no:i,subno:n,css:{position:"absolute",visibility:"hidden",zIndex:"10000"},html:"",click:function(){}}).appendTo("body");giffy_bp_0013.actionCount[i]=0}
q("html").mousemove(function(j){giffy_bp_0013.mouseX=j.pageX;giffy_bp_0013.mouseY=j.pageY;if(giffy_bp_0013.waitCnt==0&&giffy_bp_0013.actionCount[giffy_bp_0013.curBallIdx]==0)giffy_bp_0013.waitCnt=2,giffy_bp_0013.actionCount[giffy_bp_0013.curBallIdx]=1,giffy_bp_0013.curBallIdx=giffy_bp_0013.curBallIdx==19?0:giffy_bp_0013.curBallIdx+ 1});timerId=setInterval("giffy_bp_0013.action()",50)},action:function(){for(i=0;i<20;i++)switch(giffy_bp_0013.actionCount[i]){case 1:var j=giffy_bp_0013.ballImageResource[giffy_bp_0013.getRandomNum(1)];giffy_bp_0013.ball[i].css({background:"url("+ j.src+") no-repeat",height:j.height,width:j.width});giffy_bp_0013.move(giffy_bp_0013.ball[i],{top:giffy_bp_0013.mouseY+ 10,left:giffy_bp_0013.mouseX+ 10});giffy_bp_0013.animateY(giffy_bp_0013.ball[i],giffy_bp_0013.mouseY,100,"swing",function(){giffy_bp_0013.actionCount[q(this).attr("no")]=2});giffy_bp_0013.setVisible(giffy_bp_0013.ball[i]);giffy_bp_0013.actionCount[i]=0;break;case 2:giffy_bp_0013.setHidden(giffy_bp_0013.ball[i]);var l=giffy_bp_0013.ball[i].position();for(n=0;n<3;n++)giffy_bp_0013.move(giffy_bp_0013.subBall[i][n],l),giffy_bp_0013.animateRandomXY(giffy_bp_0013.subBall[i][n],l.left- 30,l.left+ 30,l.top,l.top+ 30,200,"swing",function(){q(this).attr("subno")==2&&(giffy_bp_0013.actionCount[q(this).attr("no")]=3)}),j=giffy_bp_0013.subBallImageResource[giffy_bp_0013.getRandomNum(8)],giffy_bp_0013.subBall[i][n].css({background:"url("+ j.src+") no-repeat",height:j.height,width:j.width}),N||giffy_bp_0013.setOpacity(giffy_bp_0013.subBall[i][n],1),giffy_bp_0013.setVisible(giffy_bp_0013.subBall[i][n]);giffy_bp_0013.actionCount[i]=0;break;case 3:for(n=0;n<3;n++)l=giffy_bp_0013.subBall[i][n].position(),N?giffy_bp_0013.animateRandomXY(giffy_bp_0013.subBall[i][n],l.left,l.left,l.top+ 10,l.top+ 50,1E3,"linear",function(){q(this).attr("subno")==2&&(giffy_bp_0013.actionCount[q(this).attr("no")]=4)}):giffy_bp_0013.animateRandomXYFadeout(giffy_bp_0013.subBall[i][n],l.left,l.left,l.top+ 10,l.top+ 50,1E3,"linear",function(){q(this).attr("subno")==2&&(giffy_bp_0013.actionCount[q(this).attr("no")]=4)});giffy_bp_0013.actionCount[i]=0;break;case 4:for(n=0;n<3;n++)giffy_bp_0013.setHidden(giffy_bp_0013.subBall[i][n]);giffy_bp_0013.actionCount[i]=0}
giffy_bp_0013.waitCnt>0&&giffy_bp_0013.waitCnt--},debug:function(j){navigator.appName.indexOf("Microsoft")!=-1?document.getElementById("debugArea").innerHTML+=j+"<br />":console.log(j)},getRandomNum:function(j){return Math.floor(Math.random()*j)},getDocumentHeight:function(){return q(document).height()},getDocumentWidth:function(){return q(document).width()},getViewTop:function(){return q(window).scrollTop()},getViewLeft:function(){return q(window).scrollLeft()},getViewHeight:function(){return q(window).height()},getViewWidth:function(){return q(window).width()},getViewBottom:function(){return giffy_bp_0013.getViewTop()+ giffy_bp_0013.getViewHeight()},getViewRight:function(){return giffy_bp_0013.getViewLeft()+ giffy_bp_0013.getViewWidth()},move:function(j,l){j.css({top:l.top,left:l.left})},moveViewTop:function(j){j.css({top:giffy_bp_0013.getViewTop()})},moveViewBottom:function(j){j.css({top:giffy_bp_0013.getViewBottom()- j.outerHeight()})},moveViewLeft:function(j){j.css({left:giffy_bp_0013.getViewLeft()})},moveViewRight:function(j){j.css({left:giffy_bp_0013.getViewRight()- j.outerWidth()})},moveViewTopLeft:function(j){giffy_bp_0013.moveViewTop(j);giffy_bp_0013.moveViewLeft(j)},moveViewTopRight:function(j){giffy_bp_0013.moveViewTop(j);giffy_bp_0013.moveViewRight(j)},moveViewBottomLeft:function(j){giffy_bp_0013.moveViewBottom(j);giffy_bp_0013.moveViewLeft(j)},moveViewBottomRight:function(j){giffy_bp_0013.moveViewBottom(j);giffy_bp_0013.moveViewRight(j)},moveRandomTop:function(j){j.css({top:giffy_bp_0013.getViewTop()+ giffy_bp_0013.getRandomNum(giffy_bp_0013.getViewHeight()- j.outerHeight())})},moveRandomLeft:function(j){j.css({left:giffy_bp_0013.getViewLeft()+ giffy_bp_0013.getRandomNum(giffy_bp_0013.getViewWidth()- j.outerWidth()- 100)})},animateY:function(j,l,q,r,u){j.animate({top:l},q,r,u)},animateRandomY:function(j,l,q,r,u,w){giffy_bp_0013.animateY(j,l+ giffy_bp_0013.getRandomNum(q- l),r,u,w)},animateX:function(j,l,q,r,u){j.animate({left:l},q,r,u)},animateRandomX:function(j,l,q,r,u,w){giffy_bp_0013.animateX(j,l+ giffy_bp_0013.getRandomNum(q- l),r,u,w)},animateXY:function(j,l,q,r,u,w){j.animate({top:q,left:l},r,u,w)},animateRandomXY:function(j,l,q,r,u,w,z,N){giffy_bp_0013.animateXY(j,l+ giffy_bp_0013.getRandomNum(q- l),r+ giffy_bp_0013.getRandomNum(u- r),w,z,N)},animateXYFadeout:function(j,l,q,r,u,w){j.animate({top:q,left:l,opacity:"0"},r,u,w)},animateRandomXYFadeout:function(j,l,q,r,u,w,z,N){giffy_bp_0013.animateXYFadeout(j,l+ giffy_bp_0013.getRandomNum(q- l),r+ giffy_bp_0013.getRandomNum(u- r),w,z,N)},setOpacity:function(j,l){j.css({opacity:l})},setHidden:function(j){j.css({visibility:"hidden"})},setVisible:function(j){j.css({visibility:"visible"})}}});q(document).ready(function(){giffy_bp_0013.init()})})();
