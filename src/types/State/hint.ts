export interface HintState {
  selectedHintGroup: string | null;
  selectHintGroup: (value: string) => void;
  clearSelection: () => void;
}
