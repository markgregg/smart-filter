import { StoreApi, UseBoundStore } from 'zustand';
import { SmartFilterProps } from '../../../../../../src/types';
import { ConfigState } from '../../../../../../src/types/State';

export declare const createConfigStore: ({ onChange, onClear, onLock, onExpand, size, maxDropdownHeight, dropdownWidth, maxValueWidth, fields, hints, operators, placeholder, allowLocking, showUndoIcon, debounce, pageSize, pasteOptions, optionWidth, showDropdownOnMouseOver, disabled, }: SmartFilterProps) => UseBoundStore<StoreApi<ConfigState>>;
