export type FilterBarSize = 'compact' | 'normal' | 'large';

interface FilterBar {
  /* if true the undo icon is shown */
  showUndoIcon?: boolean;
  /* size of the filter bar */
  size?: FilterBarSize;
}

interface Pills {
  /* maxium pill width */
  maxValueWidth?: number;
  /* maxium width of the sort pill. Defaults to 90px */
  sortPillWidth?: number;
}

interface DropDown {
  /* max height of the dropdown */
  maxDropdownHeight?: number;
  /* max width of the dropdown */
  dropdownWidth?: number;
  /* width of option text in dropdown */
  optionWidth?: number;
  /* only show dropdown on mouseover */
  showDropdownOnMouseOver?: boolean;
  /* if mouseover for dropdown is true then this is time the dropdown will be display in repsonse to a key press*, 0 no time */
  dropDownDispalyWhenKeyPressed?: number;
}

interface Input {
  /* placeholder for the search input */
  placeholder?: string;
}

export interface UIProperties extends FilterBar, DropDown, Input, Pills {}
