"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Root = Root;
exports.useNativeState = exports.useNativeSelector = void 0;
var _react = require("react");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var initialState = {};
var listeners = new Set();
var s = initialState;
var first = true;
var subscribe = function subscribe(callback) {
  listeners.add(callback);
  return function () {
    return listeners["delete"](callback);
  };
};
function Root(_ref) {
  var _ref$children = _ref.children,
    children = _ref$children === void 0 ? null : _ref$children,
    _ref$initial = _ref.initial,
    initial = _ref$initial === void 0 ? initialState : _ref$initial;
  if (first) {
    s = initial;
    listeners.forEach(function (l) {
      return l();
    });
    first = false;
  }
  return children;
}
var useNativeSelector = exports.useNativeSelector = function useNativeSelector(selector) {
  var getSnapshot = (0, _react.useCallback)(function () {
    try {
      return selector(s);
    } catch (error) {
      return undefined;
    }
  }, [selector]);
  return (0, _react.useSyncExternalStore)(subscribe, getSnapshot, getSnapshot);
};
function getValueByPath(obj, keys) {
  //  Drill down into the object
  return keys.reduce(function (acc, key) {
    return acc && acc[key] !== undefined ? acc[key] : undefined;
  }, obj);
}
var useNativeState = exports.useNativeState = function useNativeState(selector) {
  var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  try {
    var keys = (0, _react.useMemo)(function () {
      return selector.replace(/\[(\d+)\]/g, '.$1').split('.');
    }, [selector]);
    var setSlice = (0, _react.useCallback)(function () {
      var newVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (keys.length > 1) {
        var slicedS = Object.assign({}, s);
        var slice = slicedS;
        slice = getValueByPath(slice, keys.slice(1, -1));
        if (slice) {
          slice[keys[keys.length - 1]] = newVal;
        } else {
          throw Error(selector.replace(/(\[|\.)[^.\[\]]+\]?$/, '') + " not found");
        }
        s = slicedS;
        listeners.forEach(function (l) {
          return l();
        });
      } else {
        s = Object.assign({}, s, newVal);
        listeners.forEach(function (l) {
          return l();
        });
      }
    }, [keys, selector]);
    var accessor = (0, _react.useCallback)(function (state) {
      if (keys.length > 1) {
        var slice = _objectSpread({}, state);
        slice = getValueByPath(slice, keys.slice(1));
        return slice;
      }
      return state;
    }, [keys]);
    if (val !== undefined && first === false) {
      first = undefined;
      var currentVal = keys.length > 1 ? getValueByPath(s, keys.slice(1)) : s;
      if (currentVal === undefined) {
        setSlice(val);
      }
    }
    var getSnapshot = (0, _react.useCallback)(function () {
      try {
        return accessor(s);
      } catch (error) {
        return undefined;
      }
    }, [accessor]);
    var sliced = (0, _react.useSyncExternalStore)(subscribe, getSnapshot, getSnapshot);
    return [sliced, setSlice];
  } catch (error) {
    throw Error("Some error occured. Check the useNativeState parameters passed. Make sure <Root/> is intialised.");
  }
};
