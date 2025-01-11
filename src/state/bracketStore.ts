import { StoreApi, UseBoundStore, create } from 'zustand';
import { BracketMatcher, Matcher } from '@/types';
import { BracketState } from '@/types/State';
import { BRACKET } from '@/util/constants';

interface Bracket extends BracketMatcher {
  matchedBracket: string | null;
}

export const createBracketsStore = (): UseBoundStore<StoreApi<BracketState>> =>
  create<BracketState>((set) => ({
    bracketMap: new Map(),
    unmatchedBrackets: new Set(),
    hoverBracket: null,
    matchingHover: null,
    setHoverBracket: (hoverBracket: string | null) =>
      set((state) => ({
        hoverBracket,
        matchingHover: state.bracketMap.get(hoverBracket ?? '') ?? null,
      })),
    updateBracekts: (matchers: Matcher[]) => {
      const brackets = matchers
        .filter((m) => BRACKET in m)
        .map((b) => ({ ...(b as BracketMatcher), matchedBracket: null }));
      if (brackets.length > 0) {
        let index = 0;
        while (index < brackets.length) {
          if (brackets[index].bracket === '(') {
            index = findMatch(brackets, index);
          } else {
            index += 1;
          }
        }
      }
      const bracketMap = new Map<string, string>(
        brackets
          .filter((b) => b.matchedBracket !== null)
          .map((b) => [b.key, b.matchedBracket ?? '']),
      );
      const unmatchedBrackets = new Set(
        brackets.filter((b) => b.matchedBracket === null).map((b) => b.key),
      );
      set({ bracketMap, unmatchedBrackets });
    },
  }));

const findMatch = (brackets: Bracket[], index: number): number => {
  let matchIndex = index + 1;
  while (matchIndex < brackets.length) {
    if (brackets[matchIndex].bracket === '(') {
      matchIndex = findMatch(brackets, matchIndex);
    } else if (brackets[matchIndex].matchedBracket === null) {
      brackets[index].matchedBracket = brackets[matchIndex].key;
      brackets[matchIndex].matchedBracket = brackets[index].key;
      return matchIndex;
    } else {
      matchIndex += 1;
    }
  }
  return matchIndex;
};
