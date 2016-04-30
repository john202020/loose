"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd)
        define(["jquery", "rx"], factory);
    else if (typeof module === "object" && module.exports)
        module.exports = factory(require("jquery"), require("rx"));
    else
        root.looserx = factory(root["jQuery"], root["rx"] );
}(this || (0, eval)('this'), function ($, rx) {

    
   function loose_rx( lc) {
        var lc_rx = {
            //sourceEvent is compulsory
            //sourceTarget is optional
            //return
            //  ko.observable({
            //      values: {},
            //      dom: document
            //  });
            listen: function () {
                var assure = lc.__assure__;

                //(isDisposeOnRemove, eventname, sourceTarget, is_to_listenSelf, isFunc)
                var args = arguments;
                var leng = args.length;
                var argIndexOffset = typeof args[0] === "boolean" ? 1 : 0;

                var sourceTarget = args[argIndexOffset + 1];                
                var is_to_listenSelf = args[argIndexOffset + 2];             
            
                var _isDisposeOnRemove = typeof args[0] === "boolean" ? args[0] : false;
                var eventname = typeof args[0] === "string" ? args[0] : args[1];
                
                assure._NonReservedEventTarget(sourceTarget);

                assure._isBoolean(_isDisposeOnRemove);
                assure._isString(eventname);
                
                var isFunc = args[argIndexOffset + 4];

                var subscription =
                            rx.Observable
                            .fromEvent($(document), eventname)
                            .filter(event => _shouldlisten(lc, is_to_listenSelf, isFunc, sourceTarget, event))
                            .map(event => getValues(event));
                
                lc.__listening__.push(subscription);

                if (_isDisposeOnRemove)
                    lc.__listening_registered__.push(subscription);


                return subscription;

                function _shouldlisten(lc, is_to_listenSelf, isFunc, sourceTarget, event) {

              

                    var shouldlisten = lc.__enabled__;
                    if (shouldlisten)
                        if (is_to_listenSelf !== undefined && is_to_listenSelf !== null)
                            shouldlisten = is_to_listenSelf === isme(event, lc);

                    return shouldlisten && isMatchDOM(isFunc, sourceTarget, event);


                    function isMatchDOM(isFunc, sourceTarget, event) {
                                                                     

                        var dom = event.dom;

                        var ok = (
                                is_to_listenSelf === undefined || is_to_listenSelf === null
                                || is_to_listenSelf === isme(event.values, lc)
                            )
                            && (isFunc === undefined || isFunc === undefined || isFunc.call(dom))
                            && (sourceTarget === undefined || sourceTarget === null || $(dom).is(sourceTarget));

                      //  console.log(sourceTarget === undefined || sourceTarget === null || $(dom).is(sourceTarget));
                        return ok;
                    }
                    
                    function isme(event, lc) {
                        return event["token"] === lc.__token__;
                    }
                }

                

                function getValues(event) {

                    var values = null;
                    
                    event.dom = (event.target.nodeName === "HTML" || event.target.nodeName === "BODY") ?
                        document : event.target;

                    event.values = event.values || {};
                
                    return event;
                }
            },


            //react only when event from DOM document
            listenDocument: function () {
                //(isDisposeOnRemove, eventname)
                var args = arguments;
                var argIndexOffset = typeof args[0] === "boolean" ? 1 : 0;

                var isDisposeOnRemove = typeof args[0] === "boolean" ? args[0] : false;

                var eventname = args[argIndexOffset];

                var _isFunc = function () {
                    return (this.nodeType === 9);
                }

                return lc_rx.listen(isDisposeOnRemove, eventname, null, null, _isFunc);

            },

            //react only when event from DOM document
            listenElement: function () {
                //(isDisposeOnRemove, eventname, sourceTarget)
                var args = arguments;

                var argIndexOffset = typeof args[0] === "boolean" ? 1 : 0;

                var isDisposeOnRemove = typeof args[0] === "boolean" ? args[0] : false;

                var eventname = args[argIndexOffset];
                var sourceTarget = args[argIndexOffset + 1];

                var _isFunc = function () {
                    return (this.nodeType === 1 && this.nodeType !== 9);
                }

                return lc_rx.listen(isDisposeOnRemove, eventname, sourceTarget, null, _isFunc);

            },

            //react only when token the same
            listenSelf: function () {
                //(isDisposeOnRemove, eventname)
                var args = arguments;
                var argIndexOffset = typeof args[0] === "boolean" ? 1 : 0;

                var isDisposeOnRemove = typeof args[0] === "boolean" ? args[0] : false;

                var eventname = args[argIndexOffset];

                var _isFunc = function () {
                    return true;
                }
                return lc_rx.listen(isDisposeOnRemove, eventname, null, true, _isFunc);
            },

            //react only when token not the same
            listenOthers: function () {
                //(isDisposeOnRemove, eventname)
                var args = arguments;
                var argIndexOffset = typeof args[0] === "boolean" ? 1 : 0;

                var isDisposeOnRemove = typeof args[0] === "boolean" ? args[0] : false;

                var eventname = args[argIndexOffset];

                var _isFunc = function () {
                    return true;
                }

                return lc_rx.listen(isDisposeOnRemove, eventname, null, false, _isFunc);
            }
        };

        return lc_rx;
    }

   return loose_rx;
}));