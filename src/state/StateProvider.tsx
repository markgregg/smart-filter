import React from 'react';
import { createFocusStore } from './focusStore';
import { createFilterBarStore } from './filterBarStore';
import { createHintStore } from './hintStore';
import { createConfigStore } from './configStore';
import { StateContext } from '@/state/state';
import { Matcher, SmartFilterProps, Sort } from '@/types';
import { createMatcherStore } from './matcherStore';
import { createOptionsStore } from './optionsStore';
import { createArrayStore } from './arrayStore';
import { createMatcherDragStore } from './dragStore';
import { createBracketsStore } from './bracketStore';
import { createSortStore } from './SortStore';
import { DEFAULT_PAGE_SIZE } from '@/util/constants';

export interface ProviderProps {
  props: SmartFilterProps;
  children: JSX.Element | JSX.Element[];
}

export const StateProvider = React.memo(
  ({ props, children }: ProviderProps) => {
    const configStore = React.useMemo(() => createConfigStore(props), [props]);
    const focusStore = React.useMemo(() => createFocusStore(props.showDropdownOnMouseOver, props.dropDownDispalyWhenKeyPressed), [props.showDropdownOnMouseOver, props.dropDownDispalyWhenKeyPressed]);
    const filterBarStore = React.useMemo(createFilterBarStore, []);
    const hintStore = React.useMemo(createHintStore, []);
    const matcherStore = React.useMemo(createMatcherStore, []);
    const optionsStore = React.useMemo(
      () => createOptionsStore(props.fields, props.operators ?? [], props.pageSize ?? DEFAULT_PAGE_SIZE, props.debounce),
      [props.fields, props.operators, props.pageSize, props.debounce],
    );
    const arrayStore = React.useMemo(() => createArrayStore(props.pageSize ?? DEFAULT_PAGE_SIZE), [props.pageSize]);
    const matcherDragStore = React.useMemo(
      () => createMatcherDragStore<Matcher>(),
      [],
    );
    const bracketsStore = React.useMemo(createBracketsStore, []);
    const sortStore = React.useMemo(createSortStore, []);
    const sortDragStore = React.useMemo(
      () => createMatcherDragStore<Sort>(),
      [],
    );

    const stateValue = React.useMemo(
      () => ({
        configStore,
        focusStore,
        filterBarStore,
        hintStore,
        matcherStore,
        optionsStore,
        arrayStore,
        matcherDragStore,
        bracketsStore,
        sortStore,
        sortDragStore,
      }),
      [
        configStore,
        focusStore,
        filterBarStore,
        hintStore,
        matcherStore,
        optionsStore,
        arrayStore,
        matcherDragStore,
        bracketsStore,
        sortStore,
        sortDragStore,
      ],
    );

    return (
      <StateContext.Provider value={stateValue}>
        {children}
      </StateContext.Provider>
    );
  },
);
