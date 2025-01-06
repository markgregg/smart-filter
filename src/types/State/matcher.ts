import { Brackets, LogicalOperator, Matcher } from '../matcher';
import { MatcherValue } from '../values';
import { DROP_POSITION } from './drag';

export type ClearCallbackFunction = () => void;
export interface MatcherState {
  clearCallbacks: ClearCallbackFunction[];
  matchers: Matcher[];
  selectedIndex: number | null;
  selectedMatcher: Matcher | null;
  focus: boolean;
  editPosition: number | null;
  editMatcher: Matcher | null;
  addValue: ({
    value,
    position,
    operator,
    comparison,
    dontAppend,
  }: {
    value: MatcherValue;
    position: number | null;
    operator?: LogicalOperator;
    comparison?: string;
    dontAppend?: true;
  }) => void;
  addBracket: (bracket: Brackets, position: number | null) => void;
  updateMatcher: (matcher: Matcher) => void;
  deleteMatcher: (matcher: Matcher) => void;
  selectMatcher: (key: string) => void;
  selectMatcherForEdit: (key: string) => void;
  moveTo: (from: number, to: number, position: DROP_POSITION) => void;
  clearMatchers: () => void;
  addClearCallback: (callback: ClearCallbackFunction) => void;
  removeClearCallback: (callback: ClearCallbackFunction) => void;
  clearSelections: () => void;
  clearEditPosition: () => void;
  clearEditMatcher: () => void;
  lockMatchers: () => void;
  unlockMatchers: () => void;
  next: () => void;
  prev: () => void;
  first: () => void;
  last: () => void;
}
