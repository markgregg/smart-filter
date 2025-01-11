export interface FocusState {
  hasFocus: boolean;
  hasMouse: boolean,
  setHasFocus: (value: boolean) => void;
  setHasMouse: (value: boolean) => void;
}
