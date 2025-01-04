import { MouseState } from "@/types/State";
import { StoreApi, UseBoundStore, create } from "zustand";

export const createMouseStore = (): UseBoundStore<StoreApi<MouseState>> => {
  return create<MouseState>((set) => ({
    hasMouse: false,
    setHasMouse: (value: boolean) => set({ hasMouse: value }),
  }));
}