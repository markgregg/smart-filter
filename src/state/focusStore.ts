import { StoreApi, UseBoundStore, create } from 'zustand';
import { FocusState } from '@/types/State';

export const createFocusStore = (): UseBoundStore<StoreApi<FocusState>> =>
  create<FocusState>((set) => ({
    hasFocus: false,
    setHasFocus: (value: boolean) => set({ hasFocus: value }),
  }));
