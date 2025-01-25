import { StoreApi, UseBoundStore } from 'zustand';
import { FilterBarState } from '../../../../../../src/types/State';

export declare const createFilterBarStore: () => UseBoundStore<StoreApi<FilterBarState>>;
