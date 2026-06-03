import { useSelector } from 'react-redux';

export function ReduxCounter({ id }) {
  const count = useSelector(s => s.count);
  return (
    <div className="sub-card">
      <span className="sub-label">Counter #{id}</span>
      <span className="sub-count">{count}</span>
    </div>
  );
}

export function ReduxBadge({ id }) {
  const count = useSelector(s => s.count);
  return (
    <div className="sub-card">
      <span className="sub-label">Badge #{id}</span>
      <span className={`badge redux-badge ${count > 500 ? 'badge-hot' : ''}`}>{count}</span>
    </div>
  );
}

export function ReduxProgress({ id }) {
  const count = useSelector(s => s.count);
  const pct = count % 101;
  return (
    <div className="sub-card prog-card">
      <div className="prog-header">
        <span className="sub-label">Progress #{id}</span>
        <span className="sub-count small">{count}</span>
      </div>
      <div className="prog-track">
        <div className="prog-fill redux-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
