import { StoreApi, UseBoundStore } from 'zustand';
import { ConfigState } from './config';
import { FilterBarState } from './filter';
import { FocusState } from './focus';
import { HintState } from './hint';
import { MatcherState } from './matcher';
import { OptionsState } from './options';
import { ArrayState } from './array';
import { DragState } from './drag';
import { Matcher } from '../matcher';
import { BracketState } from './brackets';
import { SortState } from './sort';
import { Sort } from '../sort';
import { ManagedState } from './managed';

export interface State {
    configStore: UseBoundStore<StoreApi<ConfigState>>;
    focusStore: UseBoundStore<StoreApi<FocusState>>;
    filterBarStore: UseBoundStore<StoreApi<FilterBarState>>;
    hintStore: UseBoundStore<StoreApi<HintState>>;
    matcherStore: UseBoundStore<StoreApi<MatcherState>>;
    optionsStore: UseBoundStore<StoreApi<OptionsState>>;
    arrayStore: UseBoundStore<StoreApi<ArrayState>>;
    matcherDragStore: UseBoundStore<StoreApi<DragState<Matcher>>>;
    bracketsStore: UseBoundStore<StoreApi<BracketState>>;
    sortStore: UseBoundStore<StoreApi<SortState>>;
    sortDragStore: UseBoundStore<StoreApi<DragState<Sort>>>;
    managedStore: UseBoundStore<StoreApi<ManagedState>>;
}
