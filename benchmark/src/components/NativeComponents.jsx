import { useNativeState } from 'native-state-react';

export function NativeCounter({ id }) {
  const [state] = useNativeState("s.native");
  const count = state?.nativeCount ?? 0;
  return (
    <div className="sub-card">
      <span className="sub-label">Counter #{id}</span>
      <span className="sub-count">{count}</span>
    </div>
  );
}

export function NativeBadge({ id }) {
  const [state] = useNativeState("s.native");
  const count = state?.nativeCount ?? 0;
  return (
    <div className="sub-card">
      <span className="sub-label">Badge #{id}</span>
      <span className={`badge ${count > 500 ? 'badge-hot' : ''}`}>{count}</span>
    </div>
  );
}

export function NativeProgress({ id }) {
  const [state] = useNativeState("s.native");
  const count = state?.nativeCount ?? 0;
  const pct = count % 101;
  return (
    <div className="sub-card prog-card">
      <div className="prog-header">
        <span className="sub-label">Progress #{id}</span>
        <span className="sub-count small">{count}</span>
      </div>
      <div className="prog-track">
        <div className="prog-fill native-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
