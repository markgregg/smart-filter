import { StoreApi, UseBoundStore } from 'zustand';
import { Field, Operator } from '../../../../../../src/types';
import { OptionsState } from '../../../../../../src/types/State';

export declare const createOptionsStore: (fields: Field[], operators: Operator[], pageSize: number, debounce?: number) => UseBoundStore<StoreApi<OptionsState>>;
