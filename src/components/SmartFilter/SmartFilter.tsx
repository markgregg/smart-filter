import React from 'react';
import { SmartFilterProps } from '@/types';
import { FilterBar } from '../FilterBar';
import { StateProvider } from '../../state/StateProvider';

export const SmartFilter = React.memo((props: SmartFilterProps) => (
  <StateProvider props={props}>
    <FilterBar />
  </StateProvider>
));
