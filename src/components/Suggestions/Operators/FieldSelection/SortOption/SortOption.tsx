import React from 'react';
import { RiSortAsc, RiSortDesc } from 'react-icons/ri';
import { Button } from '../../../../common/Button';
import { Field } from '@/types';
import { SortDirection } from '@/types/sort';
import { useConfig, useSort } from '@/state/useState';
import s from './style.module.less';
import { DEFAULT_SORT_OPTION_WIDTH } from '@/util/constants';

interface SortOptionProps {
  field: Field;
  onSelect: (field: string, sortDirection: SortDirection) => void;
}

export const SortOption = React.memo(({ field, onSelect }: SortOptionProps) => {
  const sortAscId = React.useMemo(() => `sf-${field.name}-asc-opt`, [field]);
  const sortDescId = React.useMemo(() => `sf-${field.name}-desc-opt`, [field]);

  const maxWidth =
    useConfig((state) => state.optionWidth) ?? DEFAULT_SORT_OPTION_WIDTH;
  const sort = useSort((state) => state.sort);
  const currentDirection = React.useMemo(
    () => sort.find((srt) => srt.field === field.name)?.sortDirection,
    [sort, field],
  );

  const handleAscClick = React.useCallback(() => {
    onSelect(field.name, 'asc');
  }, [onSelect, field]);

  const handleDescClick = React.useCallback(() => {
    onSelect(field.name, 'desc');
  }, [onSelect, field]);

  return (
    <div className={s.sortOption}>
      <div
        className={s.optionText}
        style={{
          maxWidth,
        }}
      >
        {field.title}
      </div>
      <div className={s.sortButtons}>
        <Button
          id={sortAscId}
          onClick={handleAscClick}
          height={26}
          width={26}
          backgroundColor={currentDirection === 'asc' ? 'darkgray' : undefined}
        >
          <RiSortAsc />
        </Button>
        <Button
          id={sortDescId}
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
});
