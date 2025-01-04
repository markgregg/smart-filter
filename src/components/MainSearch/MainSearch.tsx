import React from 'react';
import { SearchBox } from '../SearchBox';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import { Option } from '@/types';
import { useConfig, useMatcher, useOptions } from '../StateProvider/useState';
import { createRangeValue, createValue, getDefaultComparison } from '@/util/functions';
import { AND } from '@/util/constants';
import s from './style.module.less';

interface MainSearchProps {
  reducedWidth?: boolean;
  position?: number;
}

export const MainSearch = React.memo(({ reducedWidth, position }: MainSearchProps) => {
  const [text, setText] = React.useState<string[]>(['']);
  const fieldMap = useConfig(state => state.fieldMap);
  const { addValue, editPosition } = useMatcher(state => state);
  const { comparison, operator } = useOptions(state => state);
  const maxWidth = reducedWidth ? '130px' : undefined;

  const handleSelect = useDynamicCallback((option: Option) => {
    const field = fieldMap.get(option.field);
    const value = ('valueTo' in option && 'textTo' in option)
      ? createRangeValue(option)
      : createValue(option);
    addValue(value, editPosition, operator ?? AND, comparison ?? getDefaultComparison(field));
    setText(['']);
  });

  return (
    <div
      className={s.searchPill}
      style={{
        maxWidth
      }}
    >
      <SearchBox text={text} onSelect={handleSelect} position={position} />
    </div>
  )
});