import { State } from '@/types/State';
import React from 'react';

// @ts-expect-error initialisation later
export const StateContext = React.createContext<State>();