import { StoreApi, UseBoundStore } from 'zustand';
import { ArrayState } from '../../../../../../src/types/State';

export declare const createArrayStore: (pageSize: number) => UseBoundStore<StoreApi<ArrayState>>;
