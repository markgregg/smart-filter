import { Brackets, LogicalOperator, Matcher } from "../matcher";
import { MatcherValue } from "../values";

export interface MatcherState {
  matchers: Matcher[];
  selectedIndex: number | null;
  selectedMatcher: Matcher | null;
  editPosition: number | null;
  editMatcher: Matcher | null;
  addValue: (value: MatcherValue, position: number | null, operator?: LogicalOperator, comparison?: string) => void;
  addBracket: (bracket: Brackets, position: number | null) => void;
  updateMatcher: (matcher: Matcher) => void;
  deleteMatcher: (matcher: Matcher) => void;
  clearMatchers: () => void;
  selectMatcher: (key: string) => void;
  selectMatcherForEdit: (key: string) => void;
  clearSelections: () => void;
  clearEditPosition: () => void;
  next: () => void;
  prev: () => void;
  first: () => void;
  last: () => void;
}
