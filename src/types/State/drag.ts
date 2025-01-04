export interface DragState {
  draggedItem: string;
  dragOverItem: string;
  selectHintGroup: (value: string) => void;
  clearSelection: () => void;
}