interface FilterBar {
  expandedLines?: number;
  showSearchIcon?: boolean;
  showUndoIcon?: boolean;
  filterBarHeight?: number;
  pillHeight?: number;
}

interface DropDown {
  maxDropdownHeight?: number;
  dropdownWidth?: number;
}

interface Input {
  placeholder?: string;
}

export interface UICustomisations extends FilterBar, DropDown, Input { };