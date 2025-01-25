import { StoreApi, UseBoundStore } from 'zustand';
import { FocusState } from '../../../../../../src/types/State';

export declare const createFocusStore: (showDropdownOnMouseOver?: boolean, dropDownDispalyWhenKeyPressed?: number) => UseBoundStore<StoreApi<FocusState>>;
