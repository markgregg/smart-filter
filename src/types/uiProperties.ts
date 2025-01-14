interface FilterBar {
  /* number of lines to expand the fitler bar */
  expandedLines?: number;
  /* if ture search icon is shown */
  showSearchIcon?: boolean;
  /* if true the undo icon is shown */
  showUndoIcon?: boolean;
  /* hight of the filter bar. Defaults to 30px */
  filterBarHeight?: number;
}

interface Pills {
  /* height of pills. Defaults to 22px */
  pillHeight?: number;
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

export interface UIProperties extends FilterBar, DropDown, Input, Pills { }
