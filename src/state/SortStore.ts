import { StoreApi, UseBoundStore, create } from 'zustand';
import { Sort, SortDirection } from '..';
import { SortState } from '@/types/State/sort';
import { DROP_POSITION } from '@/types/State';

export const createSortStore = (): UseBoundStore<StoreApi<SortState>> =>
  create<SortState>((set) => ({
    sort: [],
    active: false,
    setSort: (sort: Sort[]) => set({ sort }),
    updateSort: (field: string, sortDirection: SortDirection) =>
      set((state) => {
        const { sort } = state;
        const exisitng = state.sort.find((s) => s.field === field);
        return {
          sort:
            exisitng?.sortDirection === sortDirection
              ? sort.filter((s) => s.field !== field)
              : exisitng
                ? state.sort.map((s) =>
                  s.field === field ? { ...s, sortDirection } : s,
                )
                : [...state.sort, { field, sortDirection }],
        };
      }),
    removeSort: (field: string) =>
      set((state) => {
        const sort = state.sort.filter((s) => s.field !== field);
        return ({
          sort,
          active: state.active && sort.length > 0,
        });
      }),
    clearSort: () =>
      set(() => ({
        sort: [],
        active: false,
      })),
    setActive: (active: boolean) => set({ active }),
    moveTo: (from: number, to: number, position: DROP_POSITION) =>
      set((state) => {
        const { sort: currentSort } = state;
        if (
          from >= 0 &&
          from < currentSort.length &&
          to >= 0 &&
          to < currentSort.length
        ) {
          const sortItem = currentSort[from];
          const toPos = position === 'before' ? to : to + 1;
          if (from > to) {
            currentSort.splice(from, 1);
            currentSort.splice(toPos, 0, sortItem);
          } else {
            currentSort.splice(toPos, 0, sortItem);
            currentSort.splice(from, 1);
          }
          const sort = [...currentSort];
          return { sort };
        }
        return {};
      }),
    moveUp: (index: number) => {
      if (index > 0) {
        set((state) => {
          const item = state.sort.splice(index, 1);
          state.sort.splice(index - 1, 0, item[0]);
          return { sort: [...state.sort] };
        });
      }
    },
    moveDown: (index: number) => set((state) => {
      if (index < state.sort.length - 1) {
        const item = state.sort.splice(index, 1);
        state.sort.splice(index + 1, 0, item[0]);
        return { sort: [...state.sort] };
      }
      return {};
    })
  })
  );