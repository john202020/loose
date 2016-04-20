
(function (root, factory) {

    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    }
    else if (typeof module === "object" && module.exports) {
        module.exports = factory( require("jquery"));
    }
    else {
        root.loose = factory( root["jQuery"]);
    }
    
}(this || (0, eval)('this'), function ( $) {

    "use strict";
    
    var _assure =_get_assure();
  

    _assure._jquery($);
    

    var _loose_id = 1;
    //event targeting to document is total wrong because all event will be triggered from document
    var _reservedEventTarget = { document: "document" };

    //should include all available document event
    var _nonrecommendNotifyEventNames = _getNonRecommendNotifyEventNames();
   
    var _notify = (function (values, eventname, lc) {

        return function (values, eventname, lc) {
            if (lc.__enabled__) {
                
                var values = values || {};

                values['token_tracer'] = (values['token_tracer'] || "") + lc.__token__;
                values['token'] = lc.__token__;
                
                $trigger(values, eventname);
            }
        }


        function $trigger(values, eventname) {
            var event = jQuery.Event(eventname);
            event.values = JSON.stringify(values);
            $.event.trigger(event);
        }
    }());

  
    var _listen = (function (isDisposeOnRemove,func, eventname, sourceTarget, is_to_listenSelf, lc) {

        var listen_index = 0;

        return function (isDisposeOnRemove, func, eventname, sourceTarget, is_to_listenSelf, lc) {

            $("document").ready(
                function () {
                    var handler_ = getHandler(func, sourceTarget, is_to_listenSelf, lc);

                    var namespace = '.' + (listen_index++);

                    if (sourceTarget)
                        $(this).on(eventname + namespace, sourceTarget, handler_);
                    else
                        $(this).on(eventname + namespace, handler_);

                    lc.__listening__.push({ namespace: namespace });

                    if(isDisposeOnRemove)
                        lc.__listening_registered__.push({ namespace: namespace });
                });

            return lc;
        }

        function getHandler(func, sourceTarget, is_to_listenSelf, lc) {

            return function (event, data) {
                event.stopPropagation()

                var self = this;
                
                var values = null;
                if (!sourceTarget && event.values)
                    values = JSON.parse(event.values); //passed values from JQuery event  
                
                var shouldlisten = lc.__enabled__;
                if (shouldlisten)
                    if (typeof is_to_listenSelf !== 'undefined' && is_to_listenSelf !== null)
                        shouldlisten = is_to_listenSelf === isme(values, lc);

                if (shouldlisten)
                    func.call(self, sourceTarget ? {} : values || {});
            };
            
            function isme(values, lc) {
                return values && values["token"] === lc.__token__;
            }

        }
    }());

    //default enable = true;
    return function (enable) {

        if (typeof enable !== "undefined")
            _assure._boolean(enable);
        else
            enable = true;

        return new _loose(enable);
    }
    

    function _loose(enable) {
        
        var lc = this;

        lc.__listening__ = [];

        lc.__listening_registered__ = [];
        
        lc.__token__ = "" + _loose_id++;

        lc.__enabled__ = enable;

        lc.disposeRegistered =
            function () {
                _disposeRegistered(lc);
            };

        lc.dispose =
            function () {
                _dispose(lc);
            };

        lc.isEnable =
            function () {
                return lc.__enabled__;
            };

        lc.enable =
            function () {
                lc.__enabled__ = true;
            };
        lc.disable =
            function () {
                lc.__enabled__ = false;
            };

        //expect non function as the first argument
        //eventname is compulsory
        //generate event from document through jquery $.event.trigger
        //loose's 'token' will be attached to the generated event
        //'token_tracer' will be attached to the generated event
        lc.notify =
            function (values, eventname) {
                _assure._Require(values);
                _assure._Require(eventname);

                _assure._isString(eventname);
                _assure._NonRecommend_eventname(eventname);

                _assure._isNonFunction(values);
                _assure._simple_key_pair_object(values);

                _notify(values, eventname, lc);
            };

        //expect function as the first argument
        //sourceEvent is compulsory
        //sourceTarget is optional
        //func has this function of either the invoked dom element or the document.
        lc.listen =
            function () {
                //(func, eventname, sourceTarget, is_to_listenSelf)
                var args = arguments;
                
                var argIndexOffset = args.length === 5 ? 1 : 0;

                var isDisposeOnRemove = typeof args[0] === "boolean" ? args[0] : false ;
                var func = args[argIndexOffset];
                var eventname = args[argIndexOffset + 1];
                var sourceTarget = args[argIndexOffset + 2];
                var is_to_listenSelf = args[argIndexOffset + 3];

                
                _assure._Require(func);
                _assure._Require(eventname);
                _assure._isString(eventname);
                _assure._isFunction(func);

                if (sourceTarget) {
                    _assure._isString(sourceTarget);
                    _assure._NonTargetDocument(sourceTarget);
                }

                if (is_to_listenSelf)
                    _assure._boolean(is_to_listenSelf);
                
                return _listen(isDisposeOnRemove, func, eventname, sourceTarget, is_to_listenSelf, lc);
            };

        //expect function as the first argument
        //react only when event from DOM document        
        lc.listenDocument =
            function () {
                //(func, eventname)
                var args = arguments;

                var argIndexOffset = args.length === 3 ? 1 : 0;

                var isDisposeOnRemove = typeof args[0] === "boolean" ? args[0] : false;
                var func = args[argIndexOffset];
                var eventname = args[argIndexOffset + 1];
              
                var _func = function (values) {                    
                    if (this.nodeType === 9)
                        func.call(this, values);
                }

                return lc.listen(isDisposeOnRemove, _func, eventname, null, null);
      
            };
        
        //expect function as the first argument
        //react only when event from DOM document        
        lc.listenElement =
            function () {
                //(func, eventname, sourceTarget)
                var args = arguments;

                var argIndexOffset = args.length === 4 ? 1 : 0;

                var isDisposeOnRemove = typeof args[0] === "boolean" ? args[0] : false;
                var func = args[argIndexOffset];
                var eventname = args[argIndexOffset + 1];
                var sourceTarget = args[argIndexOffset + 2];

                var _func = function (values) {
                    if (this.nodeType === 1 && this.nodeType !==9)
                        func.call(this, values);
                }

                return lc.listen(isDisposeOnRemove, _func, eventname, sourceTarget, null);
                
            };

        //expect function as the first argument
        //react only when token the same
        //func has this function of either the invoked  the document.
        lc.listenSelf =
            function () {
                //(func, eventname)
                var args = arguments;

                var argIndexOffset = args.length === 3 ? 1 : 0;

                var isDisposeOnRemove = typeof args[0] === "boolean" ? args[0] : false;
                var func = args[argIndexOffset];
                var eventname = args[argIndexOffset + 1];
              
                return lc.listen(func, eventname, null, true);
            };

        //expect function as the first argument
        //react only when token not the same
        //func has this function of either the invoked  the document.
        lc.listenOthers =
            function () {
                //(func, eventname)
                var args = arguments;

                var argIndexOffset = args.length === 3 ? 1 : 0;

                var isDisposeOnRemove = typeof args[0] === "boolean" ? args[0] : false;
                var func = args[argIndexOffset];
                var eventname = args[argIndexOffset + 1];
                
                return lc.listen(func, eventname, null, false);
            };

        lc.l = lc.listen;
        lc.ls = lc.listenSelf;
        lc.lo = lc.listenOthers;
        lc.ld = lc.listenDocument;
        lc.le = lc.listenElement;
    }


    function _dispose(lc) {

        $("document").ready(
             function () {
                 while (lc.__listening__.length > 0)
                     $(this).off(lc.__listening__.pop().namespace);
             });

        lc.__listening__ = [];

    };

    function _disposeRegistered(lc) {

        $("document").ready(
             function () {
                 while (lc.__listening_registered__.length > 0)
                     $(this).off(lc.__listening_registered__.pop().namespace);
             });

        lc.__listening_registered__ = [];

    };

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
            if (typeof d === 'string' && d.indexOf("on")===0) {
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


            _boolean: function (obj) {
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


            _NonTargetDocument: function (target) {
                if (target === _reservedEventTarget.document)
                    throw Error("should not target event to " + _reservedEventTarget.document);
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

}));