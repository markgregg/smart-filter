import React from 'react';
import { createFocusStore } from './focusStore';
import { createMouseStore } from './mouseStore';
import { createFilterBarStore } from './filterBarStore';
import { createHintStore } from './hintStore';
import { createConfigStore } from './configStore';
import { StateContext } from '@/state/state';
import { SmartFilterProps } from '@/types';
import { createMatcherStore } from './matcherStore';
import { createOptionsStore } from './optionsStore';
import { createArrayStore } from './arrayStore';
import { createMatcherDragStore } from './matcherDragStore';
import { createBracketsStore } from './bracketStore';

export interface ProviderProps {
  props: SmartFilterProps;
  children: JSX.Element | JSX.Element[];
}

export const StateProvider = React.memo(
  ({ props, children }: ProviderProps) => {
    const configStore = React.useMemo(() => createConfigStore(props), [props]);
    const focusStore = React.useMemo(createFocusStore, []);
    const mouseStore = React.useMemo(createMouseStore, []);
    const filterBarStore = React.useMemo(
      () => createFilterBarStore(props),
      [props],
    );
    const hintStore = React.useMemo(createHintStore, []);
    const matcherStore = React.useMemo(
      () => createMatcherStore(props),
      [props],
    );
    const optionsStore = React.useMemo(
      () => createOptionsStore(props),
      [props],
    );
    const arrayStore = React.useMemo(() => createArrayStore(props), [props]);
    const matcherDragStore = React.useMemo(createMatcherDragStore, []);
    const bracketsStore = React.useMemo(createBracketsStore, []);

    const stateValue = React.useMemo(
      () => ({
        configStore,
        focusStore,
        mouseStore,
        filterBarStore,
        hintStore,
        matcherStore,
        optionsStore,
        arrayStore,
        matcherDragStore,
        bracketsStore,
      }),
      [
        configStore,
        focusStore,
        mouseStore,
        filterBarStore,
        hintStore,
        matcherStore,
        optionsStore,
        arrayStore,
        matcherDragStore,
        bracketsStore,
      ],
    );

    return (
      <StateContext.Provider value={stateValue}>
        {children}
      </StateContext.Provider>
    );
  },
);
