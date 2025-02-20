import { StoreApi, UseBoundStore } from 'zustand';
import { SmartFilterProps } from '../../../../../../src/types';
import { ConfigState } from '../../../../../../src/types/State';

export declare const createConfigStore: ({ onChange, onSortChange, onClear, onLock, onExpand, size, maxDropdownHeight, dropdownWidth, maxValueWidth, fields, hints, operators, placeholder, allowLocking, showUndoIcon, debounce, pageSize, pasteOptions, sortPillWidth, enableSort, optionWidth, showDropdownOnMouseOver, }: SmartFilterProps) => UseBoundStore<StoreApi<ConfigState>>;
