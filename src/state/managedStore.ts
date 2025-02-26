import { StoreApi, UseBoundStore, create } from 'zustand';
import { Matcher } from '@/types';
import { ManagedState } from '@/types/State';

export const createManagedStore = (
  matchers?: Matcher[],
  locked?: boolean,
): UseBoundStore<StoreApi<ManagedState>> =>
  create<ManagedState>(() => ({
    matchers,
    locked,
  }));
