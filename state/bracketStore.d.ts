import { StoreApi, UseBoundStore } from 'zustand';
import { BracketState } from '../../../../../../src/types/State';

export declare const createBracketsStore: () => UseBoundStore<StoreApi<BracketState>>;
