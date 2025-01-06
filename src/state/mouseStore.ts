import { StoreApi, UseBoundStore, create } from 'zustand';
import { MouseState } from '@/types/State';

export const createMouseStore = (): UseBoundStore<StoreApi<MouseState>> =>
  create<MouseState>((set) => ({
    hasMouse: false,
    setHasMouse: (value: boolean) => set({ hasMouse: value }),
  }));
