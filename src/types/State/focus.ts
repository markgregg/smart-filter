export interface FocusState {
  hasFocus: boolean;
  hasMouse: boolean;
  keyboardFocus: boolean;
  keyboardTimeoutReset: NodeJS.Timeout | null;
  setHasFocus: (value: boolean) => void;
  setHasMouse: (value: boolean) => void;
  setKeyboardFocus: () => void;
}
