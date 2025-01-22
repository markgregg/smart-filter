import { StoreApi, UseBoundStore, create } from 'zustand';
import { Matcher, Sort } from '@/types';
import { ManagedState } from '@/types/State';

export const createManagedStore = (
  matchers?: Matcher[],
  sort?: Sort[],
): UseBoundStore<StoreApi<ManagedState>> =>
  create<ManagedState>(() => ({
    matchers,
    sort,
  }));
