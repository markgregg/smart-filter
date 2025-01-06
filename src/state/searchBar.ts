import { StoreApi, UseBoundStore, create } from 'zustand';
import { SearchBarState } from '@/types/State/searchBar';

export const createSearchBarStore = (): UseBoundStore<
  StoreApi<SearchBarState>
> =>
  create<SearchBarState>((set) => ({
    text: '',
    setText: (text: string) => set(() => ({ text })),
  }));
