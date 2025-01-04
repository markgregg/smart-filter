import { DragState } from "@/types/State";
import { StoreApi, UseBoundStore, create } from "zustand";

export const createDragStore = (): UseBoundStore<StoreApi<DragState>> => {
  return create<FilterBarState>((set) => ({
    enableExpand: false,
    expanded: false,
    setEnableExpand: (value: boolean) => set({ enableExpand: value }),
    setExpanded: (value: boolean) => set({ expanded: value }),
  }));
}