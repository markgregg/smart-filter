import React from "react";
import { StateContext } from "@/state/state";
import { StoreApi, UseBoundStore, useStore } from "zustand";
import { ArrayState, ConfigState, FilterBarState, FocusState, HintState, MatcherState, MouseState, OptionsState, State } from "@/types/State";

const useState = <T, U>(storeSelector: (state: State) => UseBoundStore<StoreApi<T>>, selector: (state: T) => U) => {
  const store = storeSelector(React.useContext(StateContext));

  if (store === null) {
    throw new Error(
      'useState must be used within StateProvider',
    )
  }
  return useStore<UseBoundStore<StoreApi<T>>, U>(store, selector)
}

export const useConfig = <U>(selector: (state: ConfigState) => U) => {
  return useState(s => s.configStore, selector);
}

export const useFocus = <U>(selector: (state: FocusState) => U) => {
  return useState(s => s.focusStore, selector);
}

export const useMouse = <U>(selector: (state: MouseState) => U) => {
  return useState(s => s.mouseStore, selector);
}

export const useFilterBar = <U>(selector: (state: FilterBarState) => U) => {
  return useState(s => s.filterBarStore, selector);
}

export const useHint = <U>(selector: (state: HintState) => U) => {
  return useState(s => s.hintStore, selector);
}

export const useMatcher = <U>(selector: (state: MatcherState) => U) => {
  return useState(s => s.matcherStore, selector);
}

export const useOptions = <U>(selector: (state: OptionsState) => U) => {
  return useState(s => s.optionsStore, selector);
}

export const useArray = <U>(selector: (state: ArrayState) => U) => {
  return useState(s => s.arrayStore, selector);
}
