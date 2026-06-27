import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { NativeCounter, NativeBadge, NativeProgress } from './components/NativeComponents';
import { ReduxCounter, ReduxBadge, ReduxProgress } from './components/ReduxComponents';
import { ZustandCounter, ZustandBadge, ZustandProgress, ComplexZustandCounter, ComplexZustandItems } from './components/ZustandComponents';
import { ComplexNativeCounter, ComplexNativeItems, ComplexReduxCounter, ComplexReduxItems } from './components/ComplexComponents';
import { useBenchmarkRunners } from './useBenchmarkRunners';

const N = 1;

function BenchmarkPanel({ title, type, running, results, onRun, iters, children }) {
  return (
    <section className={`metric-card ${type}-card`}>
      <h2>{title}</h2>
      <div className="sub-components">{children}</div>
      <button className="btn-run" disabled={running} onClick={onRun}>
        Run {iters / 1000}k ▶
      </button>
      {results && (
        <div className="result-stats">
          <span>{results?.ms?.toFixed(1)} ms</span>
          <span className="highlight">{Math.round(results.ops).toLocaleString()} ops/s</span>
        </div>
      )}
    </section>
  );
}

function BenchmarkApp() {
  const [tab, setTab] = useState('simple');
  const {
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
  } = useBenchmarkRunners(tab);

  const active = tab === 'simple' ? results : complexResults;
  const maxOps = Math.max(active.native?.ops || 0, active.redux?.ops || 0, active.zustand?.ops || 0, 1);

  const runBoth = async () => {
    for (let i = 0; i < 5; i++) {
      if (tab === 'simple') {
        await runNative();
        await runRedux();
        await runZustand();
      } else {
        await runComplexNative();
        await runComplexRedux();
        await runComplexZustand();
      }
    }
    runResponseTime();
  };

  return (
    <main className="app-container">
      <header>
        <h1>State Benchmark</h1>
        <div className="tabs">
          <button id="tab-simple" className={`tab-btn ${tab === 'simple' ? 'active' : ''}`} onClick={() => setTab('simple')}>
            Simple Counter
          </button>
          <button id="tab-complex" className={`tab-btn ${tab === 'complex' ? 'active' : ''}`} onClick={() => setTab('complex')}>
            Deep Complex State
          </button>
        </div>
        <p className="subtitle">
          {tab === 'simple' ? N * 3 : 2} subscribers · {ITERS.toLocaleString()} updates
        </p>
      </header>

      {(active.native?.ops || active.redux?.ops || active.zustand?.ops) && (
        <section className="chart-section">
          <div className="flex gap-2">
            <h3>Latency (Lower is better)</h3>
            {active.native?.ms !== undefined && <div><span className="bar-label">Native (Latency ) </span><p>
              <span>{active.native?.ms?.toFixed(1)} ms</span>
            </p></div>}
            {active.redux?.ms !== undefined && <div><span className="bar-label">Redux (Latency ) </span><p>
              <span>{active.redux?.ms?.toFixed(1)} ms</span>
            </p></div>}
            {active.zustand?.ms !== undefined && <div><span className="bar-label">Zustand (Latency ) </span><p>
              <span>{active.zustand?.ms?.toFixed(1)} ms</span>
            </p></div>}
          </div>
          <div>
            <h3>Ops / sec (Higher is better)</h3>
            <div className="chart-bars">
              <div className="bar-wrapper">
                <div className="bar native-bar" style={{ height: `${((active.native?.ops || 0) / maxOps) * 100}%` }} />
                <span className="bar-label">Native</span>
              </div>
              <div className="bar-wrapper">
                <div className="bar redux-bar" style={{ height: `${((active.redux?.ops || 0) / maxOps) * 100}%` }} />
                <span className="bar-label">Redux</span>
              </div>
              <div className="bar-wrapper">
                <div className="bar zustand-bar" style={{ height: `${((active.zustand?.ops || 0) / maxOps) * 100}%` }} />
                <span className="bar-label">Zustand</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <h3>Side effect Latency (Lower is better)</h3>
            {active.native && <div><span className="bar-label">Native State </span><p>
              <span> <em className="orange" title='Time to side effect'>{effectTimes.native?.toFixed(3)} ms</em></span>
            </p></div>}
            {active.redux && <div><span className="bar-label">Redux </span><p>
              <span> <em className="orange" title='Time to side effect'>{effectTimes.redux?.toFixed(3)} ms</em></span>
            </p></div>}
            {active.zustand && <div><span className="bar-label">Zustand </span><p>
              <span> <em className="orange" title='Time to side effect'>{effectTimes.zustand?.toFixed(3)} ms</em></span>
            </p></div>}
          </div>
        </section>
      )}

      <div className="metrics-grid">
        <BenchmarkPanel title="Native State" type="native" iters={ITERS} running={running} results={active.native}
          onRun={tab === 'simple' ? runNative : runComplexNative}>
          {tab === 'simple' ? (<>
            {Array.from({ length: N }, (_, i) => <NativeCounter key={i} id={i + 1} />)}
            {Array.from({ length: N }, (_, i) => <NativeBadge key={i} id={i + 1} />)}
            {Array.from({ length: N }, (_, i) => <NativeProgress key={i} id={i + 1} />)}
          </>) : (<>
            <ComplexNativeCounter id={1} />
            <ComplexNativeItems id={1} />
          </>)}
        </BenchmarkPanel>

        <BenchmarkPanel title="Redux" type="redux" iters={ITERS} running={running} results={active.redux}
          onRun={tab === 'simple' ? runRedux : runComplexRedux}>
          {tab === 'simple' ? (<>
            {Array.from({ length: N }, (_, i) => <ReduxCounter key={i} id={i + 1} />)}
            {Array.from({ length: N }, (_, i) => <ReduxBadge key={i} id={i + 1} />)}
            {Array.from({ length: N }, (_, i) => <ReduxProgress key={i} id={i + 1} />)}
          </>) : (<>
            <ComplexReduxCounter id={1} />
            <ComplexReduxItems id={1} />
          </>)}
        </BenchmarkPanel>

        <BenchmarkPanel title="Zustand" type="zustand" iters={ITERS} running={running} results={active.zustand}
          onRun={tab === 'simple' ? runZustand : runComplexZustand}>
          {tab === 'simple' ? (<>
            {Array.from({ length: N }, (_, i) => <ZustandCounter key={i} id={i + 1} />)}
            {Array.from({ length: N }, (_, i) => <ZustandBadge key={i} id={i + 1} />)}
            {Array.from({ length: N }, (_, i) => <ZustandProgress key={i} id={i + 1} />)}
          </>) : (<>
            <ComplexZustandCounter id={1} />
            <ComplexZustandItems id={1} />
          </>)}
        </BenchmarkPanel>
      </div>

      <div className="btn-group center-btns">
        <button id="btn-run-both" className="btn-interactive" disabled={running} onClick={runBoth}>
          {running ? '⏳ Running…' : '⚡ Run All (5× averaged)'}
        </button>
      </div>
      <div className="btn-group center-btns">
        <button id="btn-run-both" className="btn-interactive" disabled={running} onClick={runResponseTime}>
          {(running ? '⏳ Running… ' : '👣 Response time ')}
        </button>
      </div>
    </main>
  );
}

export default function App() {
  return <Provider store={store}><BenchmarkApp /></Provider>;
}
