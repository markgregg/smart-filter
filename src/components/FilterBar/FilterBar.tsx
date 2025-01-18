import React from 'react';
import { TbFilter } from 'react-icons/tb';
import { FaCaretRight, FaCaretLeft } from 'react-icons/fa6';
import { PillContainer } from '../PillContainer';
import { FilterButtons } from './FilterButtons';
import { Dropdown } from '../Dropdown';
import {
  COMPACT_HEIGHT,
  DEFAULT_SORT_PILL_WIDTH,
  KeyBoardkeys,
  LARGE_HEIGHT,
  NORMAL_HEIGHT,
} from '@/util/constants';
import { useSizeWatcher } from '@/hooks/useSizeWatcher';
import {
  useArray,
  useConfig,
  useFilterBar,
  useFocus,
  useManaged,
  useMatcher,
  useOptions,
  useSort,
} from '../../state/useState';
import { Button } from '../common/Button';
import { getMatchersFromText } from './functions';
import { SortPill } from '../SortPill';
import s from './style.module.less';

export const FilterBar = React.memo(() => {
  const filterBuittons = React.useRef<HTMLDivElement | null>(null);
  const searchBar = React.useRef<HTMLDivElement | null>(null);
  const {
    matchers: initialMatchers = [],
    sort: initialSort = [],
  } = useManaged((state) => state);
  const {
    size = 'normal',
    showSearchIcon,
    pasteOptions,
    fieldMap,
    enableSort,
    sortPillWidth = DEFAULT_SORT_PILL_WIDTH,
    showDropdownOnMouseOver,
    onChange,
    onSortChange,
  } = useConfig((state) => state);
  const { hasFocus, setHasFocus, hasMouse, setHasMouse, keyboardFocus } = useFocus(
    (state) => state,
  );
  const {
    editMatcher,
    next,
    prev,
    first,
    last,
    selectedIndex,
    editPosition,
    matchers,
    clearEditPosition,
    copyMatchers,
    insertMatchers,
    deleteMatchers,
    setMatchers,
    setFieldMap,
  } = useMatcher((state) => state);
  const { matcherKey, clearOptions } = useOptions((state) => state);
  const { matcher, setMatcher } = useArray((state) => state);
  const { expanded, enableExpand } = useFilterBar((state) => state);
  const { sort, active, setActive, setSort } = useSort((state) => state);

  const { width = '100%' } = useSizeWatcher(searchBar.current);

  const buttonHeight = size === 'normal'
    ? NORMAL_HEIGHT - 2
    : size === 'compact'
      ? COMPACT_HEIGHT - 2
      : LARGE_HEIGHT - 2;

  const showMovePrev =
    enableExpand && !expanded && (editPosition === null || editPosition > 0);
  const showMoveNext =
    enableExpand &&
    !expanded &&
    (editPosition !== null || editPosition !== null || selectedIndex !== null);

  const maxPillContainerWidth = Math.floor(
    (searchBar.current?.clientWidth ?? 2000) -
    (filterBuittons.current?.scrollWidth ?? 70) -
    (sort.length > 0 ? sortPillWidth + 60 : 0) -
    (showMoveNext ? 26 : 0) -
    (showMovePrev ? 26 : 0) -
    (showSearchIcon ? 30 : 0),
  );

  React.useEffect(() => {
    setFieldMap(fieldMap);
  }, [fieldMap, setFieldMap]);

  React.useEffect(() => {
    setMatchers(initialMatchers ?? []);
  }, [initialMatchers])

  React.useEffect(() => {
    setSort(initialSort ?? []);
  }, [initialSort]);

  React.useEffect(() => {
    if (onChange) {
      onChange(matchers);
    }
  }, [matchers, onChange])

  React.useEffect(() => {
    if (onSortChange) {
      onSortChange(sort);
    }
  }, [sort, onSortChange]);

  React.useEffect(() => {
    if (matcher?.key !== editMatcher?.key || !editMatcher) {
      setMatcher(null);
    }
  }, [editMatcher, matcher]);

  React.useEffect(() => {
    if (matcherKey && (matcherKey !== editMatcher?.key || !editMatcher)) {
      clearOptions();
    }
  }, [matcherKey, editMatcher]);

  React.useEffect(() => {
    if (editPosition !== null && editPosition === matchers.length) {
      clearEditPosition();
    }
  }, [editPosition, matchers]);

  React.useEffect(() => {
    if (active && (editMatcher !== null || selectedIndex !== null)) {
      setActive(false);
    }
  }, [active, setActive, selectedIndex, editMatcher]);

  const handleFocus = React.useCallback(() => {
    setHasFocus(true);
  }, [setHasFocus]);

  const handleLostFocus = React.useCallback(() => {
    setHasFocus(false);
  }, [setHasFocus]);

  const handleMouseEnter = React.useCallback(() => {
    setHasMouse(true);
  }, [setHasMouse]);

  const handleMouseLeave = React.useCallback(() => {
    setHasMouse(false);
  }, [setHasMouse]);

  const handleMovePrev = React.useCallback(() => {
    prev();
  }, [prev]);

  const handleMoveNext = React.useCallback(() => {
    next();
  }, [next]);

  const handleCopy = React.useCallback(() => {
    const matchersToCopy = matchers.filter(
      (m, i) =>
        selectedIndex === i || (copyMatchers && copyMatchers.includes(m.key)),
    );
    if (matchersToCopy.length > 0) {
      navigator.clipboard.writeText(JSON.stringify(matchersToCopy));
    }
  }, [matchers, selectedIndex, copyMatchers]);

  const handleCut = React.useCallback(() => {
    const matchersToCut = matchers.filter(
      (m, i) =>
        selectedIndex === i || (copyMatchers && copyMatchers.includes(m.key)),
    );
    if (matchersToCut.length > 0 && matchersToCut.every((m) => !m.locked)) {
      navigator.clipboard.writeText(JSON.stringify(matchersToCut));
      deleteMatchers(matchersToCut);
    }
  }, [matchers, selectedIndex, copyMatchers, deleteMatchers]);

  const handlePaste = React.useCallback(() => {
    navigator.clipboard.readText().then((text) => {
      const pasteMatchers = getMatchersFromText(text, fieldMap, pasteOptions);
      if (pasteMatchers) {
        insertMatchers(pasteMatchers, editPosition);
      }
    });
  }, [insertMatchers, fieldMap, pasteOptions, editPosition]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      let endPropogation = false;
      switch (event.key) {
        case KeyBoardkeys.ArrowRight: {
          next();
          endPropogation = true;
          break;
        }
        case KeyBoardkeys.ArrowLeft: {
          prev();
          endPropogation = true;
          break;
        }
        case KeyBoardkeys.Home: {
          first();
          endPropogation = true;
          break;
        }
        case KeyBoardkeys.End: {
          last();
          endPropogation = true;
          break;
        }
        case KeyBoardkeys.c:
        case KeyBoardkeys.C:
          if (event.ctrlKey) {
            handleCopy();
            endPropogation = true;
          }
          break;
        case KeyBoardkeys.x:
        case KeyBoardkeys.X:
          if (event.ctrlKey) {
            handleCut();
            endPropogation = true;
          }
          break;
        case KeyBoardkeys.v:
        case KeyBoardkeys.V:
          if (event.ctrlKey) {
            handlePaste();
            endPropogation = true;
          }
          break;
        default: {
          // ignore
        }
      }
      if (endPropogation) {
        event.stopPropagation();
        event.preventDefault();
      }
    },
    [first, last, next, prev, handleCopy, handlePaste, handleCut],
  );

  return (
    <div
      id="sf-filter-bar"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      ref={searchBar}
      className={[s.searchBar, s[size], s[`font-${size}`]].join(' ')}
      onFocus={handleFocus}
      onBlur={handleLostFocus}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      <div
        className={[
          s.searchBarInner,
          expanded ? s.multiLineSearchBar : '',
          s[size]
        ].join(' ')}
        style={{
          width,
        }}
      >
        {showSearchIcon && (
          <div
            className={[s.filterIconContainer, s[size]].join(' ')}
          >
            <TbFilter />
          </div>
        )}
        {showMovePrev && (
          <Button
            onClick={handleMovePrev}
            height={buttonHeight}
            width={26}
          >
            <FaCaretLeft />
          </Button>
        )}
        <div className={s.pullContainerWrapper}>
          <PillContainer
            maxWidth={maxPillContainerWidth}
            singleLine={!expanded}
          />
        </div>
        {showMoveNext && (
          <Button
            onClick={handleMoveNext}
            height={buttonHeight}
            width={26}
          >
            <FaCaretRight />
          </Button>
        )}
        {enableSort && sort.length > 0 && <SortPill />}
        <FilterButtons ref={filterBuittons} />
        {((!showDropdownOnMouseOver && hasFocus) || hasMouse || keyboardFocus) && <Dropdown />}
      </div>
    </div>
  );
});
