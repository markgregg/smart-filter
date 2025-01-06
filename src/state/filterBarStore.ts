import { StoreApi, UseBoundStore, create } from 'zustand';
import { SmartFilterProps } from '@/types';
import { FilterBarState } from '@/types/State';

export const createFilterBarStore = ({
  onLock,
  onExpand,
}: SmartFilterProps): UseBoundStore<StoreApi<FilterBarState>> =>
  create<FilterBarState>((set) => ({
    enableExpand: false,
    expanded: false,
    locked: false,
    setEnableExpand: (value: boolean) => set({ enableExpand: value }),
    setExpanded: (value: boolean) => {
      set({ expanded: value });
      if (onExpand) {
        onExpand(value);
      }
    },
    setlocked: (value: boolean) => {
      set({ locked: value });
      if (onLock) {
        onLock(value);
      }
    },
  }));
