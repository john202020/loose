"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd)
        define(["jquery", "knockout"], factory);
    else if (typeof module === "object" && module.exports)
        module.exports = factory(require("jquery"), require("knockout"));
    else
        root.looseko = factory(root["jQuery"], root["knockout"] || root["ko"]);
}(this || (0, eval)('this'), function ($, ko) {


    function loose_ko(lc) {
        var lc_ob = {
            //sourceEvent is compulsory
            //sourceTarget is optional
            //return
            //  ko.observable({
            //      values: {},
            //      dom: document
            //  });

            listen: function () {
                //(isDisposeOnRemove, eventname, sourceTarget, is_to_listenSelf, isFunc)

                var assure = lc.__assure__;
                
                var args = arguments;
                var leng = args.length;
                var argIndexOffset = typeof args[0] === "boolean" ? 1 : 0;

                var eventname = args[argIndexOffset];
                var sourceTarget = args[argIndexOffset + 1];            
                var is_to_listenSelf = args[argIndexOffset + 2];   
                var isFunc = args[argIndexOffset + 3];

                var _isDisposeOnRemove = typeof args[0] === "boolean" ? args[0] : false;
                          
                assure._isString(eventname);                

                var ob = ko.observable({ values: {}, dom: document });
              
                var _func = function (values) {
              
                    if (isFunc === undefined || isFunc === null || isFunc.call(this)) {
                        values.dom = this;

                        ob(values);
                    }
                };

                lc.listen(_isDisposeOnRemove, _func, eventname, sourceTarget, is_to_listenSelf);
          
                return ob;


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

                return lc_ob.listen(isDisposeOnRemove, eventname, null, null, _isFunc);

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

                return lc_ob.listen(isDisposeOnRemove, eventname, sourceTarget, null, _isFunc);

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
                return lc_ob.listen(isDisposeOnRemove, eventname, null, true, _isFunc);
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

                return lc_ob.listen(isDisposeOnRemove, eventname, null, false, _isFunc);
            }
        };
        
        return lc_ob;
    }


    return loose_ko;
}));