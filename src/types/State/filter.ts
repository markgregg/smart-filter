export interface FilterBarState {
  enableExpand: boolean;
  expanded: boolean;
  locked: boolean;
  setEnableExpand: (value: boolean) => void;
  setExpanded: (value: boolean) => void;
  setlocked: (value: boolean) => void;
}
