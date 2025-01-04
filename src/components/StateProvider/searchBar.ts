import { SearchBarState } from "@/types/State";
import { StoreApi, UseBoundStore, create } from "zustand";

export const createSearchBarStore = (): UseBoundStore<StoreApi<SearchBarState>> => {
  return create<SearchBarState>((set) => ({
    text: '',
    setText: (text: string) => set(() => ({ text })),
  }));
}