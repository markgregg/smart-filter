import React from 'react';
import { SearchBox } from '../SearchBox';
import { Brackets, Option } from '@/types';
import { useConfig, useMatcher, useOptions } from '../../state/useState';
import {
  createField,
  createRangeValue,
  createValue,
  getDefaultComparison,
} from '@/util/functions';
import { AND } from '@/util/constants';
import s from './style.module.less';

interface MainSearchProps {
  reducedWidth?: boolean;
  position?: number;
}

export const MainSearch = React.memo(
  ({ reducedWidth, position }: MainSearchProps) => {
    const [text, setText] = React.useState<string[]>(['']);
    const { fieldMap, size = 'normal' } = useConfig((state) => state);
    const { addValue, editPosition, addBracket } = useMatcher((state) => state);
    const { comparison, operator } = useOptions((state) => state);
    const maxWidth = reducedWidth ? '130px' : undefined;

    const handleCreateBracket = React.useCallback(
      (bracket: Brackets) => {
        addBracket(bracket, editPosition);
      },
      [addBracket],
    );

    const handleSelect = React.useCallback(
      (option: Option) => {
        const field = fieldMap.get(option.field);
        const value =
          option.type === 'f'
            ? createField(field)
            : option.type === 'r'
              ? createRangeValue(option)
              : createValue(option);
        if (value) {
          addValue({
            value,
            position: editPosition,
            operator: operator ?? AND,
            comparison: comparison ?? getDefaultComparison(field),
          });
        }
        setText(['']);
      },
      [addValue, fieldMap, editPosition, operator, comparison],
    );

    return (
      <div
        className={[s.searchPill, s[size]].join(' ')}
        style={{
          maxWidth,
        }}
      >
        <SearchBox
          text={text}
          onSelect={handleSelect}
          onCreateBracket={handleCreateBracket}
          position={position}
        />
      </div>
    );
  },
);
