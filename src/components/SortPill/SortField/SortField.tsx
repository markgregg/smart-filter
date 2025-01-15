import React from 'react';
import { RiSortAsc, RiSortDesc } from 'react-icons/ri';
import { Sort } from '@/types/sort';
import { useConfig, useSort } from '@/state/useState';
import { Button } from '@/components/common/Button';
import { Colours } from '@/util/colours';
import s from './style.module.less';

interface SortFieldProps {
  sort: Sort;
}

export const SortField = React.memo(({ sort }: SortFieldProps) => {
  const fieldMap = useConfig((state) => state.fieldMap);
  const updateSort = useSort((state) => state.updateSort);
  const field = React.useMemo(() => fieldMap.get(sort.field), [fieldMap, sort]);

  const handleClick = () => {
    updateSort(sort.field, sort.sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className={s.sortField}>
      <div className={s.sortText}>{field?.title}</div>
      <div className={s.sortIcon}>
        <Button
          onClick={handleClick}
          height={16}
          width={16}
          color={Colours.buttons.sort}
          backgroundColor={Colours.buttons.sortBackground}
          hoverColor={Colours.buttons.sortHover}
          hoverBackgroundColor={Colours.buttons.sortHoverBackground}
          style={{
            alignSelf: 'center',
            marginLeft: '3px',
            paddingBlock: 0,
            paddingInline: 0,
          }}
        >
          {sort.sortDirection === 'asc' ? <RiSortAsc /> : <RiSortDesc />}
        </Button>
      </div>
    </div>
  );
});
