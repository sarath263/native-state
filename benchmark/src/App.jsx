import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { NativeCounter, NativeBadge, NativeProgress } from './components/NativeComponents';
import { ReduxCounter, ReduxBadge, ReduxProgress } from './components/ReduxComponents';
import { ComplexNativeCounter, ComplexNativeItems, ComplexReduxCounter, ComplexReduxItems } from './components/ComplexComponents';
import { useBenchmarkRunners } from './useBenchmarkRunners';

const N = 2;

function BenchmarkPanel({ title, isNative, running, results, onRun, iters, children }) {
  return (
    <section className={`metric-card ${isNative ? 'native-card' : 'redux-card'}`}>
      <h2>{title}</h2>
      <div className="sub-components">{children}</div>
      <button className="btn-run" disabled={running} onClick={onRun}>
        Run {iters / 1000}k ▶
      </button>
      {results && (
        <div className="result-stats">
          <span>{results.ms.toFixed(1)} ms</span>
          <span className="highlight">{Math.round(results.ops).toLocaleString()} ops/s</span>
        </div>
      )}
    </section>
  );
}

function BenchmarkApp() {
  const [tab, setTab] = useState('simple');
  const { ITERS, running, results, complexResults, runNative, runRedux, runComplexNative, runComplexRedux } = useBenchmarkRunners();

  const active = tab === 'simple' ? results : complexResults;
  const maxOps = Math.max(active.native?.ops || 0, active.redux?.ops || 0, 1);

  const runBoth = () => {
    for (let i = 0; i < 5; i++) {
      if (tab === 'simple') Promise.all([runNative(), runRedux()]);
      else Promise.all([runComplexNative(), runComplexRedux()]);
    }
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

      {(active.native || active.redux) && (
        <section className="chart-section">
          <div className="flex gap-2">
            <h3>Latency (Lower is better)</h3>
            {active.native && <div><span className="bar-label">Native</span><p>{active.native.ms.toFixed(1)} ms</p></div>}
            {active.redux && <div><span className="bar-label">Redux</span><p>{active.redux.ms.toFixed(1)} ms</p></div>}
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
            </div>
          </div>
        </section>
      )}

      <div className="metrics-grid">
        <BenchmarkPanel title="Native State" isNative iters={ITERS} running={running} results={active.native}
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

        <BenchmarkPanel title="Redux" isNative={false} iters={ITERS} running={running} results={active.redux}
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
      </div>

      <div className="btn-group center-btns">
        <button id="btn-run-both" className="btn-interactive" disabled={running} onClick={runBoth}>
          {running ? '⏳ Running…' : '⚡ Run Both (5× averaged)'}
        </button>
      </div>
    </main>
  );
}

export default function App() {
  return <Provider store={store}><BenchmarkApp /></Provider>;
}
