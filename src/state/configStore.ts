import { StoreApi, UseBoundStore, create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { SmartFilterProps } from '@/types';
import { ConfigState } from '@/types/State';
import {
  DEFAULT_FILTER_BAR_HEIGHT,
  DEFAULT_PILL_HEIGHT,
} from '@/util/constants';

export const createConfigStore = ({
  matchers,
  onChange,
  sort,
  onSortChange,
  onClear,
  onLock,
  onExpand,
  filterBarHeight,
  pillHeight,
  maxDropdownHeight,
  dropdownWidth,
  maxValueWidth,
  fields,
  hints,
  operators,
  placeholder,
  expandedLines,
  showSearchIcon,
  allowLocking,
  showUndoIcon,
  debounce,
  pageSize,
  pasteOptions,
  sortPillWidth,
  enableSort,
  optionWidth,
  showDropdownOnMouseOver
}: SmartFilterProps): UseBoundStore<StoreApi<ConfigState>> =>
  create<ConfigState>(() => ({
    matchers,
    onChange,
    sort,
    onSortChange,
    onClear,
    onLock,
    onExpand,
    filterBarHeight: filterBarHeight ?? DEFAULT_FILTER_BAR_HEIGHT,
    pillHeight: pillHeight ?? DEFAULT_PILL_HEIGHT,
    maxValueWidth,
    maxDropdownHeight,
    dropdownWidth,
    fields,
    fieldMap: new Map(fields.map((f) => [f.name, f])),
    hints: hints
      ? {
        ...hints,
        hintGroups: hints.hintGroups.map((g) => ({
          ...g,
          hints:
            typeof g.hints === 'function'
              ? g.hints
              : g.hints.map((h) =>
                typeof h === 'string' ? h : { ...h, key: uuidv4() },
              ),
        })),
      }
      : undefined,
    comparisons: operators ?? [],
    comparisonsMap: new Map((operators ?? []).map((o) => [o.symbol, o])),
    placeholder,
    expandedLines,
    showSearchIcon,
    allowLocking,
    showUndoIcon,
    debounce,
    pageSize,
    pasteOptions,
    sortPillWidth,
    enableSort,
    optionWidth,
    showDropdownOnMouseOver,
  }));
