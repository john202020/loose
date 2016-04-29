"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd)
        define(["jquery", "knockout"], factory);
    else if (typeof module === "object" && module.exports)
        module.exports = factory(require("jquery"), require("knockout"));
    else
        root.loose = factory(root["jQuery"], root["knockout"] || root["ko"]);
}(this || (0, eval)('this'), function ($, ko) {

    //var _assure = _get_assure();

    //_assure._jquery($);

    //_getLoose_observable_constructor
    return function (lc) {
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
                var args = arguments;
                var leng = args.length;
                var argIndexOffset = leng > 3 ? 1 : 0;

              //  var eventname = args[argIndexOffset];
                var sourceTarget = args[argIndexOffset + 1];
                var is_to_listenSelf = args[argIndexOffset + 2];

                var ob = ko.observable({ values: {}, dom: document });

                var _isDisposeOnRemove = typeof args[0] === "boolean" ? args[0] : false;
                var eventname = typeof args[0] === "string" ? args[0] : args[1];

                var _isFuncIndex = undefined;
                _isFuncIndex = leng === 5 ? 4 : undefined;
                var _isFunc = typeof _isFuncIndex !== "undefined" ? args[_isFuncIndex] : undefined;

                var _func = function (values) {
                    if (typeof _isFunc === "undefined" || _isFunc.call(this))
                        ob({ values: values, dom: this });
                };

                lc.listen(_isDisposeOnRemove, _func, eventname, sourceTarget, is_to_listenSelf);

                return ob;

            },


            //react only when event from DOM document
            listenDocument: function () {
                //(isDisposeOnRemove, eventname)
                var args = arguments;

                var isDisposeOnRemove = typeof args[0] === "boolean" ? args[0] : false;

                var eventname = args[args.length > 1 ? 1 : 0];

                var _isFunc = function () {
                    return (this.nodeType === 9);
                }

                return lc_ob.listen(isDisposeOnRemove, eventname, null, null, _isFunc);

            },

            //react only when event from DOM document
            listenElement: function () {
                //(isDisposeOnRemove, eventname, sourceTarget)
                var args = arguments;

                var argIndexOffset = args.length > 2 ? 1 : 0;

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

                var isDisposeOnRemove = typeof args[0] === "boolean" ? args[0] : false;

                var eventname = args[args.length > 1 ? 1 : 0];

                var _isFunc = function () {
                    return true;
                }
                return lc_ob.listen(isDisposeOnRemove, eventname, null, true, _isFunc);
            },

            //react only when token not the same
            listenOthers: function () {
                //(isDisposeOnRemove, eventname)
                var args = arguments;

                var isDisposeOnRemove = typeof args[0] === "boolean" ? args[0] : false;

                var eventname = args[args.length > 1 ? 1 : 0];

                var _isFunc = function () {
                    return true;
                }

                return lc_ob.listen(isDisposeOnRemove, eventname, null, false, _isFunc);
            }
        };
        
        return lc_ob;
    }

}));