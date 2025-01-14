import { StoreApi, UseBoundStore, create } from 'zustand';
import { DROP_POSITION, DragState } from '@/types/State';

export const createMatcherDragStore = <T>(): UseBoundStore<
  StoreApi<DragState<T>>
> =>
  create<DragState<T>>((set) => ({
    draggedItem: null,
    dragOverItem: null,
    setDragItem: (item: T, index: number) =>
      set({ draggedItem: { item, index } }),
    setDraggedOverItem: (item: T, index: number, position: DROP_POSITION) =>
      set({ dragOverItem: { item, index, position } }),
    clearDragOverItem: () => set({ dragOverItem: null }),
    clearItems: () => set({ dragOverItem: null, draggedItem: null }),
  }));
