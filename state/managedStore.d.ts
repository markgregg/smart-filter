import { StoreApi, UseBoundStore } from 'zustand';
import { Matcher, Sort } from '../../../../../../src/types';
import { ManagedState } from '../../../../../../src/types/State';

export declare const createManagedStore: (matchers?: Matcher[], sort?: Sort[]) => UseBoundStore<StoreApi<ManagedState>>;
