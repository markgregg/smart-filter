import React from 'react';
import { RiSortAsc, RiSortDesc } from 'react-icons/ri';
import { Sort } from '@/types/sort';
import { useConfig, useSort } from '@/state/useState';
import { Button } from '@/components/common/Button';
import { Colours } from '@/util/colours';
import { DEFAULT_SORT_PILL_WIDTH } from '@/util/constants';
import s from './style.module.less';
import { useSizeWatcher } from '@/hooks/useSizeWatcher';

interface SortFieldProps {
  sort: Sort;
}

export const SortField = React.memo(({ sort }: SortFieldProps) => {
  const fieldRef = React.useRef<HTMLDivElement | null>(null);
  const { fieldMap, sortPillWidth = DEFAULT_SORT_PILL_WIDTH } = useConfig(
    (state) => state,
  );
  const updateSort = useSort((state) => state.updateSort);

  const field = React.useMemo(() => fieldMap.get(sort.field), [fieldMap, sort]);

  const { width = 0 } = useSizeWatcher(fieldRef.current);

  const display = React.useMemo(() => {
    if (fieldRef.current) {
      const parentLeft =
        fieldRef.current.parentElement?.offsetLeft ??
        fieldRef.current.offsetLeft;
      const right =
        fieldRef.current.offsetLeft - parentLeft + fieldRef.current.offsetWidth;
      if (right > sortPillWidth) {
        return fieldRef.current.offsetWidth < sortPillWidth ? 'field' : 'none';
      }
    }
    return 'all';
  }, [width, sortPillWidth]);

  const handleClick = () => {
    updateSort(sort.field, sort.sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div ref={fieldRef}>
      {display !== 'none' && (
        <div className={s.sortField}>
          <div className={s.sortText}>{field?.title}</div>
          {display !== 'field' ? (
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
          ) : (
            <div style={{ width: 20 }} />
          )}
        </div>
      )}
    </div>
  );
});
