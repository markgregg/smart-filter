import { StoreApi, UseBoundStore, create } from 'zustand';
import { FilterBarState } from '@/types/State';

export const createFilterBarStore = (): UseBoundStore<
  StoreApi<FilterBarState>
> =>
  create<FilterBarState>((set) => ({
    enableExpand: false,
    expanded: false,
    locked: false,
    setEnableExpand: (value: boolean) => set({ enableExpand: value }),
    setExpanded: (value: boolean) => set({ expanded: value }),
    setlocked: (value: boolean) => set({ locked: value }),
  }));
