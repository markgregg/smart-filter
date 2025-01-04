export interface FilterBarState {
  enableExpand: boolean;
  expanded: boolean;
  setEnableExpand: (value: boolean) => void;
  setExpanded: (value: boolean) => void;
}