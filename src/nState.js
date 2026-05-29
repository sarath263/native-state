import { useCallback, useSyncExternalStore, useMemo } from "react";

const initialState = {};
const listenersBySelector = new Map();
const functionListeners = new Set();
let s = initialState;
let first = true;
const pendingCallbacks = new Set();
let updateScheduled = false;

const flushNotifications = () => {
  updateScheduled = false; const callbacks = Array.from(pendingCallbacks); pendingCallbacks.clear();
  for (let i = 0; i < callbacks.length; i++) callbacks[i]();
};

const scheduleNotification = (callback) => {
  pendingCallbacks.add(callback);
  if (!updateScheduled) { updateScheduled = true; queueMicrotask(flushNotifications); }
};

const isSubPath = (parent, child) => child.startsWith(parent + '.') || child.startsWith(parent + '[');

const notifyUpdate = (updatedSelector) => {
  if (!updatedSelector) {
    for (const set of listenersBySelector.values()) { for (const cb of set) scheduleNotification(cb); }
  } else {
    for (const [sel, set] of listenersBySelector.entries()) {
      if (sel === updatedSelector || isSubPath(updatedSelector, sel) || isSubPath(sel, updatedSelector)) {
        for (const cb of set) scheduleNotification(cb);
      }
    }
  }
  for (const cb of functionListeners) scheduleNotification(cb);
};

const subscribe = (selector, callback) => {
  if (typeof selector === "function") { functionListeners.add(callback); return () => functionListeners.delete(callback); }
  let set = listenersBySelector.get(selector);
  if (!set) { set = new Set(); listenersBySelector.set(selector, set); }
  set.add(callback);
  return () => { set.delete(callback); if (set.size === 0) listenersBySelector.delete(selector); };
};

export function Root({ children = null, initial = initialState }) { if (first) { s = initial; notifyUpdate(); first = false; } return children; }

const selectorCache = new Map();

const compileGetter = (keysList) => {
  const len = keysList.length;
  if (len === 0) return (state) => state;
  if (len === 1) { const k0 = keysList[0]; return (state) => state == null ? undefined : state[k0]; }
  if (len === 2) { const k0 = keysList[0]; const k1 = keysList[1]; return (state) => { if (state == null) return undefined; const v = state[k0]; return v == null ? undefined : v[k1]; }; }
  return (state) => { let val = state; for (let i = 0; i < len; i++) { if (val == null) return undefined; val = val[keysList[i]]; } return val; };
};

function getMeta(selector) {
  if (typeof selector !== "string") return null;
  let meta = selectorCache.get(selector);
  if (!meta) {
    const keys = selector.replace(/\[(\d+)\]/g, '.$1').split('.');
    const drillKeys = keys.slice(1); const parentKeys = keys.slice(1, -1); const lastKey = keys[keys.length - 1];
    meta = { keys, drillKeys, parentKeys, lastKey, hasMultipleKeys: keys.length > 1, get: compileGetter(drillKeys), getParent: compileGetter(parentKeys) };
    selectorCache.set(selector, meta);
  }
  return meta;
}

export const useNativeSelector = (selector) => {
  const meta = useMemo(() => getMeta(selector), [selector]);
  const getSnapshot = useCallback(() => {
    try {
      if (typeof selector === "function") return selector(s);
      if (meta && meta.hasMultipleKeys) return meta.get(s);
      return s;
    } catch (error) { return undefined; }
  }, [selector, meta]);
  const customSubscribe = useCallback((callback) => subscribe(selector, callback), [selector]);
  return useSyncExternalStore(customSubscribe, getSnapshot, getSnapshot);
};

export const useNativeState = (selector, val = undefined) => {
  try {
    let once = false;
    const meta = useMemo(() => getMeta(selector), [selector]);
    const setSlice = useCallback((newVal = {}) => {
      if (meta.hasMultipleKeys) {
        let slicedS = { ...s };
        let slice = meta.parentKeys.length > 0 ? meta.getParent(slicedS) : slicedS;
        if (slice) { slice[meta.lastKey] = newVal; } else { throw Error(selector.replace(/(\[|\.)[^.\[\]]+\]?$/, '') + " not found"); }
        s = slicedS; notifyUpdate(selector);
      } else { s = { ...s, ...newVal }; notifyUpdate(); }
    }, [meta, selector]);
    const accessor = useCallback((state) => meta.hasMultipleKeys ? meta.get(state) : state, [meta]);
    if (val !== undefined && once === false) { once = undefined; const currentVal = meta.hasMultipleKeys ? meta.get(s) : s; if (currentVal === undefined) setSlice(val); }
    const getSnapshot = useCallback(() => { try { return accessor(s); } catch (error) { return undefined; } }, [accessor]);
    const customSubscribe = useCallback((callback) => subscribe(selector, callback), [selector]);
    const sliced = useSyncExternalStore(customSubscribe, getSnapshot, getSnapshot);
    return [sliced, setSlice];
  } catch (error) {
    throw Error(`Some error occured. Check the useNativeState parameters passed. Make sure <Root/> is intialised.`);
  }
};