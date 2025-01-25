import { StoreApi, UseBoundStore } from 'zustand';
import { HintState } from '../../../../../../src/types/State';

export declare const createHintStore: () => UseBoundStore<StoreApi<HintState>>;
