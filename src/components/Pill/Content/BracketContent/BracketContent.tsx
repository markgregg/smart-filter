import React from 'react';
import { ContentProps } from '../../Pill';
import { BracketMatcher } from '@/types';

export const BracketContent = React.memo(({ matcher }: ContentProps) => {
  const bracketMatcher = matcher as BracketMatcher;

  return (
    <div>{bracketMatcher.bracket}</div>
  )
});
