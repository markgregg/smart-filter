import { StoreApi, UseBoundStore, create } from 'zustand';
import { SmartFilterProps, Sort, SortDirection } from '..';
import { SortState } from '@/types/State/sort';


export const createSortStore = (
  props: SmartFilterProps,
): UseBoundStore<StoreApi<SortState>> => {
  const { sort: initialSort, onSortChange } = props;

  return create<SortState>((set) => {
    const setNotify = (
      updateState:
        | SortState
        | Partial<SortState>
        | ((state: SortState) => SortState | Partial<SortState>),
      replace?: false | undefined,
    ) => {
      let sort: Sort[] | null = null;
      if (typeof updateState === 'function') {
        set((state) => {
          const newState = updateState(state);
          ({ sort = null } = newState);
          return newState;
        }, replace);
      } else {
        ({ sort = null } = updateState);
        set(updateState);
      }
      if (sort && onSortChange) {
        onSortChange(sort);
      }
    };

    return {
      sort: initialSort ?? [],
      active: false,
      updateSort: (field: string, sortDirection: SortDirection) => setNotify((state) => {
        const { sort } = state;
        const exisitng = state.sort.find(s => s.field === field);
        return ({
          sort: exisitng?.sortDirection === sortDirection
            ? sort.filter(s => s.field !== field)
            : exisitng
              ? state.sort.map(s => s.field === field ? { ...s, sortDirection } : s)
              : [...state.sort, { field, sortDirection }],
        })

      }),
      removeSort: (field: string) => setNotify((state) => ({
        sort: state.sort.filter(s => s.field !== field),
      })),
      clearSort: () => setNotify(() => ({
        sort: [],
      })),
      setActive: (active: boolean) => set({ active }),
    }
  });
}

