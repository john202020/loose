"use strict";


(function (factory) {

    var root = this || (0, eval)('this');

    if (typeof define === "function" && define.amd)
        define(["jquery", "rx"], function ($, rx) { return factory.call(root, root, $, rx); });
    else if (typeof module === "object" && module.exports)
        module.exports = factory(root, require("jquery"), require("rx"));
    else
        factory(root, root["jQuery"], root["rx"]);

}(function (root, $, rx) {

    if (!String.prototype.replaceAll) {
        String.prototype.replaceAll = function (search, replacement) {

            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);

        }
    }

    var base = base_worker($);

    var _assure = base._assure;

    _assure._jquery($);

    var _loose_id = 1;

    var previous_loose = root.loose;

    root.loose = looseModule;

    looseModule.noConflict = function () {
        root.loose = previous_loose;
        return looseModule;
    };

    return looseModule;


    function looseModule() {

        var lc = {};

        _loose(lc, typeof arguments[0] === "boolean" ? arguments[0] : true);
        _loose_rx(lc);

        return lc;
    }


    function _notify(lc, args) {

        var eventname = base._equalizeeventname(args[0]);

        var values = args[1];

        _assure._isString(eventname);
        _assure._NonRecommend_eventname(eventname);
        _assure._isNonFunction(values);

        if (lc.__enabled__) {

            values = (values === undefined || values === null) ? {} : values;
            _$trigger(lc, values, eventname);
        }

        function _$trigger(lc, values, eventname) {
            var event = $.Event(eventname);

            var isValue = typeof values === "string" || typeof values === "boolean" || typeof values === "number";
            event.values = isValue ? values : JSON.stringify(values);

            event['token_tracer'] = (event['token_tracer'] || "") + lc.__token__;
            event['token'] = lc.__token__;

            $.event.trigger(event);
        }
    }


    function _listen(lc, params) {

        var eventname = base._equalizeeventname(params.eventname);

        var ob = rx.Observable.fromEvent($(document), eventname);
        ob = ob.filter(event => _shouldlisten(lc, params.func, params.sourceTarget, event));
        ob = ob.map(event => getValues(event));

        return ob;

        function _shouldlisten(lc, isFunc, sourceTarget, event) {

            event = getValues(event);

            return lc.__enabled__ && isMatchDOM(isFunc, sourceTarget, event);

            function isMatchDOM(isFunc, sourceTarget, event) {

                var dom = event.dom;

                return (isFunc === undefined || isFunc === null || isFunc.call(dom, event))
                    && (sourceTarget === undefined || sourceTarget === null || $(dom).is(sourceTarget));
            }
        }


        function getValues(event) {

            var nodeName = event.target.nodeName;

            event.dom = (nodeName === "#document" || nodeName === "HTML" || nodeName === "BODY") ?
                document : event.target;

            event.values = event.values || {};
            try {
                event.values = JSON.parse(event.values || {});
            } catch (e) { }

            return event;
        }

    }


    function _loose(lc, enable) {

        lc.keys = {
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            enter: 13,
            escape: 27
        };

        lc.__token__ = "" + _loose_id++;

        lc.__enabled__ = enable;

        lc.dispose = function () {
            _dispose(lc);
        };

        lc.isEnable = function () {
            return lc.__enabled__;
        };

        lc.enable = function () {
            lc.__enabled__ = true;
        };

        lc.disable = function () {
            lc.__enabled__ = false;
        };


        //eventname is compulsory
        //generate event from document through jquery $.event.trigger
        //loose's 'token' will be attached to the generated event
        //'token_tracer' will be attached to the generated event

        //(eventname, values)
        lc.notify = function () {
            _notify(lc, arguments);
        };
    }


    function _loose_rx(lc) {
        var lc_rx = {

            //(eventname, sourceTarget)
            listen: function () {

                var params = base._getListenParams(lc, arguments);

                params.func = function () {
                    return true;
                };
                base._assureListen(params);

                return _listen(lc, params);
            },


            //react only when event from DOM document
            //(eventname)
            listenDocument: function () {

                var params = base._getListenDocumentParams(lc, arguments);

                params.func = function () {
                    return (this.nodeType === 9);
                };
                base._assureListenDocument(params);

                return _listen(lc, params);
            },


            //react only when event from DOM document
            //(eventname, sourceTarget)
            listenElement: function () {

                var params = base._getListenElementParams(lc, arguments);

                params.func = function () {
                    return (this.nodeType === 1 && this.nodeType !== 9);
                };
                base._assureListenElement(params);

                return _listen(lc, params);

            },


            //react only when token the same
            //(eventname)
            listenSelf: function () {

                var params = base._getListenSelfParams(lc, arguments);

                params.func = function (event) {
                    return isme(event, lc);
                };
                base._assureListenSelf(params);

                return _listen(lc, params);
            },


            //react only when token not the same
            //(eventname)
            listenOthers: function () {

                var params = base._getListenOthersParams(lc, arguments);

                params.func = function (event) {
                    return !isme(event, lc);
                };
                base._assureListenOthers(params);

                return _listen(lc, params);
            }
        };


        extend(lc, lc_rx);


        function extend(target, options) {

            for (var key in options)
                target[key] = options[key];

            return target;
        }
    }


    function _dispose(lc) {
    };


    function isme(event, lc) {
        return event["token"] === lc.__token__;
    }


    function base_worker($) {

        //should include all available document event
        var _nonrecommendNotifyEventNames = _getNonRecommendNotifyEventNames();

        //event targeting to document is total wrong because all event will be triggered from document
        var _reservedEventTargets = ["document"];

        var base = {

            //(eventname)
            _equalizeeventname: function (eventname) {
                return eventname.replaceAll("_", "__").replaceAll(" ", "_");
            },

            _assure: _get_assure(),

            _getListenParams: getListenParams,
            _getListenDocumentParams: getListenDocumentParams,
            _getListenElementParams: getListenElementParams,
            _getListenSelfParams: getListenSelfParams,
            _getListenOthersParams: getListenOthersParams,

            _assureListen: assureListen,
            _assureListenDocument: assureListenDocument,
            _assureListenElement: assureListenElement,
            _assureListenSelf: assureListenSelf,
            _assureListenOthers: assureListenOthers

        };

        return base;


        //(eventname, sourceTarget, isFunc)
        function getListenParams(lc, args) {

            return {
                eventname: args[0],
                sourceTarget: args[1],
                func: args[2]
            };
        }


        //(eventname)
        function getListenDocumentParams(lc, args) {

            return {
                eventname: args[0]
            };
        }


        //(eventname, sourceTarget)
        function getListenElementParams(lc, args) {

            return {
                eventname: args[0],
                sourceTarget: args[1]
            };
        }


        //(eventname)
        function getListenSelfParams(lc, args) {

            return {
                eventname: args[0]
            };
        }


        //(eventname)
        function getListenOthersParams(lc, args) {

            return {
                eventname: args[0]
            };
        }


        function assureListen(params) {

            base._assure._isString(params.eventname);

            if (params.sourceTarget) {
                base._assure._isString(params.sourceTarget);
                base._assure._NonReservedEventTarget(params.sourceTarget);
            }

            base._assure._isFunction(params.func);
        }


        function assureListenDocument(params) {

            base._assure._isString(params.eventname);
            base._assure._isFunction(params.func);
        }


        function assureListenElement(params) {

            base._assure._isString(params.eventname);

            if (params.sourceTarget) {
                base._assure._isString(params.sourceTarget);
                base._assure._NonReservedEventTarget(params.sourceTarget);
            }

            base._assure._isFunction(params.func);
        }


        function assureListenSelf(params) {

            base._assure._isString(params.eventname);
            base._assure._isFunction(params.func);
        }


        function assureListenOthers(params) {

            base._assure._isString(params.eventname);
            base._assure._isFunction(params.func);
        }


        function _getNonRecommendNotifyEventNames() {

            var nonrecommendNotifyEventNames = "load,unload,click,dbclick,keydown,keypress,keyup,change";
            var nonrecommendNotifyEventNames_form = "blur,focus,search,select,submit";
            var nonrecommendNotifyEventNames_mouse = "mousedown,mousemove,mouseout,mouseup,mousewheel";
            var nonrecommendNotifyEventNames_clipboard = "copy,cut,paste";
            var nonrecommendNotifyEventNames_media = "abort";
            var nonrecommendNotifyEventNames_html5 = "afterprint,beforeprint,beforeunload,error,hashchange,message,offline,online,pagehide,pageshow,popstate,resize,storage";
            var nonrecommendNotifyEventNames_html5_form = "contextmenu,input,invalid,reset";
            var nonrecommendNotifyEventNames_html5_mouse = "scroll,wheel,drag,dragend,dragenter,dragleave,dragover,dragstart";
            var nonrecommendNotifyEventNames_html5_media = "canplay,canplaythrough,cuechange,durationchange,emptied,ended,error,loadeddata,loadstart,pause,play,playing,progress,ratechange,seeked,seeking,stalled,suspend,timeupdate,volumechange,waiting";
            var nonrecommendNotifyEventNames_html5_misc = "error,show,toggle";

            var names = "";
            names = nonrecommendNotifyEventNames
                + "," + nonrecommendNotifyEventNames_form
                + "," + nonrecommendNotifyEventNames_mouse
                + "," + nonrecommendNotifyEventNames_clipboard
                + "," + nonrecommendNotifyEventNames_media
                + "," + nonrecommendNotifyEventNames_html5
                + "," + nonrecommendNotifyEventNames_html5_form
                + "," + nonrecommendNotifyEventNames_html5_mouse
                + "," + nonrecommendNotifyEventNames_html5_media
                + "," + nonrecommendNotifyEventNames_html5_misc;


            for (var d in document) {
                if (typeof d === 'string' && d.indexOf("on") === 0) {
                    d = d.toLowerCase().substr(2);
                    if (names.indexOf(d) === -1)
                        names = d + "," + names;
                }
            }
            return names;
        }


        function _get_assure() {

            return {

                isnotfrom_me: function (values, lc) {

                    if (iscircular(values, lc))
                        throw Error("circular notification detected.");

                    function iscircular(values, lc) {
                        return values && values["token_tracer"].indexOf(lc.__token__) > -1;
                    }
                },
                _jquery: function ($) {

                    if (typeof $ === "undefined")
                        throw Error("require jQuery");

                    if (!$(document).on)
                        throw Error("require jQuery. Please load at least jQuery v.1.7.");
                },

                _simple_key_pair_object: function (obj) {

                    var type = typeof obj;

                    if (type === 'string' || type === 'number' || type === 'boolean')
                        return;

                    for (var key in obj) {
                        if (!isPure(obj[key]))
                            throw Error("non simple key pair object detected: " + obj[key]);
                    }

                    function isPure(v) {
                        var type = typeof v;
                        return type === 'string' || type === 'number' || type === 'boolean';
                    }

                },

                _isBoolean: function (obj) {
                    var type = typeof obj;

                    if (type !== "boolean")
                        throw Error("boolean is expected");
                },

                _isString: function (obj) {
                    var type = typeof obj;

                    if (type !== "string")
                        throw Error("string is expected");
                },

                _non_circular_messsage: function (token, values) {

                    var token_tracer = values["token_tracer"];

                    if (token_tracer && token_tracer.indexOf(token) > -1)
                        throw Error("circular messaging detected");

                },

                _Require: function (obj, errormsg) {
                    if (typeof obj === 'undefined')
                        throw Error(errormsg);
                },

                _NonReservedEventTarget: function (target) {
                    for (var i = 0; i < _reservedEventTargets.length; i++) {
                        var _reservedEventTarget = _reservedEventTargets[i];
                        if (target === _reservedEventTarget)
                            throw Error("should not target event to " + _reservedEventTarget);
                    }
                },

                _NonRecommend_eventname: function (eventname) {
                    if (_nonrecommendNotifyEventNames.indexOf(eventname.toLowerCase()) > -1)
                        throw Error("should not use '" + eventname + "' because of its general use.");
                },

                _isNonFunction: function (values) {
                    if (typeof values === "function")
                        throw Error("parameter must be non function");
                },

                _isFunction: function (func) {
                    if (typeof func !== "function")
                        throw Error("parameter must be function");
                },
            };
        }
    }
}));
