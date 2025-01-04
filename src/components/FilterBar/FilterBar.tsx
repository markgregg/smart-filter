import React from 'react';
import { TbFilter } from "react-icons/tb";
import { FaCaretRight, FaCaretLeft } from "react-icons/fa6";
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import { PillContainer } from '../PillContainer';
import { FilterButtons } from './FilterButtons';
import { Dropdown } from '../Dropdown';
import { DEFAULT_FILTER_BAR_HEIGHT, KeyBoardkeys } from '@/util/constants';
import { useSizeWatcher } from '@/hooks/useSizeWatcher';
import { useArray, useConfig, useFilterBar, useFocus, useMatcher, useMouse, useOptions } from '../StateProvider/useState';
import { Button } from '../common/Button';
import s from './style.module.less';

export const FilterBar = React.memo(() => {
  const filterBuittons = React.useRef<HTMLDivElement | null>(null);
  const searchBar = React.useRef<HTMLDivElement | null>(null);
  const {
    filterBarHeight = DEFAULT_FILTER_BAR_HEIGHT,
    expandedLines,
    showSearchIcon,
  } = useConfig(state => state);
  const {
    hasFocus,
    setHasFocus,
  } = useFocus(state => state);
  const {
    hasMouse,
    setHasMouse,
  } = useMouse(state => state);
  const {
    editMatcher,
    next,
    prev,
    first,
    last,
    selectedIndex,
    editPosition,
  } = useMatcher(state => state);
  const { matcherKey, clearOptions } = useOptions(state => state);
  const { matcher, setMatcher } = useArray(state => state);
  const {
    expanded,
    enableExpand,
  } = useFilterBar(state => state);
  const { width = '100%' } = useSizeWatcher(searchBar.current);
  const height = expanded ? (expandedLines ? expandedLines * filterBarHeight : undefined) : filterBarHeight;

  const maxPillContainerWidth = (searchBar.current?.clientWidth ?? 2000) - (filterBuittons.current?.scrollWidth ?? 70) - (showSearchIcon ? 30 : 0);
  const showMovePrev = enableExpand && !expanded && (editPosition === null || editPosition > 0);
  const showMoveNext = enableExpand && !expanded && (editPosition !== null || editPosition !== null || selectedIndex !== null);

  React.useEffect(() => {
    if (matcherKey && matcherKey !== editMatcher?.key) {
      clearOptions();
    }
    if (matcher?.key !== editMatcher?.key) {
      setMatcher(null);
    }
  }, [editMatcher, matcherKey, matcher]);

  const handleFocus = useDynamicCallback(() => {
    if (!hasFocus) {
      setHasFocus(true);
    }
  });

  const handleLostFocus = useDynamicCallback(() => {
    if (hasFocus) {
      setHasFocus(false);
    }
  });

  const handleMouseEnter = useDynamicCallback(() => {
    setHasMouse(true);
  });

  const handleMouseLeave = useDynamicCallback(() => {
    setHasMouse(false);
  });

  const handleMovePrev = useDynamicCallback(() => {
    prev();
  });

  const handleMoveNext = useDynamicCallback(() => {
    next();
  });

  const handleKeyDown = useDynamicCallback((event: React.KeyboardEvent) => {
    let endPropogation = false;
    switch (event.key) {
      case KeyBoardkeys.ArrowRight:
        next();
        endPropogation = true;
        break;
      case KeyBoardkeys.ArrowLeft:
        prev();
        endPropogation = true;
        break;
      case KeyBoardkeys.Home:
        first();
        endPropogation = true;
        break;
      case KeyBoardkeys.End:
        last();
        endPropogation = true;
        break;
    }
    if (endPropogation) {
      event.stopPropagation();
      event.preventDefault();
    }
  });

  return (
    <div
      tabIndex={0}
      ref={searchBar}
      style={{ height: filterBarHeight }}
      className={s.searchBar}
      onFocus={handleFocus}
      onBlur={handleLostFocus}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      <div
        className={[s.searchBarInner, expanded ? s.multiLineSearchBar : ''].join(' ')}
        style={{
          height,
          width,
        }}
      >
        {showMovePrev && <Button
          onClick={handleMovePrev}
          height={filterBarHeight - 2}
          width={26}
        ><FaCaretLeft /></Button>}
        {showSearchIcon && <div className={s.filterIconContainer} style={{ height: filterBarHeight }}>
          <TbFilter />
        </div>}
        <div className={s.pullContainerWrapper}>
          <PillContainer maxWidth={maxPillContainerWidth} singleLine={!expanded} />
        </div>
        {showMoveNext && <Button
          onClick={handleMoveNext}
          height={filterBarHeight - 2}
          width={26}
        ><FaCaretRight /></Button>}
        <FilterButtons ref={filterBuittons} />
        {(hasFocus || hasMouse) && <Dropdown />}
      </div>
    </div>)
});