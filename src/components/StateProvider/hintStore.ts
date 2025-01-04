import { HintState } from "@/types/State";
import { StoreApi, UseBoundStore, create } from "zustand";

export const createHintStore = (): UseBoundStore<StoreApi<HintState>> => {
  return create<HintState>((set) => ({
    selectedHintGroup: null,
    selectHintGroup: (value: string) => set({ selectedHintGroup: value }),
    clearSelection: () => set({ selectedHintGroup: null }),
  }));
}