import { FocusState } from "@/types/State";
import { StoreApi, UseBoundStore, create } from "zustand";

export const createFocusStore = (): UseBoundStore<StoreApi<FocusState>> => {
  return create<FocusState>((set) => ({
    hasFocus: false,
    setHasFocus: (value: boolean) => set({ hasFocus: value }),
  }));
}