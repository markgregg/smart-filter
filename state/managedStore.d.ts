import { StoreApi, UseBoundStore } from 'zustand';
import { Matcher } from '../../../../../../src/types';
import { ManagedState } from '../../../../../../src/types/State';

export declare const createManagedStore: (matchers?: Matcher[], locked?: boolean) => UseBoundStore<StoreApi<ManagedState>>;
