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

export interface ProviderProps {
  props: SmartFilterProps
  children: JSX.Element | JSX.Element[];
}

export const StateProvider = React.memo(({ props, children }: ProviderProps) => {
  const configStore = React.useMemo(() => createConfigStore(props), [props]);
  const [focusStore] = React.useState(createFocusStore);
  const [mouseStore] = React.useState(createMouseStore);
  const [filterBarStore] = React.useState(createFilterBarStore);
  const [hintStore] = React.useState(createHintStore);
  const matcherStore = React.useMemo(() => createMatcherStore(props), [props]);
  const optionsStore = React.useMemo(() => createOptionsStore(props), [props]);
  const arrayStore = React.useMemo(() => createArrayStore(props), [props]);

  return (<StateContext.Provider value={{
    configStore,
    focusStore,
    mouseStore,
    filterBarStore,
    hintStore,
    matcherStore,
    optionsStore,
    arrayStore,
  }}>
    {children}
  </StateContext.Provider>)
});

