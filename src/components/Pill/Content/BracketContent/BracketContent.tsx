import React from 'react';
import { ContentProps } from '../../Pill';
import { BracketMatcher } from '@/types';
import s from './style.module.less';

export const BracketContent = React.memo(({ matcher }: ContentProps) => {
  const bracketMatcher = matcher as BracketMatcher;

  return <div className={s.bracket}>{bracketMatcher.bracket}</div>;
});
