import { StoreApi, UseBoundStore, create } from 'zustand';
import { ArrayMatcher } from '@/types';
import { ArrayState } from '@/types/State';

export const createArrayStore = (
  pageSize: number,
): UseBoundStore<StoreApi<ArrayState>> =>
  create<ArrayState>((set) => ({
    index: null,
    matcher: null,
    selectedIndex: null,
    setMatcher: (matcher: ArrayMatcher | null) => set({ matcher }),
    selectItem: (selectedIndex: number | null) => set({ selectedIndex }),
    first: () => set({ index: 0 }),
    last: () =>
      set((state) => ({
        index:
          state.matcher !== null && state.matcher.valueArray.length > 0
            ? state.matcher.valueArray.length - 1
            : 0,
      })),
    next: () =>
      set((state) => {
        const { index: currentIndex, matcher } = state;
        if (matcher !== null) {
          const index =
            currentIndex === null ||
            currentIndex >= matcher.valueArray.length - 1
              ? 0
              : currentIndex + 1;
          return { index };
        }
        return {};
      }),
    prev: () =>
      set((state) => {
        const { index: currentIndex, matcher } = state;
        if (matcher !== null) {
          const index =
            currentIndex === null || currentIndex <= 0
              ? matcher.valueArray.length - 1
              : currentIndex - 1;
          return { index };
        }
        return {};
      }),
    nextPage: () =>
      set((state) => {
        const { index: currentIndex, matcher } = state;
        if (matcher !== null) {
          const index =
            currentIndex === null ||
            (currentIndex !== matcher.valueArray.length - 1 &&
              currentIndex + pageSize >= matcher.valueArray.length - 1)
              ? matcher.valueArray.length - 1
              : currentIndex === matcher.valueArray.length - 1
                ? 0
                : currentIndex + pageSize;
          return { index };
        }
        return {};
      }),
    prevPage: () =>
      set((state) => {
        const { index: currentIndex, matcher } = state;
        if (matcher !== null) {
          const index =
            currentIndex === null ||
            (currentIndex !== 0 && currentIndex - pageSize <= 0)
              ? 0
              : currentIndex === 0
                ? matcher.valueArray.length - 1
                : currentIndex - pageSize;
          return { index };
        }
        return {};
      }),
  }));
