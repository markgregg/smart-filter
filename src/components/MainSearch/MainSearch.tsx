import React from 'react';
import { SearchBox } from '../SearchBox';
import { Option } from '@/types';
import { useConfig, useMatcher, useOptions } from '../../state/useState';
import {
  createRangeValue,
  createValue,
  getDefaultComparison,
} from '@/util/functions';
import { AND, TEXT_TO, VALUE_TO } from '@/util/constants';
import s from './style.module.less';

interface MainSearchProps {
  reducedWidth?: boolean;
  position?: number;
}

export const MainSearch = React.memo(
  ({ reducedWidth, position }: MainSearchProps) => {
    const [text, setText] = React.useState<string[]>(['']);
    const fieldMap = useConfig((state) => state.fieldMap);
    const { addValue, editPosition } = useMatcher((state) => state);
    const { comparison, operator } = useOptions((state) => state);
    const maxWidth = reducedWidth ? '130px' : undefined;

    const handleSelect = React.useCallback(
      (option: Option) => {
        const field = fieldMap.get(option.field);
        const value =
          VALUE_TO in option && TEXT_TO in option
            ? createRangeValue(option)
            : createValue(option);
        addValue({
          fieldMap,
          value,
          position: editPosition,
          operator: operator ?? AND,
          comparison: comparison ?? getDefaultComparison(field),
        });
        setText(['']);
      },
      [addValue, fieldMap, editPosition, operator, comparison],
    );

    return (
      <div
        className={s.searchPill}
        style={{
          maxWidth,
        }}
      >
        <SearchBox text={text} onSelect={handleSelect} position={position} />
      </div>
    );
  },
);
