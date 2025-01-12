import React from 'react';
import { IoClose } from 'react-icons/io5';
import { useConfig, useSort } from '@/state/useState';
import { Button } from '@/components/common/Button';
import { Sort, SortDirection } from '@/types';
import { Colours } from '@/util/colours';
import { SortOption } from '@/components/Suggestions/Operators/FieldSelection/SortOption';
import s from './style.module.less';

interface SortItemProps {
  sort: Sort;
}

export const SortItem = React.memo(
  ({ sort }: SortItemProps) => {
    const fieldMap = useConfig((state) => state.fieldMap);
    const field = React.useMemo(() => fieldMap?.get(sort.field), [fieldMap, sort]);
    const {
      removeSort,
      updateSort,
    } = useSort((state) => state);

    const handleDeleteArrayItem = React.useCallback(() => {
      removeSort(sort.field);
    }, [removeSort, sort]);

    const handleSelect = React.useCallback((field: string, sortDirection: SortDirection) => {
      updateSort(field, sortDirection);
    }, [updateSort]);

    return (
      <div
        className={s.sortItem}
      >
        <Button
          onClick={handleDeleteArrayItem}
          height={12}
          width={12}
          color={Colours.buttons.arrayItem}
          hoverColor={Colours.buttons.arrayItemhover}
          backgroundColor={Colours.buttons.arrayItembackground}
          hoverBackgroundColor={Colours.buttons.arrayItemHoverBackground}
          style={{
            alignSelf: 'center',
            marginLeft: '3px',
            paddingBlock: 0,
            paddingInline: 0,
          }}
        >
          <IoClose />
        </Button>
        <div className={s.sortOption}>
          {field && <SortOption field={field} onSelect={handleSelect} />}
        </div>
      </div>
    );
  },
);
