import { useEffect, useState } from 'react';
import { useNativeState } from 'native-state-react';
import { useDispatch, useSelector } from 'react-redux';
import { initialComplexState } from './store';
import { useZustandStore } from './zustandStore';

const ITERS = 5000;

function avg(prev, next) {
  return prev ? (prev + next) / 2 : next;
}

function calcOps(iters, ms) {
  return Math.round((iters / ms) * 1000);
}

export function useBenchmarkRunners(tab = 'simple') {
  const [, setNative] = useNativeState("s.native", { nativeCount: 0, nCount: 0 });
  const [rTime, setRt] = useNativeState("s.rt", 0);
  const [cmplx, setComplexNative] = useNativeState("s.complex", initialComplexState);
  
  const countRedux = useSelector(s => s.reduxCount);
  const dispatch = useDispatch();

  const countZustand = useZustandStore(s => s.zustandCount);
  const setZustandCount = useZustandStore(s => s.setZustandCount);
  const zustandInc = useZustandStore(s => s.inc);
  const zustandReset = useZustandStore(s => s.reset);
  const complexZustandUpdate = useZustandStore(s => s.complexUpdate);
  const complexZustandReset = useZustandStore(s => s.complexReset);

  const [results, setResults] = useState({ native: {}, redux: {}, zustand: {} });
  const [complexResults, setComplexResults] = useState({ native: {}, redux: {}, zustand: {} });
  const [running, setRunning] = useState(false);
  const [effectTimes, setEffectTimes] = useState({ native: 0, redux: 0, zustand: 0 });

  useEffect(() => {
    if (rTime) {
      let rt = performance.now() - rTime;
      setEffectTimes(r => ({ ...r, native: rt }));
      setRt(0);
      setRunning(false);
      setTimeout(async () => {
        setRunning(true);
        await new Promise(r => setTimeout(r, 50));
        dispatch({ type: 'SET', val: performance.now() });
      }, 50);
    }
  }, [rTime, tab]);

  useEffect(() => {
    if (countRedux) {
      let rt = performance.now() - countRedux;
      setEffectTimes(r => ({ ...r, redux: rt }));
      dispatch({ type: 'SET', val: 0 });
      setRunning(false);
      setTimeout(async () => {
        setRunning(true);
        await new Promise(r => setTimeout(r, 50));
        setZustandCount(performance.now());
      }, 50);
    }
  }, [countRedux, tab]);

  useEffect(() => {
    if (countZustand) {
      let rt = performance.now() - countZustand;
      setEffectTimes(r => ({ ...r, zustand: rt }));
      setZustandCount(0);
    }
    setRunning(false);
  }, [countZustand, tab]);

  const runResponseTime = async () => {
    setRunning(true);
    await new Promise(r => setTimeout(r, 50));
    setRt(performance.now());
  };

  const runNative = async () => {
    setRunning(true);
    setNative({ nativeCount: 0 });
    await new Promise(r => setTimeout(r, 50));
    const t = performance.now();
    for (let i = 1; i <= ITERS; i++) setNative({ nativeCount: i });
    const ms = performance.now() - t;
    setResults(r => ({ ...r, native: { ...r.native, ms: avg(r.native?.ms, ms), ops: avg(r.native?.ops, calcOps(ITERS, ms)) } }));
    setRunning(false);
  };

  const runRedux = async () => {
    setRunning(true);
    dispatch({ type: 'RESET' });
    await new Promise(r => setTimeout(r, 50));
    const t = performance.now();
    for (let i = 1; i <= ITERS; i++) dispatch({ type: 'INC' });
    const ms = performance.now() - t;
    setResults(r => ({ ...r, redux: { ...r.redux, ms: avg(r.redux?.ms, ms), ops: avg(r.redux?.ops, calcOps(ITERS, ms)) } }));
    setRunning(false);
  };

  const runZustand = async () => {
    setRunning(true);
    zustandReset();
    await new Promise(r => setTimeout(r, 50));
    const t = performance.now();
    for (let i = 1; i <= ITERS; i++) zustandInc();
    const ms = performance.now() - t;
    setResults(r => ({ ...r, zustand: { ...r.zustand, ms: avg(r.zustand?.ms, ms), ops: avg(r.zustand?.ops, calcOps(ITERS, ms)) } }));
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
    setComplexResults(r => ({ ...r, native: { ...r.native, ms: avg(r.native?.ms, ms), ops: avg(r.native?.ops, calcOps(ITERS, ms)) } }));
    setRunning(false);
  };

  const runComplexRedux = async () => {
    setRunning(true);
    dispatch({ type: 'COMPLEX_RESET' });
    await new Promise(r => setTimeout(r, 50));
    const t = performance.now();
    for (let i = 1; i <= ITERS; i++) dispatch({ type: 'COMPLEX_UPDATE', payload: i });
    const ms = performance.now() - t;
    setComplexResults(r => ({ ...r, redux: { ...r.redux, ms: avg(r.redux?.ms, ms), ops: avg(r.redux?.ops, calcOps(ITERS, ms)) } }));
    setRunning(false);
  };

  const runComplexZustand = async () => {
    setRunning(true);
    complexZustandReset();
    await new Promise(r => setTimeout(r, 50));
    const t = performance.now();
    for (let i = 1; i <= ITERS; i++) complexZustandUpdate(i);
    const ms = performance.now() - t;
    setComplexResults(r => ({ ...r, zustand: { ...r.zustand, ms: avg(r.zustand?.ms, ms), ops: avg(r.zustand?.ops, calcOps(ITERS, ms)) } }));
    setRunning(false);
  };

  return {
    ITERS,
    running,
    results,
    complexResults,
    runNative,
    runRedux,
    runZustand,
    runComplexNative,
    runComplexRedux,
    runComplexZustand,
    runResponseTime,
    effectTimes
  };
}

