import { StoreApi, UseBoundStore, create } from 'zustand';
import { Matcher, Sort } from '@/types';
import { ManagedState } from '@/types/State';

export const createManagedStore = (
  matchers?: Matcher[],
  sort?: Sort[],
  locked?: boolean,
): UseBoundStore<StoreApi<ManagedState>> =>
  create<ManagedState>(() => ({
    matchers,
    sort,
    locked,
  }));
