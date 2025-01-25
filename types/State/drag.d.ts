export type DROP_POSITION = 'before' | 'after';
export interface DragItem<T> {
    item: T;
    index: number;
    position?: DROP_POSITION;
}
export interface DragState<T> {
    draggedItem: DragItem<T> | null;
    dragOverItem: DragItem<T> | null;
    setDragItem: (item: T, index: number) => void;
    setDraggedOverItem: (item: T, index: number, position: DROP_POSITION) => void;
    clearDragOverItem: () => void;
    clearItems: () => void;
}
