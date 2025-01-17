import React from 'react';
import { State } from '@/types/State';

// @ts-expect-error initialisation later
export const StateContext = React.createContext<State>();
