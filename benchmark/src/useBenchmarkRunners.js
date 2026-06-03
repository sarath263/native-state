import { useState } from 'react';
import { useNativeState } from 'native-state-react';
import { useDispatch } from 'react-redux';
import { initialComplexState } from './store';

const ITERS = 5000;

function avg(prev, next) {
  return prev ? (prev + next) / 2 : next;
}

function calcOps(iters, ms) {
  return Math.round((iters / ms) * 1000);
}

export function useBenchmarkRunners() {
  const [, setNative] = useNativeState("s.native", { nativeCount: 0 });
  const [, setComplexNative] = useNativeState("s.complex", initialComplexState);
  const dispatch = useDispatch();

  const [results, setResults] = useState({ native: null, redux: null });
  const [complexResults, setComplexResults] = useState({ native: null, redux: null });
  const [running, setRunning] = useState(false);

  const runNative = async () => {
    setRunning(true);
    setNative({ nativeCount: 0 });
    await new Promise(r => setTimeout(r, 50));
    const t = performance.now();
    for (let i = 1; i <= ITERS; i++) setNative({ nativeCount: i });
    const ms = performance.now() - t;
    setResults(r => ({ ...r, native: { ms: avg(r.native?.ms, ms), ops: avg(r.native?.ops, calcOps(ITERS, ms)) } }));
    setRunning(false);
  };

  const runRedux = async () => {
    setRunning(true);
    dispatch({ type: 'RESET' });
    await new Promise(r => setTimeout(r, 50));
    const t = performance.now();
    for (let i = 1; i <= ITERS; i++) dispatch({ type: 'INC' });
    const ms = performance.now() - t;
    setResults(r => ({ ...r, redux: { ms: avg(r.redux?.ms, ms), ops: avg(r.redux?.ops, calcOps(ITERS, ms)) } }));
    setRunning(false);
  };

  const runComplexNative = async () => {
    setRunning(true);
    setComplexNative(initialComplexState);
    await new Promise(r => setTimeout(r, 50));
    const t = performance.now();
    let cur = { ...initialComplexState };
    for (let i = 1; i <= ITERS; i++) {
      cur = {
        ...cur,
        counters: { ...cur.counters, nested: { ...cur.counters.nested, deep: { val: i } } },
        items: [{ ...cur.items[0], val: i }, { ...cur.items[1], val: i * 2 }]
      };
      setComplexNative(cur);
    }
    const ms = performance.now() - t;
    setComplexResults(r => ({ ...r, native: { ms: avg(r.native?.ms, ms), ops: avg(r.native?.ops, calcOps(ITERS, ms)) } }));
    setRunning(false);
  };

  const runComplexRedux = async () => {
    setRunning(true);
    dispatch({ type: 'COMPLEX_RESET' });
    await new Promise(r => setTimeout(r, 50));
    const t = performance.now();
    for (let i = 1; i <= ITERS; i++) dispatch({ type: 'COMPLEX_UPDATE', payload: i });
    const ms = performance.now() - t;
    setComplexResults(r => ({ ...r, redux: { ms: avg(r.redux?.ms, ms), ops: avg(r.redux?.ops, calcOps(ITERS, ms)) } }));
    setRunning(false);
  };

  return { ITERS, running, results, complexResults, runNative, runRedux, runComplexNative, runComplexRedux };
}
