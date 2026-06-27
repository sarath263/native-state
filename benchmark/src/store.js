import { createStore } from 'redux';

export const initialComplexState = {
  counters: {
    nested: {
      deep: {
        val: 0
      }
    }
  },
  info: {
    name: "Complex Benchmark",
    active: true,
    version: 1
  },
  items: [
    { id: 1, val: 10, name: "Item A" },
    { id: 2, val: 20, name: "Item B" }
  ],
  fns: {
    formatItem: (item) => `${item.name} (${item.val})`,
    sumVals: (items) => items.reduce((sum, item) => sum + item.val, 0)
  }
};

const reducer = (state = { count: 0, reduxCount: 0, complex: initialComplexState }, action) => {
  if (action.type === 'INC') return { ...state, count: state.count + 1 };
  if (action.type === 'SET') return { ...state, reduxCount: action?.val || 0 };
  if (action.type === 'RESET') return { ...state, count: 0 };

  if (action.type === 'COMPLEX_UPDATE') {
    return {
      ...state,
      complex: {
        ...state.complex,
        counters: {
          ...state.complex.counters,
          nested: {
            ...state.complex.counters.nested,
            deep: {
              ...state.complex.counters.nested.deep,
              val: action.payload
            }
          }
        },
        items: state.complex.items.map((item, idx) => ({
          ...item,
          val: idx === 0 ? action.payload : action.payload * 2
        }))
      }
    };
  }

  if (action.type === 'COMPLEX_RESET') {
    return {
      ...state,
      complex: {
        ...initialComplexState
      }
    };
  }

  return state;
};

export const store = createStore(reducer);
