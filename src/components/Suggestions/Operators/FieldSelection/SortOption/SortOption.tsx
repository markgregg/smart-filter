import React from 'react';
import { Button } from '../../../../common/Button';
import { RiSortAsc, RiSortDesc } from "react-icons/ri";
import { Field } from '@/types';
import { SortDirection } from '@/types/sort';
import { useConfig, useSort } from '@/state/useState';
import s from './style.module.less';
import { DEFAULT_SORT_OPTION_WIDTH } from '@/util/constants';

interface SortOptionProps {
  field: Field;
  onSelect: (field: string, sortDirection: SortDirection) => void;
}

export const SortOption = React.memo(
  ({
    field,
    onSelect
  }: SortOptionProps) => {
    const maxWidth = useConfig((state) => state.sortOptionWidth) ?? DEFAULT_SORT_OPTION_WIDTH;
    const sort = useSort((state) => state.sort);
    const currentDirection = React.useMemo(() => sort.find((s) => s.field === field.name)?.sortDirection, [sort, field]);

    const handleAscClick = React.useCallback(() => {
      onSelect(field.name, 'asc');
    }, [onSelect, field]);

    const handleDescClick = React.useCallback(() => {
      onSelect(field.name, 'desc');
    }, [onSelect, field]);

    return (
      <div
        className={s.sortOption}
      >
        <div
          className={s.optionText}
          style={{
            maxWidth
          }}
        >{field.title}
        </div>
        <div className={s.sortButtons}>
          <Button
            onClick={handleAscClick}
            height={26}
            width={26}
            backgroundColor={currentDirection === 'asc' ? 'darkgray' : undefined}
          >
            <RiSortAsc />
          </Button>
          <Button
            onClick={handleDescClick}
            height={26}
            width={26}
            backgroundColor={currentDirection === 'desc' ? 'darkgray' : undefined}
          >
            <RiSortDesc />
          </Button>
        </div>
      </div>
    );
  },
);
