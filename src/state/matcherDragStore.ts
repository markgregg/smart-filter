import { StoreApi, UseBoundStore, create } from 'zustand';
import { Matcher } from '@/types';
import { DROP_POSITION, DragState } from '@/types/State';

export const createMatcherDragStore = (): UseBoundStore<
  StoreApi<DragState<Matcher>>
> =>
  create<DragState<Matcher>>((set) => ({
    draggedItem: null,
    dragOverItem: null,
    setDragItem: (item: Matcher, index: number) =>
      set({ draggedItem: { item, index } }),
    setDraggedOverItem: (
      item: Matcher,
      index: number,
      position: DROP_POSITION,
    ) => set({ dragOverItem: { item, index, position } }),
    clearItems: () => set({ dragOverItem: null, draggedItem: null }),
  }));
