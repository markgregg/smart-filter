import { StoreApi, UseBoundStore, create } from 'zustand';
import { HintState } from '@/types/State';

export const createHintStore = (): UseBoundStore<StoreApi<HintState>> =>
  create<HintState>((set) => ({
    selectedHintGroup: null,
    selectHintGroup: (value: string) => set({ selectedHintGroup: value }),
    clearSelection: () => set({ selectedHintGroup: null }),
  }));
