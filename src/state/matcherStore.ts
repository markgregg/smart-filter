import { StoreApi, UseBoundStore, create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  ArrayMatcher,
  BracketMatcher,
  Brackets,
  Field,
  LogicalOperator,
  Matcher,
} from '@/types';
import {
  ClearCallbackFunction,
  DROP_POSITION,
  MatcherState,
} from '@/types/State';
import { MatcherValue } from '@/types/values';
import { AND, OR, UNDO_BUFFER_CAPACITY } from '@/util/constants';

export const createMatcherStore = (): UseBoundStore<StoreApi<MatcherState>> =>
  create<MatcherState>((set) => ({
    clearCallbacks: [],
    undoBuffer: [],
    matchers: [],
    lastAdd: null,
    selectedIndex: null,
    selectedMatcher: null,
    editPosition: null,
    editMatcher: null,
    copyMatchers: null,
    fieldMap: new Map(),
    setFieldMap: (fieldMap: Map<string, Field>) => set({ fieldMap }),
    setMatchers: (matchers: Matcher[]) =>
      set((state) => {
        if (JSON.stringify(matchers) !== JSON.stringify(state.matchers)) {
          return { matchers, undoBuffer: [] };
        }
        return {};
      }),
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
    }) =>
      set((state) =>
        updateMatchers(
          state.undoBuffer,
          state.matchers,
          state.fieldMap,
          value,
          state.selectedMatcher,
          position,
          operator,
          comparison,
          dontAppend,
        ),
      ),
    insertMatchers: (matchers: Matcher | Matcher[], position: number | null) =>
      set((state) =>
        updateMatcherList(
          state.undoBuffer,
          state.matchers,
          matchers,
          position,
          state.fieldMap,
        ),
      ),
    addBracket: (
      bracket: Brackets,
      position: number | null,
      operator?: LogicalOperator,
    ) => {
      const bracketMatcher: BracketMatcher = {
        type: 'b',
        key: uuidv4(),
        bracket,
        operator: operator ?? AND,
      };
      set((state) =>
        updateMatcherList(
          state.undoBuffer,
          state.matchers,
          bracketMatcher,
          position,
          state.fieldMap,
        ),
      );
    },
    updateMatcher: (matcher: Matcher, ignoreLockedCheck?: true) => {
      if (ignoreLockedCheck || !matcher.locked) {
        set((state) =>
          matcher.key === state.selectedMatcher?.key
            ? {
                undoBuffer: trimUndoBuffer([
                  ...state.undoBuffer,
                  structuredClone(state.matchers),
                ]),
                matchers: state.matchers.map((m) =>
                  m.key === matcher.key ? matcher : m,
                ),
                selectedMatcher: matcher,
              }
            : {
                undoBuffer: trimUndoBuffer([
                  ...state.undoBuffer,
                  structuredClone(state.matchers),
                ]),
                matchers: state.matchers.map((m) =>
                  m.key === matcher.key ? matcher : m,
                ),
              },
        );
      }
    },
    deleteMatcher: (matcher: Matcher) => {
      if (!matcher.locked) {
        set((state) => ({
          undoBuffer: trimUndoBuffer([
            ...state.undoBuffer,
            structuredClone(state.matchers),
          ]),
          matchers: state.matchers.filter((m) => m.key !== matcher.key),
          selectedMatcher: null,
          selectedIndex: null,
          editMatcher: null,
          copyMatchers: null,
          lastAdd: null,
        }));
      }
    },
    deleteMatchers: (matchers: Matcher[]) => {
      if (matchers.every((m) => !m.locked)) {
        set((state) => ({
          undoBuffer: trimUndoBuffer([
            ...state.undoBuffer,
            structuredClone(state.matchers),
          ]),
          matchers: state.matchers.filter(
            (m) => !matchers.find((fm) => fm.key === m.key),
          ),
          selectedMatcher: null,
          selectedIndex: null,
          editMatcher: null,
          copyMatchers: null,
          lastAdd: null,
        }));
      }
    },
    moveTo: (from: number, to: number, position: DROP_POSITION) =>
      set((state) => {
        const { matchers: currentMatchers, selectedMatcher } = state;
        if (
          from >= 0 &&
          from < currentMatchers.length &&
          to >= 0 &&
          to < currentMatchers.length
        ) {
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
          const selectedIndex =
            matchers.findIndex((m) => m.key === selectedMatcher?.key) ?? null;
          return {
            undoBuffer: trimUndoBuffer([
              ...state.undoBuffer,
              structuredClone(state.matchers),
            ]),
            matchers,
            selectedIndex,
          };
        }
        return {};
      }),
    selectMatcher: (key: string) =>
      set((state) => {
        const index = state.matchers.findIndex((m) => m.key === key);
        const selectedIndex = index !== -1 ? index : null;
        const selectedMatcher = index !== -1 ? state.matchers[index] : null;
        const editMatcher =
          selectedMatcher !== null &&
          selectedMatcher.key !== state.editMatcher?.key
            ? null
            : state.editMatcher;
        return {
          selectedMatcher,
          selectedIndex,
          editPosition: null,
          editMatcher,
          copyMatchers: null,
          lastAdd: null,
        };
      }),
    clearCopyMatcher: () => set({ copyMatchers: null }),
    addCopyMatcher: (key: string) =>
      set((state) => {
        const { copyMatchers, selectedMatcher, selectMatcher } = state;
        if (!selectedMatcher) {
          selectMatcher(key);
          return {};
        }
        return {
          copyMatchers: copyMatchers?.includes(key)
            ? copyMatchers.filter((cm) => cm !== key)
            : [...(copyMatchers ?? []), key],
        };
      }),
    selectMatcherForEdit: (key: string) =>
      set((state) => {
        const editMatcher = state.matchers.find((m) => m.key === key) ?? null;
        if (!editMatcher?.locked) {
          return { editMatcher };
        }
        return {};
      }),
    clearMatchers: () => {
      set((state) => ({
        undoBuffer: trimUndoBuffer([
          ...state.undoBuffer,
          structuredClone(state.matchers),
        ]),
        matchers: state.matchers.filter((m) => m.locked),
        selectedMatcher: null,
        selectedIndex: null,
        editPosition: null,
        editMatcher: null,
        copyMatchers: null,
        lastAdd: null,
      }));
      set((state) => {
        state.clearCallbacks.forEach((c) => c());
        return {};
      });
    },
    addClearCallback: (callback: ClearCallbackFunction) =>
      set((state) => {
        if (!state.clearCallbacks.includes(callback)) {
          return { clearCallbacks: [...state.clearCallbacks, callback] };
        }
        return {};
      }),
    removeClearCallback: (callback: ClearCallbackFunction) =>
      set((state) => {
        if (state.clearCallbacks.includes(callback)) {
          return {
            clearCallbacks: state.clearCallbacks.filter((c) => c !== callback),
          };
        }
        return {};
      }),
    clearSelections: () =>
      set({
        selectedMatcher: null,
        selectedIndex: null,
        editPosition: null,
        editMatcher: null,
        copyMatchers: null,
        lastAdd: null,
      }),
    clearEditPosition: () => set({ editPosition: null }),
    clearEditMatcher: () => set({ editMatcher: null }),
    lockMatchers: () =>
      set((state) => ({
        undoBuffer: trimUndoBuffer([
          ...state.undoBuffer,
          structuredClone(state.matchers),
        ]),
        matchers: state.matchers?.map((m) => ({ ...m, locked: true })),
        editMatcher: null,
      })),
    unlockMatchers: () =>
      set((state) => ({
        undoBuffer: trimUndoBuffer([
          ...state.undoBuffer,
          structuredClone(state.matchers),
        ]),
        matchers: state.matchers?.map((m) => ({ ...m, locked: false })),
        editMatcher: null,
      })),
    next: () =>
      set((state) => {
        const { editPosition, selectedIndex, matchers } = state;
        if (matchers.length > 0) {
          if (selectedIndex === null && editPosition === null) {
            return selectMatcherUpdate(matchers[0], 0, state.editMatcher);
          }
          if (editPosition !== null) {
            if (editPosition <= matchers.length - 1) {
              return selectMatcherUpdate(
                matchers[editPosition],
                editPosition,
                state.editMatcher,
              );
            }
          }
          if (selectedIndex !== null) {
            if (selectedIndex < matchers.length - 1) {
              if (matchers[selectedIndex].locked) {
                return selectMatcherUpdate(
                  matchers[selectedIndex + 1],
                  selectedIndex + 1,
                  state.editMatcher,
                );
              }
              return editPositionUpdate(selectedIndex + 1);
            }
          }
        }
        return nullUpdate;
      }),
    prev: () =>
      set((state) => {
        const { editPosition, selectedIndex, matchers } = state;
        if (matchers.length > 0) {
          if (selectedIndex === null && editPosition === null) {
            return selectMatcherUpdate(
              matchers[matchers.length - 1],
              matchers.length - 1,
              state.editMatcher,
            );
          }
          if (editPosition !== null) {
            if (editPosition - 1 >= 0) {
              return selectMatcherUpdate(
                matchers[editPosition - 1],
                editPosition - 1,
                state.editMatcher,
              );
            }
          }
          if (selectedIndex !== null) {
            if (selectedIndex >= 0) {
              if (!matchers[selectedIndex].locked) {
                return editPositionUpdate(selectedIndex);
              }
              if (selectedIndex > 0) {
                return selectMatcherUpdate(
                  matchers[selectedIndex - 1],
                  selectedIndex - 1,
                  state.editMatcher,
                );
              }
            }
          }
        }
        return nullUpdate;
      }),
    first: () =>
      set((state) => {
        const { matchers } = state;
        if (matchers.length > 0) {
          return selectMatcherUpdate(matchers[0], 0, state.editMatcher);
        }
        return nullUpdate;
      }),
    last: () =>
      set((state) => {
        const { matchers } = state;
        if (matchers.length > 0) {
          return selectMatcherUpdate(
            matchers[matchers.length - 1],
            matchers.length - 1,
            state.editMatcher,
          );
        }
        return nullUpdate;
      }),
    undo: () =>
      set((state) => ({
        undoBuffer: state.undoBuffer.slice(0, state.undoBuffer.length - 1),
        matchers: state.undoBuffer.pop() ?? [],
        selectedMatcher: null,
        selectedIndex: null,
        editPosition: null,
        editMatcher: null,
        copyMatchers: null,
      })),
  }));

