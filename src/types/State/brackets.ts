import { Matcher } from '../matcher';

export interface BracketState {
  bracketMap: Map<string, string>;
  unmatchedBrackets: Set<string>;
  hoverBracket?: string | null;
  matchingHover?: string | null;
  setHoverBracket: (hoverBracket: string | null) => void;
  updateBracekts: (matchers: Matcher[]) => void;
}
