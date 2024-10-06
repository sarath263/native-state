import {
  useCallback,
  useSyncExternalStore,
} from "react";

const initialState = {};
const listeners = new Set();
let s = initialState,
  setS = (newState = {}) => {
    s = Object.assign({}, s, newState);
    listeners.forEach((listener) => listener());
  }, 
  first=true;

export function Root({ children, initial = initialState }) {
  if(first){
    s=initial;
    listeners.forEach((l) => l());
    first=false;
    setS=useCallback((newS = {}) => {
      s = Object.assign({}, s, newS);
      listeners.forEach((l) => l());
    }, []);
  }
  return null;
}

export const useSelector = (selector) => {
  selector = useCallback(selector, []);
  const subscribe = useCallback((callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }, []);
  const sliced = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return selector(s);
      } catch (error) {
        return undefined;
      }
    },
    () => {
      try {
        return selector(s);
      } catch (error) {
        return undefined;
      }
    }
  );

  return [sliced, setS];
};
