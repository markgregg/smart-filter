import { StoreApi, UseBoundStore } from 'zustand';
import { SortState } from '../../../../../../src/types/State/sort';

export declare const createSortStore: () => UseBoundStore<StoreApi<SortState>>;
