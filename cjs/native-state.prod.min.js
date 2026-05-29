"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Root = Root;
exports.useNativeState = exports.useNativeSelector = void 0;
var _react = require("react");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var initialState = {};
var listenersBySelector = new Map();
var functionListeners = new Set();
var s = initialState;
var first = true;
var pendingCallbacks = new Set();
var updateScheduled = false;
var flushNotifications = function flushNotifications() {
  updateScheduled = false;
  var callbacks = Array.from(pendingCallbacks);
  pendingCallbacks.clear();
  for (var i = 0; i < callbacks.length; i++) callbacks[i]();
};
var scheduleNotification = function scheduleNotification(callback) {
  pendingCallbacks.add(callback);
  if (!updateScheduled) {
    updateScheduled = true;
    queueMicrotask(flushNotifications);
  }
};
var isSubPath = function isSubPath(parent, child) {
  return child.startsWith(parent + '.') || child.startsWith(parent + '[');
};
var notifyUpdate = function notifyUpdate(updatedSelector) {
  if (!updatedSelector) {
    var _iterator = _createForOfIteratorHelper(listenersBySelector.values()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var set = _step.value;
        var _iterator2 = _createForOfIteratorHelper(set),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var cb = _step2.value;
            scheduleNotification(cb);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } else {
    var _iterator3 = _createForOfIteratorHelper(listenersBySelector.entries()),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _step3$value = _slicedToArray(_step3.value, 2),
          sel = _step3$value[0],
          _set = _step3$value[1];
        if (sel === updatedSelector || isSubPath(updatedSelector, sel) || isSubPath(sel, updatedSelector)) {
          var _iterator4 = _createForOfIteratorHelper(_set),
            _step4;
          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var _cb = _step4.value;
              scheduleNotification(_cb);
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }
  var _iterator5 = _createForOfIteratorHelper(functionListeners),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var _cb2 = _step5.value;
      scheduleNotification(_cb2);
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
};
var subscribe = function subscribe(selector, callback) {
  if (typeof selector === "function") {
    functionListeners.add(callback);
    return function () {
      return functionListeners["delete"](callback);
    };
  }
  var set = listenersBySelector.get(selector);
  if (!set) {
    set = new Set();
    listenersBySelector.set(selector, set);
  }
  set.add(callback);
  return function () {
    set["delete"](callback);
    if (set.size === 0) listenersBySelector["delete"](selector);
  };
};
function Root(_ref) {
  var _ref$children = _ref.children,
    children = _ref$children === void 0 ? null : _ref$children,
    _ref$initial = _ref.initial,
    initial = _ref$initial === void 0 ? initialState : _ref$initial;
  if (first) {
    s = initial;
    notifyUpdate();
    first = false;
  }
  return children;
}
var selectorCache = new Map();
var compileGetter = function compileGetter(keysList) {
  var len = keysList.length;
  if (len === 0) return function (state) {
    return state;
  };
  if (len === 1) {
    var k0 = keysList[0];
    return function (state) {
      return state == null ? undefined : state[k0];
    };
  }
  if (len === 2) {
    var _k = keysList[0];
    var k1 = keysList[1];
    return function (state) {
      if (state == null) return undefined;
      var v = state[_k];
      return v == null ? undefined : v[k1];
    };
  }
  return function (state) {
    var val = state;
    for (var i = 0; i < len; i++) {
      if (val == null) return undefined;
      val = val[keysList[i]];
    }
    return val;
  };
};
function getMeta(selector) {
  if (typeof selector !== "string") return null;
  var meta = selectorCache.get(selector);
  if (!meta) {
    var keys = selector.replace(/\[(\d+)\]/g, '.$1').split('.');
    var drillKeys = keys.slice(1);
    var parentKeys = keys.slice(1, -1);
    var lastKey = keys[keys.length - 1];
    meta = {
      keys: keys,
      drillKeys: drillKeys,
      parentKeys: parentKeys,
      lastKey: lastKey,
      hasMultipleKeys: keys.length > 1,
      get: compileGetter(drillKeys),
      getParent: compileGetter(parentKeys)
    };
    selectorCache.set(selector, meta);
  }
  return meta;
}
var useNativeSelector = exports.useNativeSelector = function useNativeSelector(selector) {
  var meta = (0, _react.useMemo)(function () {
    return getMeta(selector);
  }, [selector]);
  var getSnapshot = (0, _react.useCallback)(function () {
    try {
      if (typeof selector === "function") return selector(s);
      if (meta && meta.hasMultipleKeys) return meta.get(s);
      return s;
    } catch (error) {
      return undefined;
    }
  }, [selector, meta]);
  var customSubscribe = (0, _react.useCallback)(function (callback) {
    return subscribe(selector, callback);
  }, [selector]);
  return (0, _react.useSyncExternalStore)(customSubscribe, getSnapshot, getSnapshot);
};
var useNativeState = exports.useNativeState = function useNativeState(selector) {
  var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  try {
    var once = false;
    var meta = (0, _react.useMemo)(function () {
      return getMeta(selector);
    }, [selector]);
    var setSlice = (0, _react.useCallback)(function () {
      var newVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (meta.hasMultipleKeys) {
        var slicedS = _objectSpread({}, s);
        var slice = meta.parentKeys.length > 0 ? meta.getParent(slicedS) : slicedS;
        if (slice) {
          slice[meta.lastKey] = newVal;
        } else {
          throw Error(selector.replace(/(\[|\.)[^.\[\]]+\]?$/, '') + " not found");
        }
        s = slicedS;
        notifyUpdate(selector);
      } else {
        s = _objectSpread(_objectSpread({}, s), newVal);
        notifyUpdate();
      }
    }, [meta, selector]);
    var accessor = (0, _react.useCallback)(function (state) {
      return meta.hasMultipleKeys ? meta.get(state) : state;
    }, [meta]);
    if (val !== undefined && once === false) {
      once = undefined;
      var currentVal = meta.hasMultipleKeys ? meta.get(s) : s;
      if (currentVal === undefined) setSlice(val);
    }
    var getSnapshot = (0, _react.useCallback)(function () {
      try {
        return accessor(s);
      } catch (error) {
        return undefined;
      }
    }, [accessor]);
    var customSubscribe = (0, _react.useCallback)(function (callback) {
      return subscribe(selector, callback);
    }, [selector]);
    var sliced = (0, _react.useSyncExternalStore)(customSubscribe, getSnapshot, getSnapshot);
    return [sliced, setSlice];
  } catch (error) {
    throw Error("Some error occured. Check the useNativeState parameters passed. Make sure <Root/> is intialised.");
  }
};
