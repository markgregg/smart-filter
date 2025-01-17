import React from 'react';
import { ManagedState, State } from '@/types/State';

// @ts-expect-error initialisation later
export const StateContext = React.createContext<State>();
