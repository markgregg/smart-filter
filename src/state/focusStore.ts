import { StoreApi, UseBoundStore, create } from 'zustand';
import { FocusState } from '@/types/State';
import { DEFAULT_KEYBOARD_DROPDOWN_DISPLAY_TIME } from '@/util/constants';

export const createFocusStore = (
  showDropdownOnMouseOver?: boolean,
  dropDownDispalyWhenKeyPressed?: number
): UseBoundStore<StoreApi<FocusState>> =>
  create<FocusState>((set) => ({
    hasFocus: false,
    hasMouse: false,
    keyboardFocus: false,
    keyboardTimeoutReset: null,
    setHasFocus: (value: boolean) => set({ hasFocus: value }),
    setHasMouse: (value: boolean) => set({ hasMouse: value }),
    setKeyboardFocus: () => {
      if (!showDropdownOnMouseOver || dropDownDispalyWhenKeyPressed === 0) {
        return;
      }
      set({ keyboardFocus: true });
      set((state) => {
        const { keyboardTimeoutReset: currentHandle } = state;
        if (currentHandle) {
          clearTimeout(currentHandle);
        }
        const keyboardTimeoutReset = setTimeout(() => set({ keyboardFocus: false, keyboardTimeoutReset: null }), dropDownDispalyWhenKeyPressed ?? DEFAULT_KEYBOARD_DROPDOWN_DISPLAY_TIME);
        return { keyboardTimeoutReset };
      });
    }
  }));