const nullUpdate = {
  selectedMatcher: null,
  selectedIndex: null,
  editPosition: null,
  lastAdd: null,
};

const editPositionUpdate = (editPosition: number) => ({
  selectedMatcher: null,
  selectedIndex: null,
  editPosition,
  lastAdd: null,
});

const selectMatcherUpdate = (
  selectedMatcher: Matcher,
  selectedIndex: number,
  editMatcher: Matcher | null,
) => ({
  selectedMatcher,
  selectedIndex,
  editPosition: null,
  editMatcher: selectedMatcher.key !== editMatcher?.key ? null : editMatcher,
  lastAdd: null,
});

const checkFieldLimits = (
  matchers: Matcher[],
  matcher: Matcher | Matcher[],
  fieldMap: Map<string, Field>,
) => {
  const a = Array.isArray(matcher) ? matcher : [matcher];
  for (let index = 0; index < a.length; index += 1) {
    const m = a[index];
    if ('field' in m) {
      const fieldName = m.field;
      const field = fieldMap.get(fieldName);
      if (field?.instanceLimit) {
        if (
          matchers.filter(
            (mf) => 'field' in mf && mf.field === fieldName && mf.key !== m.key,
          ).length +
            1 >
          field.instanceLimit
        ) {
          throw Error(
            `Instance limt of (${field.instanceLimit}) has been exceed for ${field.title}`,
          );
        }
      }
    }
  }
};

