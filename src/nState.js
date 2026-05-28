
import {
  useCallback,
  useSyncExternalStore,
  useMemo,
} from "react";

const initialState = {};
const listeners = new Set();
let s = initialState;
let first = true;

const subscribe = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

export function Root({ children = null, initial = initialState }) {
  if (first) {
    s = initial;
    listeners.forEach((l) => l());
    first = false;
  }
  return children;
}

export const useNativeSelector = (selector) => {
  const getSnapshot = useCallback(() => {
    try {
      return selector(s);
    } catch (error) {
      return undefined;
    }
  }, [selector]);

  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot
  );
};

function getValueByPath(obj, keys) {
  //  Drill down into the object
  return keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export const useNativeState = (selector, val = undefined) => {
  try {
    const keys = useMemo(() => {
      return selector.replace(/\[(\d+)\]/g, '.$1').split('.');
    }, [selector]);

    const setSlice = useCallback((newVal = {}) => {
      if (keys.length > 1) {
        let slicedS = Object.assign({}, s);
        let slice = slicedS;
        slice = getValueByPath(slice, keys.slice(1, -1));
        if (slice) {
          slice[keys[keys.length - 1]] = newVal;
        } else {
          throw Error(selector.replace(/(\[|\.)[^.\[\]]+\]?$/, '') + " not found");
        }
        s = slicedS;
        listeners.forEach((l) => l());
      } else {
        s = Object.assign({}, s, newVal);
        listeners.forEach((l) => l());
      }
    }, [keys, selector]);

    const accessor = useCallback((state) => {
      if (keys.length > 1) {
        let slice = { ...state }
        slice = getValueByPath(slice, keys.slice(1));
        return slice;
      }
      return state;
    }, [keys]);


    if (val !== undefined && first === false) {
      first = undefined;
      const currentVal = keys.length > 1 ? getValueByPath(s, keys.slice(1)) : s;
      if (currentVal === undefined) {
        setSlice(val);
      }
    }



    const getSnapshot = useCallback(() => {
      try {
        return accessor(s);
      } catch (error) {
        return undefined;
      }
    }, [accessor]);

    const sliced = useSyncExternalStore(
      subscribe,
      getSnapshot,
      getSnapshot
    );

    return [sliced, setSlice];

  } catch (error) {
    throw Error(`Some error occured. Check the useNativeState parameters passed. Make sure <Root/> is intialised.`);
  }
};

