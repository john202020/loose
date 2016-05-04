"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd)
        define(["jquery", "rx"], factory);
    else if (typeof module === "object" && module.exports)
        module.exports = factory(require("jquery"), require("rx"));
    else
        root.loose = factory(root["jQuery"], root("rx"));
}(this || (0, eval)('this'), function ($, rx) {

    var base = base_worker($);

    var _assure = base._assure;

    _assure._jquery($);

    var _loose_id = 1;

    //default enable = true;
    //(enable)
    return function () {

        var args = arguments;
        var leng = args.length;
        var argIndexOffset = typeof args[0] === "boolean" > 1 ? 1 : 0;

        var enable = true;
        if (argIndexOffset > 0)
            enable = args[0];

        _assure._isBoolean(enable);
        
        var loose = new _loose({}, (typeof enable === "undefined") ? true : enable);

        var looserx = loose_rx(loose);

        for (var key in looserx) {
            loose[key] = looserx[key];
        };

        return loose;
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

        lc.__listening__ = [];

        lc.__listening_registered__ = [];

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

            var args = arguments;

            var eventname = args[0];
            var values = args[1];

            _assure._isString(eventname);
            _assure._NonRecommend_eventname(eventname);
            _assure._isNonFunction(values);
            
            if (lc.__enabled__) {

                values = (values === undefined || values === null) ? {} : values;
                $trigger(values, base._equalizeeventname(eventname));
            }

            function $trigger(values, eventname) {
                var event = jQuery.Event(eventname);

                var isValue = typeof values === "string" || typeof values === "boolean" || typeof values === "number";
                event.values =  isValue ? values : JSON.stringify(values);

                event['token_tracer'] = (event['token_tracer'] || "") + lc.__token__;
                event['token'] = lc.__token__;
                
                $.event.trigger(event);
            }
        };


        return lc;

    }


    function _dispose(lc) {
    };


    function isme(event, lc) {
        return event["token"] === lc.__token__;
    }


    function loose_rx(lc) {
        var lc_rx = {

            //(eventname, sourceTarget, isFunc)
            listen: function () {

                var params = base._getListenParams(lc, arguments);
                params.func = params.func || function () { return true; };
                base._assureListen(params);

                return getObservable(params);
                

                function getObservable(params) {

                    return rx.Observable
                          .fromEvent($(document), params.eventname)
                          .filter(event => _shouldlisten(lc, params.func, params.sourceTarget, event))
                          .map(event => getValues(event));


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
            },


            //react only when event from DOM document
            //(eventname)
            listenDocument: function () {

                var params = base._getListenDocumentParams(lc, arguments);

                var _isFunc = function () {
                    return (this.nodeType === 9);
                }

                params.func = _isFunc;
                base._assureListenDocument(params);

                return lc_rx.listen( params.eventname, null, _isFunc);

            },


            //react only when event from DOM document
            //(eventname, sourceTarget)
            listenElement: function () {

                var params = base._getListenElementParams(lc, arguments);

                var _isFunc = function () {
                    return (this.nodeType === 1 && this.nodeType !== 9);
                }

                params.func = _isFunc;
                base._assureListenElement(params);

                return lc_rx.listen( params.eventname, params.sourceTarget, _isFunc);

            },


            //react only when token the same
            //(eventname)
            listenSelf: function () {

                var params = base._getListenSelfParams(lc, arguments);

                var _isFunc = function (event) {
                    return isme(event, lc);
                }

                params.func = _isFunc;
                base._assureListenSelf(params);

                return lc_rx.listen( params.eventname, null, _isFunc);
            },


            //react only when token not the same
            //(eventname)
            listenOthers: function () {

                var params = base._getListenOthersParams(lc, arguments);

                var _isFunc = function (event) {
                    return !isme(event, lc);
                }

                params.func = _isFunc;
                base._assureListenOthers(params);

                return lc_rx.listen( params.eventname, null, _isFunc);
            }
        };

        return lc_rx;
    }


    function base_worker($) {


        var assure = _get_assure();


        function _equalizeeventname(eventname) {
            return eventname.replaceAll("_", "__").replaceAll(" ", "_");
        }


        //should include all available document event
        var _nonrecommendNotifyEventNames = _getNonRecommendNotifyEventNames();

        //event targeting to document is total wrong because all event will be triggered from document
        var _reservedEventTargets = ["document"];


        //(func, eventname, sourceTarget, lc)
        var _listen = (function () {

            var listen_index = 0;

            return function ( func, eventname, sourceTarget, lc) {

                $("document").ready(
                    function () {

                        eventname = _equalizeeventname(eventname);

                        var handler_ = getHandler(func, sourceTarget, lc);

                        var namespace = '.' + (listen_index++);

                        if (sourceTarget)
                            $(this).on(eventname + namespace, sourceTarget, handler_);
                        else
                            $(this).on(eventname + namespace, handler_);

                        lc.__listening__.push(namespace);

                        if (isDisposeOnRemove)
                            lc.__listening_registered__.push(namespace);
                    });

                return lc;
            }


            function getHandler(func, sourceTarget, lc) {

                return function (event, data) {
                    event.stopPropagation()

                    var self = this;

                    if (event && event.values) {

                        try {
                            event.values = JSON.parse(event.values); //passed values from JQuery event
                        }
                        catch (e) { }
                    }

                    if (lc.__enabled__)
                        func.call(self, getValues(event));

                };


                function getValues(d) {

                    d.dom = (d.target.nodeName === "HTML" || d.target.nodeName === "BODY") ?
                        document : d.target;

                    d.values = (d.values === undefined || d.values === null) ? {} : d.values;

                    return d;
                }

            }

        }());


        var base = {

            //(eventname) 
            _equalizeeventname: _equalizeeventname,

            _assure: assure,

            //(func, eventname, sourceTarget, lc)
            _listen: _listen,

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

          //  var assure = base._get_assure();

            assure._isString(params.eventname);

            if (params.sourceTarget) {
                assure._isString(params.sourceTarget);
                assure._NonReservedEventTarget(params.sourceTarget);
            }

            assure._isFunction(params.func);
        }


        function assureListenDocument(params) {

         //   var assure = base._get_assure();

            assure._isString(params.eventname);
            assure._isFunction(params.func);
        }


        function assureListenElement(params) {

          //  var assure = base._get_assure();

            assure._isString(params.eventname);

            if (params.sourceTarget) {
                assure._isString(params.sourceTarget);
                assure._NonReservedEventTarget(params.sourceTarget);
            }

            assure._isFunction(params.func);
        }


        function assureListenSelf(params) {

          //  var assure = base._get_assure();

            assure._isString(params.eventname);
            assure._isFunction(params.func);
        }


        function assureListenOthers(params) {

         //   var assure = base._get_assure();

            assure._isString(params.eventname);
            assure._isFunction(params.func);
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