const updateMatcherList = (
  undoBuffer: Matcher[][],
  matchers: Matcher[],
  matcher: Matcher | Matcher[],
  position: number | null,
  fieldMap: Map<string, Field>,
): Partial<MatcherState> => {
  checkFieldLimits(matchers, matcher, fieldMap);
  const newMatchers =
    position !== null
      ? [
          ...(position > 0 ? matchers.slice(0, position) : []),
          ...(Array.isArray(matcher) ? matcher : [matcher]),
          ...(position < matchers.length
            ? matchers.slice(position, matchers.length)
            : []),
        ]
      : [...matchers, ...(Array.isArray(matcher) ? matcher : [matcher])];
  const editPosition =
    position !== null
      ? position + (Array.isArray(matcher) ? matcher.length : 1)
      : null;
  const selectedMatcher = Array.isArray(matcher)
    ? matcher[matcher.length - 1]
    : matcher;
  const selectedIndex = position
    ? Array.isArray(matcher)
      ? position + matcher.length
      : position
    : newMatchers.length - 1;
  const editMatcher =
    !editPosition &&
    !Array.isArray(matcher) &&
    matcher.key === selectedMatcher.key &&
    (matcher.type === 's' || matcher.type === 'r') &&
    matcher.value === null &&
    matcher.text === ''
      ? selectedMatcher
      : null;
  return {
    undoBuffer: trimUndoBuffer([...undoBuffer, structuredClone(matchers)]),
    matchers: newMatchers,
    selectedMatcher,
    selectedIndex,
    editPosition,
    editMatcher,
    lastAdd: selectedIndex,
  };
};

