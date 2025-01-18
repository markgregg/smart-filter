import React from 'react';
import { useConfig, useFilterBar, useMatcher, useSort } from '@/state/useState';
import { DEFAULT_SORT_PILL_WIDTH } from '@/util/constants';
import { SortField } from './SortField';
import { Colours } from '@/util/colours';
import { useSizeWatcher } from '@/hooks/useSizeWatcher';
import { CloseButton } from '../CloseButton';
import s from './style.module.less';

export const SortPill = React.memo(() => {
  const sortContentRef = React.useRef<HTMLDivElement | null>(null);
  const [mouseOver, setMouseOver] = React.useState<boolean>(false);
  const {
    size = 'normal',
    sortPillWidth: maxWidth = DEFAULT_SORT_PILL_WIDTH,
  } = useConfig((state) => state);
  const { sort, clearSort, setActive, active } = useSort((state) => state);
  const { clearSelections } = useMatcher((state) => state);
  const expanded = useFilterBar((state) => state.expanded);

  const { width: contentWidth = 0 } = useSizeWatcher(sortContentRef.current);

  const backgroundColor = React.useMemo(() => {
    if (mouseOver) {
      return Colours.backgrounds.hover;
    }
    if (active) {
      return Colours.backgrounds.selected;
    }
    return Colours.backgrounds.standard;
  }, [mouseOver, active]);

  const handleMouseEnter = React.useCallback(() => {
    setMouseOver(true);
  }, [setMouseOver]);

  const handleMouseLeave = React.useCallback(() => {
    setMouseOver(false);
  }, [setMouseOver]);

  const handleClearSort = React.useCallback(() => {
    clearSort();
  }, [clearSort]);

  const handleClick = React.useCallback(() => {
    setActive(true);
    clearSelections();
  }, [setActive, clearSelections]);

  return (
    <div
      id="sf-sort-pill"
      className={[s.sortPill, s[size], s[expanded ? 'expanded' : 'contracted']].join(' ')}
      style={{
        backgroundColor,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className={s.sortTitle}>Sort ({sort.length})</div>
      <div ref={sortContentRef} className={s.sortFields} style={{ maxWidth }}>
        {sort.map((srt) => (
          <SortField key={srt.field} sort={srt} />
        ))}
      </div>
      {contentWidth >= maxWidth && <div>...</div>}
      {mouseOver && <CloseButton onClick={handleClearSort} />}
    </div>
  );
});
