import { StoreApi, UseBoundStore, create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { SmartFilterProps } from '@/types';
import { ConfigState } from '@/types/State';
import { uniqueComparions } from '@/util/functions';

export const createConfigStore = ({
  onChange,
  onClear,
  onLock,
  onExpand,
  size,
  maxDropdownHeight,
  dropdownWidth,
  maxValueWidth,
  fields,
  hints,
  operators,
  placeholder,
  allowLocking,
  showUndoIcon,
  debounce,
  pageSize,
  pasteOptions,
  optionWidth,
  showDropdownOnMouseOver,
}: SmartFilterProps): UseBoundStore<StoreApi<ConfigState>> => {
  const uniqueComparisonOps = uniqueComparions(fields, operators ?? []);
  return create<ConfigState>(() => ({
    onChange,
    onClear,
    onLock,
    onExpand,
    size: size ?? 'normal',
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
    comparisons: uniqueComparisonOps ?? [],
    comparisonsMap: new Map(
      (uniqueComparisonOps ?? []).map((o) => [o.symbol, o]),
    ),
    placeholder,
    allowLocking,
    showUndoIcon,
    debounce,
    pageSize,
    pasteOptions,
    optionWidth,
    showDropdownOnMouseOver,
  }));
};
