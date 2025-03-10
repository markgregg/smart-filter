import { Field } from '../field';
import { Brackets, LogicalOperator, Matcher } from '../matcher';
import { MatcherValue } from '../values';
import { DROP_POSITION } from './drag';

export type ClearCallbackFunction = () => void;
export interface MatcherState {
  clearCallbacks: ClearCallbackFunction[];
  matchers: Matcher[];
  undoBuffer: Matcher[][];
  lastAdd: number | null;
  selectedIndex: number | null;
  selectedMatcher: Matcher | null;
  editPosition: number | null;
  editMatcher: Matcher | null;
  copyMatchers: string[] | null;
  fieldMap: Map<string, Field>;
  setFieldMap: (fieldMap: Map<string, Field>) => void;
  setMatchers: (matchers: Matcher[]) => void;
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
  insertMatchers: (
    matchers: Matcher | Matcher[],
    position: number | null,
  ) => void;
  addBracket: (
    bracket: Brackets,
    position: number | null,
    operator?: LogicalOperator | null,
  ) => void;
  updateMatcher: (matcher: Matcher, ignoreLockedCheck?: true) => void;
  deleteMatcher: (matcher: Matcher) => void;
  deleteMatchers: (matchers: Matcher[]) => void;
  selectMatcher: (key: string) => void;
  selectMatcherForEdit: (key: string) => void;
  clearCopyMatcher: () => void;
  addCopyMatcher: (key: string) => void;
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
  undo: () => void;
}
