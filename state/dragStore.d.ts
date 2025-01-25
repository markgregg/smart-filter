import { StoreApi, UseBoundStore } from 'zustand';
import { DragState } from '../../../../../../src/types/State';

export declare const createMatcherDragStore: <T>() => UseBoundStore<StoreApi<DragState<T>>>;
