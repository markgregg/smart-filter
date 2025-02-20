export type FilterBarSize = 'compact' | 'normal' | 'large';
interface FilterBar {
    showUndoIcon?: boolean;
    size?: FilterBarSize;
}
interface Pills {
    maxValueWidth?: number;
    sortPillWidth?: number;
}
interface DropDown {
    maxDropdownHeight?: number;
    dropdownWidth?: number;
    optionWidth?: number;
    showDropdownOnMouseOver?: boolean;
    dropDownDispalyWhenKeyPressed?: number;
}
interface Input {
    placeholder?: string;
}
export interface UIProperties extends FilterBar, DropDown, Input, Pills {
}
export {};