const updateMatchers = (
  undoBuffer: Matcher[][],
  matchers: Matcher[],
  fieldMap: Map<string, Field>,
  value: MatcherValue,
  selectedMatcher: Matcher | null,
  position: number | null,
  operator?: LogicalOperator,
  comparison?: string,
  dontAppend?: boolean,
) => {
  if (
    !dontAppend &&
    value.type !== 'r' &&
    (selectedMatcher || position === null || position > 0) &&
    operator !== OR
  ) {
    const {
      matchers: newMatchers = null,
      selectedMatcher: updatedMatcher = null,
    } = appendToList(matchers, fieldMap, value, selectedMatcher, position);
    if (newMatchers && updatedMatcher) {
      const selectedIndex = newMatchers.findIndex(
        (m) => m.key === updatedMatcher.key,
      );
      return {
        matchers: newMatchers,
        selectedMatcher: updatedMatcher,
        lastAdd: selectedIndex,
        selectedIndex,
        undoBuffer: trimUndoBuffer([...undoBuffer, structuredClone(matchers)]),
      };
    }
  }
  const matcher = {
    ...value,
    comparison: comparison ?? '=',
    operator: operator ?? AND,
    key: uuidv4(),
  };

  return updateMatcherList(undoBuffer, matchers, matcher, position, fieldMap);
};

const getTagetMatcher = (
  matchers: Matcher[],
  selectedMatcher: Matcher | null,
  position: number | null,
): Matcher | null => {
  if (selectedMatcher) {
    return selectedMatcher;
  }
  const prevIndex =
    matchers.length === 0
      ? null
      : position === null
        ? matchers.length - 1
        : position - 1;
  return prevIndex !== null ? matchers[prevIndex] : null;
};

const appendToList = (
  matchers: Matcher[],
  fieldMap: Map<string, Field>,
  value: MatcherValue,
  selectedMatcher: Matcher | null,
  position: number | null,
) => {
  const targetMatcher = getTagetMatcher(matchers, selectedMatcher, position);
  if (targetMatcher && !targetMatcher.locked) {
    if (
      'field' in targetMatcher &&
      targetMatcher.field === value.field &&
      targetMatcher.type !== 'r'
    ) {
      const mField = fieldMap.get(value.field);
      if (mField?.allowList) {
        const newText = value.type === 'a' ? value.textArray : [value.text];
        const newValues = value.type === 'a' ? value.valueArray : [value.value];
        if (targetMatcher.type === 'a') {
          const existing = newValues.filter((v) =>
            targetMatcher.valueArray.includes(v),
          );
          if (existing.length > 0) {
            throw new Error(`${existing.join(',')} alrady exist in pill`);
          }
        }
        if (targetMatcher.type === 's') {
          const existing = newValues.filter((v) => targetMatcher.value === v);
          if (existing.length > 0) {
            throw new Error(`${existing.join(',')} alrady exist in pill`);
          }
        }
        const textArray =
          targetMatcher.type === 'a'
            ? [...targetMatcher.textArray, ...newText]
            : [targetMatcher.text, ...newText];
        const valueArray =
          targetMatcher.type === 'a'
            ? [...targetMatcher.valueArray, ...newValues]
            : [targetMatcher.value, ...newValues];
        const { key, field, comparison, operator } = targetMatcher;
        const matcher: ArrayMatcher = {
          type: 'a',
          key,
          field,
          comparison,
          operator,
          textArray,
          valueArray,
        };
        return {
          matchers: matchers.map((m) => (m.key === matcher.key ? matcher : m)),
          selectedMatcher: matcher,
        };
      }
    }
  }
  return {};
};

const trimUndoBuffer = (undoBuffer: Matcher[][]): Matcher[][] =>
  undoBuffer.length >= UNDO_BUFFER_CAPACITY
    ? undoBuffer.slice(undoBuffer.length - UNDO_BUFFER_CAPACITY)
    : undoBuffer;
