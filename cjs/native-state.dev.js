"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Root = Root;
exports.useSelector = void 0;
var _react = require("react");
var i = {};
var s = i,
  t = function t() {
    var ns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    s = Object.assign({}, s, ns);
    l.forEach(function (e) {
      return e();
    });
  },
  f = !0;
var l = new Set();
function Root(_ref) {
  var _ref$initial = _ref.initial,
    initial = _ref$initial === void 0 ? i : _ref$initial;
  if (f) {
    s = initial;
    l.forEach(function (l) {
      return l();
    });
    f = !1;
  }
  return null;
}
var useSelector = exports.useSelector = function useSelector(sl) {
  var subscribe = (0, _react.useCallback)(function (callback) {
    l.add(callback);
    return function () {
      return l["delete"](callback);
    };
  }, []);
  var c = (0, _react.useSyncExternalStore)(subscribe, function () {
    try {
      return sl(s) || null;
    } catch (error) {
      return undefined;
    }
  }, function () {
    try {
      return sl(s) || null;
    } catch (error) {
      return undefined;
    }
  });
  return [c, t];
};