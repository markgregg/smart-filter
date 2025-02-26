import React from 'react';
import { createFocusStore } from './focusStore';
import { createFilterBarStore } from './filterBarStore';
import { createHintStore } from './hintStore';
import { createConfigStore } from './configStore';
import { StateContext } from '@/state/state';
import { Matcher, SmartFilterProps } from '@/types';
import { createMatcherStore } from './matcherStore';
import { createOptionsStore } from './optionsStore';
import { createArrayStore } from './arrayStore';
import { createMatcherDragStore } from './dragStore';
import { createBracketsStore } from './bracketStore';
import { DEFAULT_PAGE_SIZE } from '@/util/constants';
import { createManagedStore } from './managedStore';

export interface ProviderProps {
  props: SmartFilterProps;
  children: JSX.Element | JSX.Element[];
}

export const StateProvider = React.memo(
  ({ props, children }: ProviderProps) => {
    const {
      matchers,
      allowLocking,
      debounce,
      dropDownDispalyWhenKeyPressed,
      dropdownWidth,
      fields,
      hints,
      maxDropdownHeight,
      maxValueWidth,
      onChange,
      onClear,
      onExpand,
      locked,
      onLock,
      operators,
      optionWidth,
      pageSize,
      pasteOptions,
      placeholder,
      showDropdownOnMouseOver,
      showUndoIcon,
      size,
    } = props;
    const configStore = React.useMemo(
      () => createConfigStore(props),
      [
        allowLocking,
        debounce,
        dropDownDispalyWhenKeyPressed,
        dropdownWidth,
        fields,
        hints,
        maxDropdownHeight,
        maxValueWidth,
        onChange,
        onClear,
        onExpand,
        locked,
        onLock,
        operators,
        optionWidth,
        pageSize,
        pasteOptions,
        placeholder,
        showDropdownOnMouseOver,
        showUndoIcon,
        size,
      ],
    );
    const focusStore = React.useMemo(
      () =>
        createFocusStore(
          showDropdownOnMouseOver,
          dropDownDispalyWhenKeyPressed,
        ),
      [showDropdownOnMouseOver, dropDownDispalyWhenKeyPressed],
    );
    const filterBarStore = React.useMemo(createFilterBarStore, []);
    const hintStore = React.useMemo(createHintStore, []);
    const matcherStore = React.useMemo(createMatcherStore, []);
    const optionsStore = React.useMemo(
      () =>
        createOptionsStore(
          fields,
          operators ?? [],
          pageSize ?? DEFAULT_PAGE_SIZE,
          debounce,
        ),
      [fields, operators, pageSize, debounce],
    );
    const arrayStore = React.useMemo(
      () => createArrayStore(pageSize ?? DEFAULT_PAGE_SIZE),
      [pageSize],
    );
    const matcherDragStore = React.useMemo(
      () => createMatcherDragStore<Matcher>(),
      [],
    );
    const bracketsStore = React.useMemo(createBracketsStore, []);
    const managedStore = React.useMemo(
      () => createManagedStore(matchers ?? [], locked ?? false),
      [matchers, locked],
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
        managedStore,
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
        managedStore,
      ],
    );

    return (
      <StateContext.Provider value={stateValue}>
        {children}
      </StateContext.Provider>
    );
  },
);
