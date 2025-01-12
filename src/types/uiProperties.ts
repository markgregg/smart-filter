interface FilterBar {
  expandedLines?: number;
  showSearchIcon?: boolean;
  showUndoIcon?: boolean;
  filterBarHeight?: number;
  pillHeight?: number;
  maxValueWidth?: number;
  sortPillWidth?: number;
  sortOptionWidth?: number;
}

interface DropDown {
  maxDropdownHeight?: number;
  dropdownWidth?: number;
}

interface Input {
  placeholder?: string;
}

export interface UIProperties extends FilterBar, DropDown, Input { }
