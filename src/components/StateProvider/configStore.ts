import { SmartFilterProps } from "@/types";
import { ConfigState } from "@/types/State";
import { DEFAULT_FILTER_BAR_HEIGHT, DEFAULT_PILL_HEIGHT } from "@/util/constants";
import { StoreApi, UseBoundStore, create } from "zustand";

export const createConfigStore = ({
  filterBarHeight,
  pillHeight,
  maxDropdownHeight,
  dropdownWidth,
  fields,
  hints,
  operators,
  placeholder,
  expandedLines,
  showSearchIcon,
  allowLocking,
  showUndoIcon,
}: SmartFilterProps): UseBoundStore<StoreApi<ConfigState>> => {

  return create<ConfigState>(() => ({
    filterBarHeight: filterBarHeight ?? DEFAULT_FILTER_BAR_HEIGHT,
    pillHeight: pillHeight ?? DEFAULT_PILL_HEIGHT,
    maxDropdownHeight,
    dropdownWidth,
    fields,
    fieldMap: new Map(fields.map((f) => [f.name, f])),
    hints,
    comparisons: operators ?? [],
    comparisonsMap: new Map((operators ?? []).map((o) => [o.symbol, o])),
    placeholder,
    expandedLines,
    showSearchIcon,
    allowLocking,
    showUndoIcon,
  }));
}