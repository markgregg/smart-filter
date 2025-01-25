import { StoreApi, UseBoundStore } from 'zustand';
import { MatcherState } from '../../../../../../src/types/State';

export declare const createMatcherStore: () => UseBoundStore<StoreApi<MatcherState>>;
