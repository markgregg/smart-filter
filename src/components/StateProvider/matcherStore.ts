import { ArrayMatcher, Brackets, Field, LogicalOperator, Matcher, SmartFilterProps } from "@/types";
import { DROP_POSITION, MatcherState } from "@/types/State";
import { MatcherValue } from "@/types/values";
import { AND } from "@/util/constants";
import { StoreApi, UseBoundStore, create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export const createMatcherStore = (props: SmartFilterProps): UseBoundStore<StoreApi<MatcherState>> => {
  const { fields, matchers, onChange } = props;
  const fieldMap = new Map(fields.map((f) => [f.name, f]));

  return create<MatcherState>((set) => {
    const setNotify = (updateState: MatcherState | Partial<MatcherState> | ((state: MatcherState) => MatcherState | Partial<MatcherState>), replace?: false | undefined) => {
      let matchers: Matcher[] | null = null;
      if (typeof updateState === 'function') {
        set((state) => {
          const newState = updateState(state);
          ({ matchers = null } = newState);
          return newState;
        }, replace);
      } else {
        ({ matchers = null } = updateState);
        set(updateState);
      }
      if (matchers && onChange) {
        onChange(matchers);
      }
    }

    return ({
      clearCallbacks: [],
      matchers: matchers ?? [],
      selectedIndex: null,
      selectedMatcher: null,
      editPosition: null,
      editMatcher: null,
      addValue: (value: MatcherValue, position: number | null, operator?: LogicalOperator, comparison?: string) => {
        setNotify((state) => {
          return updateMatchers(state.matchers, fieldMap, value, state.selectedMatcher, position, operator, comparison);
        });
      },
      addBracket: (bracket: Brackets, position: number | null, operator?: LogicalOperator) => {
        const bracketMatcher = { key: uuidv4(), bracket, operator: operator ?? AND };
        setNotify((state) => updateMatcherList(state.matchers, bracketMatcher, position, state.selectedMatcher !== null));
      },
      updateMatcher: (matcher: Matcher) => {
        if (!matcher.locked) {
          setNotify((state) => matcher.key === state.selectedMatcher?.key
            ? ({ matchers: state.matchers.map(m => m.key === matcher.key ? matcher : m), selectedMatcher: matcher })
            : ({ matchers: state.matchers.map(m => m.key === matcher.key ? matcher : m) }));
        }
      },
      deleteMatcher: (matcher: Matcher) => {
        if (!matcher.locked) {
          setNotify((state) => ({ matchers: state.matchers.filter(m => m.key !== matcher.key), selectedMatcher: null, selectedIndex: null }));
        }
      },
      moveTo: (from: number, to: number, position: DROP_POSITION) => setNotify((state) => {
        const { matchers: currentMatchers, selectedMatcher } = state;
        if (from >= 0 && from < currentMatchers.length && to >= 0 && to < currentMatchers.length) {
          const matcher = currentMatchers[from];
          if (matcher.locked) {
            return {};
          }
          const toPos = position === 'before' ? to : to + 1;
          if (from > to) {
            currentMatchers.splice(from, 1);
            currentMatchers.splice(toPos, 0, matcher);
          } else {
            currentMatchers.splice(toPos, 0, matcher);
            currentMatchers.splice(from, 1);
          }
          const matchers = [...currentMatchers];
          const selectedIndex = matchers.findIndex(m => m.key === selectedMatcher?.key) ?? null;
          return { matchers, selectedIndex };
        }
        return {};
      }),
      selectMatcher: (key: string) => set((state) => {
        const index = state.matchers.findIndex(m => m.key === key);
        const selectedIndex = index !== -1 ? index : null;
        const selectedMatcher = index !== -1 ? state.matchers[index] : null;
        const editMatcher = selectedMatcher !== null && selectedMatcher.key !== state.editMatcher?.key ? null : state.editMatcher;
        return ({ selectedMatcher, selectedIndex, editPosition: null, editMatcher });
      }),
      selectMatcherForEdit: (key: string) => set((state) => {
        const editMatcher = state.matchers.find(m => m.key === key) ?? null;
        if (!editMatcher?.locked) {
          return { editMatcher };
        }
        return {};
      }),
      clearMatchers: () => {
        setNotify({ matchers: [], selectedMatcher: null, selectedIndex: null, editPosition: null, editMatcher: null }),
          set((state) => {
            state.clearCallbacks.forEach(c => c());
            return {};
          });
      },
      addClearCallback: (callback: Function) => set((state) => {
        if (!state.clearCallbacks.includes(callback)) {
          return { clearCallbacks: [...state.clearCallbacks, callback] };
        }
        return {};
      }),
      removeClearCallback: (callback: Function) => set((state) => {
        if (state.clearCallbacks.includes(callback)) {
          return { clearCallbacks: state.clearCallbacks.filter(c => c !== callback) };
        }
        return {};
      }),
      clearSelections: () => set({ selectedMatcher: null, selectedIndex: null, editPosition: null, editMatcher: null }),
      clearEditPosition: () => set({ editPosition: null }),
      clearEditMatcher: () => set({ editMatcher: null }),
      lockMatchers: () => setNotify((state) => ({ matchers: state.matchers?.map(m => ({ ...m, locked: true })), editMatcher: null })),
      unlockMatchers: () => setNotify((state) => ({ matchers: state.matchers?.map(m => ({ ...m, locked: false })), editMatcher: null })),
      next: () => set((state) => {
        const { editPosition, selectedIndex, matchers } = state;
        if (matchers.length > 0) {
          if (selectedIndex === null && editPosition === null) {
            return selectMatcherUpdate(matchers[0], 0, state.editMatcher);
          }
          if (editPosition !== null) {
            if (editPosition <= matchers.length - 1) {
              return selectMatcherUpdate(matchers[editPosition], editPosition, state.editMatcher);
            }
          }
          if (selectedIndex !== null) {
            if (selectedIndex < matchers.length - 1) {
              if (matchers[selectedIndex].locked) {
                return selectMatcherUpdate(matchers[selectedIndex + 1], selectedIndex + 1, state.editMatcher);
              } else {
                return editPositionUpdate(selectedIndex + 1);
              }
            }
          }
        }
        return nullUpdate;
      }),
      prev: () => set((state) => {
        const { editPosition, selectedIndex, matchers } = state;
        if (matchers.length > 0) {
          if (selectedIndex === null && editPosition === null) {
            return selectMatcherUpdate(matchers[matchers.length - 1], matchers.length - 1, state.editMatcher);
          }
          if (editPosition !== null) {
            if (editPosition - 1 >= 0) {
              return selectMatcherUpdate(matchers[editPosition - 1], editPosition - 1, state.editMatcher);
            }
          }
          if (selectedIndex !== null) {
            if (selectedIndex >= 0) {
              if (matchers[selectedIndex].locked) {
                return selectMatcherUpdate(matchers[selectedIndex - 1], selectedIndex - 1, state.editMatcher);
              } else {
                return editPositionUpdate(selectedIndex);
              }
            }
          }
        }
        return nullUpdate;
      }),
      first: () => set((state) => {
        const { matchers } = state;
        if (matchers.length > 0) {
          return selectMatcherUpdate(matchers[0], 0, state.editMatcher);
        }
        return nullUpdate;
      }),
      last: () => set((state) => {
        const { matchers } = state;
        if (matchers.length > 0) {
          return selectMatcherUpdate(matchers[matchers.length - 1], matchers.length - 1, state.editMatcher);
        }
        return nullUpdate;
      }),
    });
  });
}

const nullUpdate = { selectedMatcher: null, selectedIndex: null, editPosition: null };

const editPositionUpdate = (editPosition: number) => {
  return { selectedMatcher: null, selectedIndex: null, editPosition: editPosition };
}

const selectMatcherUpdate = (selectedMatcher: Matcher, selectedIndex: number, editMatcher: Matcher | null) => {
  return { selectedMatcher, selectedIndex, editPosition: null, editMatcher: selectedMatcher.key !== editMatcher?.key ? null : editMatcher };
}

const updateMatcherList = (
  matchers: Matcher[],
  matcher: Matcher,
  position: number | null,
  matcherSelected?: boolean,
): Partial<MatcherState> => {
  const newMatchers = (position !== null)
    ? [
      ...(position > 0 ? matchers.slice(0, position) : []),
      matcher,
      ...(position < matchers.length ? matchers.slice(position, matchers.length) : []),
    ]
    : [...matchers, matcher];
  const editPosition = position !== null ? position + 1 : null;
  if (matcherSelected) {
    return { matchers: newMatchers, selectedMatcher: matcher, selectedIndex: position ?? newMatchers.length - 1, editPosition };
  }
  return { matchers: newMatchers, editPosition }
}

const updateMatchers = (
  matchers: Matcher[],
  fieldMap: Map<string, Field>,
  value: MatcherValue,
  selectedMatcher: Matcher | null,
  position: number | null,
  operator?: LogicalOperator,
  comparison?: string,
) => {
  if (!('valueTo' in value) && (selectedMatcher || position === null || position > 0)) {
    const { matchers: newMatchers = null, selectedMatcher: updatedMatcher = null } = appendToList(matchers, fieldMap, value, selectedMatcher, position);
    if (newMatchers && updatedMatcher) {
      if (selectedMatcher !== null) {
        const selectedIndex = newMatchers.findIndex(m => m.key === updatedMatcher.key);
        return { matchers: newMatchers, selectedMatcher: updatedMatcher, selectedIndex };
      }
      return { matchers: newMatchers };
    }
  }
  const matcher: Matcher = {
    ...value,
    comparison: comparison ?? '=',
    operator: operator ?? AND,
    key: uuidv4(),
  }

  return updateMatcherList(matchers, matcher, position, selectedMatcher !== null);
}

const getTagetMatcher = (
  matchers: Matcher[],
  selectedMatcher: Matcher | null,
  position: number | null,
): Matcher | null => {
  if (selectedMatcher) {
    return selectedMatcher;
  }
  const prevIndex = matchers.length === 0
    ? null
    : position === null
      ? matchers.length - 1
      : position - 1;
  return prevIndex !== null ? matchers[prevIndex] : null;
}
const appendToList = (
  matchers: Matcher[],
  fieldMap: Map<string, Field>,
  value: MatcherValue,
  selectedMatcher: Matcher | null,
  position: number | null,
) => {
  const targetMatcher = getTagetMatcher(matchers, selectedMatcher, position)
  if (targetMatcher && !targetMatcher.locked) {
    if ('field' in targetMatcher && targetMatcher.field === value.field && !('valueTo' in targetMatcher)) {
      const field = fieldMap.get(value.field);
      if (field?.allowList) {
        const newText = 'textArray' in value
          ? value.textArray
          : [value.text];
        const newValues = 'valueArray' in value
          ? value.valueArray
          : [value.value];
        if ('valueArray' in targetMatcher) {
          const existing = newValues.filter(v => targetMatcher.valueArray.includes(v));
          if (existing.length > 0) {
            throw new Error(`${existing.join(',')} alrady exist in pill`);
          }
        }
        if ('value' in targetMatcher) {
          const existing = newValues.filter(v => targetMatcher.value === v);
          if (existing.length > 0) {
            throw new Error(`${existing.join(',')} alrady exist in pill`);
          }
        }
        const textArray = 'textArray' in targetMatcher
          ? [...targetMatcher.textArray, ...newText]
          : [targetMatcher.text, ...newText];
        const valueArray = 'valueArray' in targetMatcher
          ? [...targetMatcher.valueArray, ...newValues]
          : [targetMatcher.value, ...newValues];
        const { key, field, comparison, operator } = targetMatcher;
        const matcher: ArrayMatcher = {
          key,
          field,
          comparison,
          operator,
          textArray,
          valueArray
        }
        return { matchers: matchers.map(m => m.key === matcher.key ? matcher : m), selectedMatcher: matcher };
      }
    }
  }
  return {};
} 