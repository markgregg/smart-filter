import React from 'react';
import { StoreApi, UseBoundStore, useStore } from 'zustand';
import { StateContext } from '@/state/state';
import {
  ArrayState,
  BracketState,
  ConfigState,
  DragState,
  FilterBarState,
  FocusState,
  HintState,
  ManagedState,
  MatcherState,
  OptionsState,
  State,
} from '@/types/State';
import { Matcher, Sort } from '@/types';
import { SortState } from '@/types/State/sort';

const useState = <T, U>(
  storeSelector: (state: State) => UseBoundStore<StoreApi<T>>,
  selector: (state: T) => U,
) => {
  const store = storeSelector(React.useContext(StateContext));

  if (store === null) {
    throw new Error('useState must be used within StateProvider');
  }
  return useStore<UseBoundStore<StoreApi<T>>, U>(store, selector);
};

export const useConfig = <U>(selector: (state: ConfigState) => U) =>
  useState((s) => s.configStore, selector);

export const useFocus = <U>(selector: (state: FocusState) => U) =>
  useState((s) => s.focusStore, selector);

export const useFilterBar = <U>(selector: (state: FilterBarState) => U) =>
  useState((s) => s.filterBarStore, selector);

export const useHint = <U>(selector: (state: HintState) => U) =>
  useState((s) => s.hintStore, selector);

export const useMatcher = <U>(selector: (state: MatcherState) => U) =>
  useState((s) => s.matcherStore, selector);

export const useOptions = <U>(selector: (state: OptionsState) => U) =>
  useState((s) => s.optionsStore, selector);

export const useArray = <U>(selector: (state: ArrayState) => U) =>
  useState((s) => s.arrayStore, selector);

export const useMatcherDrag = <U>(selector: (state: DragState<Matcher>) => U) =>
  useState((s) => s.matcherDragStore, selector);

export const useBrackets = <U>(selector: (state: BracketState) => U) =>
  useState((s) => s.bracketsStore, selector);

export const useSort = <U>(selector: (state: SortState) => U) =>
  useState((s) => s.sortStore, selector);

export const useSortDrag = <U>(selector: (state: DragState<Sort>) => U) =>
  useState((s) => s.sortDragStore, selector);

export const useManaged = <U>(selector: (state: ManagedState) => U) =>
  useState((s) => s.managedStore, selector);
