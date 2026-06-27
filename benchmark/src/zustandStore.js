import { create } from 'zustand';
import { initialComplexState } from './store';

export const useZustandStore = create((set) => ({
  count: 0,
  zustandCount: 0,
  complex: {
    ...initialComplexState,
  },
  inc: () => set((state) => ({ count: state.count + 1 })),
  setZustandCount: (val) => set({ zustandCount: val }),
  reset: () => set({ count: 0 }),
  complexUpdate: (payload) =>
    set((state) => ({
      complex: {
        ...state.complex,
        counters: {
          ...state.complex.counters,
          nested: {
            ...state.complex.counters.nested,
            deep: {
              ...state.complex.counters.nested.deep,
              val: payload,
            },
          },
        },
        items: state.complex.items.map((item, idx) => ({
          ...item,
          val: idx === 0 ? payload : payload * 2,
        })),
      },
    })),
  complexReset: () =>
    set({
      complex: {
        ...initialComplexState,
      },
    }),
}));
