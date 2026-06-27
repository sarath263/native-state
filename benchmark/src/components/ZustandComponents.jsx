import { useZustandStore } from '../zustandStore';

export function ZustandCounter({ id }) {
  const count = useZustandStore((s) => s.count);
  return (
    <div className="sub-card">
      <span className="sub-label">Counter #{id}</span>
      <span className="sub-count">{count}</span>
    </div>
  );
}

export function ZustandBadge({ id }) {
  const count = useZustandStore((s) => s.count);
  return (
    <div className="sub-card">
      <span className="sub-label">Badge #{id}</span>
      <span className={`badge zustand-badge ${count > 500 ? 'badge-hot' : ''}`}>{count}</span>
    </div>
  );
}

export function ZustandProgress({ id }) {
  const count = useZustandStore((s) => s.count);
  const pct = count % 101;
  return (
    <div className="sub-card prog-card">
      <div className="prog-header">
        <span className="sub-label">Progress #{id}</span>
        <span className="sub-count small">{count}</span>
      </div>
      <div className="prog-track">
        <div className="prog-fill zustand-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ComplexZustandCounter({ id }) {
  const val = useZustandStore((s) => s.complex?.counters?.nested?.deep?.val ?? 0);
  return (
    <div className="sub-card">
      <span className="sub-label">Nested Val #{id} (Deep)</span>
      <span className="sub-count">{val}</span>
    </div>
  );
}

export function ComplexZustandItems({ id }) {
  const items = useZustandStore((s) => s.complex?.items ?? []);
  const fns = useZustandStore((s) => s.complex?.fns ?? {});
  const info = useZustandStore((s) => s.complex?.info ?? {});

  const totalScore = fns?.sumVals ? fns.sumVals(items) : 0;

  return (
    <div className="sub-card complex-card">
      <div className="complex-header">
        <span className="sub-label">Info: {info?.name} (v{info?.version})</span>
        <span className={`badge zustand-badge ${info?.active ? 'badge-active' : ''}`}>
          {info?.active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="complex-list">
        {items.map((item) => (
          <div key={item.id} className="complex-item">
            <span className="item-txt">
              {fns?.formatItem ? fns.formatItem(item) : `${item.name}: ${item.val}`}
            </span>
          </div>
        ))}
      </div>

      <div className="complex-footer">
        <span className="sub-label">Calculated Sum (fn):</span>
        <span className="sub-count highlight">{totalScore}</span>
      </div>
    </div>
  );
}
