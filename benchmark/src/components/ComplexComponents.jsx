import { useNativeState } from 'native-state-react';
import { useSelector } from 'react-redux';

// --- NATIVE STATE COMPLEX COMPONENTS ---

export function ComplexNativeCounter({ id }) {
  const [val] = useNativeState('s.complex.counters.nested.deep.val', 0);
  
  return (
    <div className="sub-card">
      <span className="sub-label">Nested Val #{id} (Deep)</span>
      <span className="sub-count">{val}</span>
    </div>
  );
}

export function ComplexNativeItems({ id }) {
  const [items] = useNativeState('s.complex.items', []);
  const [fns] = useNativeState('s.complex.fns', {});
  const [info] = useNativeState('s.complex.info', {});

  const totalScore = fns?.sumVals && items ? fns.sumVals(items) : 0;

  return (
    <div className="sub-card complex-card">
      <div className="complex-header">
        <span className="sub-label">Info: {info?.name} (v{info?.version})</span>
        <span className={`badge ${info?.active ? 'badge-active' : ''}`}>
          {info?.active ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <div className="complex-list">
        {items && items.map((item) => (
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

// --- REDUX COMPLEX COMPONENTS ---

export function ComplexReduxCounter({ id }) {
  const val = useSelector(s => s.complex?.counters?.nested?.deep?.val ?? 0);
  
  return (
    <div className="sub-card">
      <span className="sub-label">Nested Val #{id} (Deep)</span>
      <span className="sub-count">{val}</span>
    </div>
  );
}

export function ComplexReduxItems({ id }) {
  const items = useSelector(s => s.complex?.items ?? []);
  const fns = useSelector(s => s.complex?.fns ?? {});
  const info = useSelector(s => s.complex?.info ?? {});

  const totalScore = fns?.sumVals ? fns.sumVals(items) : 0;

  return (
    <div className="sub-card complex-card">
      <div className="complex-header">
        <span className="sub-label">Info: {info?.name} (v{info?.version})</span>
        <span className={`badge redux-badge ${info?.active ? 'badge-active' : ''}`}>
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
