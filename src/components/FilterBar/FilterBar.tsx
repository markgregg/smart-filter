import React from 'react';
import { AiFillLock, AiFillUnlock } from 'react-icons/ai';
import { FaCaretRight, FaCaretLeft } from 'react-icons/fa6';
import { PillContainer } from '../PillContainer';
import { FilterButtons } from './FilterButtons';
import { Dropdown } from '../Dropdown';
import {
  COMPACT_HEIGHT,
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
} from '../../state/useState';
import { Button } from '../common/Button';
import s from './style.module.less';

export const FilterBar = React.memo(() => {
  const filterButtons = React.useRef<HTMLDivElement | null>(null);
  const searchBar = React.useRef<HTMLDivElement | null>(null);
  const { matchers: initialMatchers = [], locked: initialLocked } = useManaged(
    (state) => state,
  );
  const {
    allowLocking,
    size = 'normal',
    fieldMap,
    showDropdownOnMouseOver,
    onChange,
    onLock,
  } = useConfig((state) => state);
  const { hasFocus, setHasFocus, hasMouse, setHasMouse, keyboardFocus } =
    useFocus((state) => state);
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
    setMatchers,
    setFieldMap,
    lockMatchers,
    unlockMatchers,
  } = useMatcher((state) => state);
  const { matcherKey, clearOptions } = useOptions((state) => state);
  const { matcher, setMatcher } = useArray((state) => state);
  const { expanded, enableExpand, locked, setlocked } = useFilterBar(
    (state) => state,
  );
  const { width: maxWidth = '100%' } = useSizeWatcher(searchBar.current);

  const buttonHeight =
    size === 'normal'
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
      (filterButtons.current?.scrollWidth ?? 70) -
      (showMoveNext ? 26 : 0) -
      (showMovePrev ? 26 : 0) -
      (allowLocking ? 26 : 0),
  );

  React.useEffect(() => {
    setFieldMap(fieldMap);
  }, [fieldMap, setFieldMap]);

  React.useEffect(() => {
    setMatchers(initialMatchers ?? []);
  }, [initialMatchers]);

  React.useEffect(() => {
    setlocked(initialLocked ?? false);
  }, [initialLocked]);

  React.useEffect(() => {
    if (onChange) {
      onChange(matchers);
    }
  }, [matchers, onChange]);

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
        default: {
          // ignore
        }
      }
      if (endPropogation) {
        event.stopPropagation();
        event.preventDefault();
      }
    },
    [first, last, next, prev],
  );

  const handleLockClick = React.useCallback(() => {
    if (locked) {
      unlockMatchers();
    } else {
      lockMatchers();
    }
    const newlocked = !locked;
    setlocked(newlocked);
    if (onLock) {
      onLock(newlocked);
    }
  }, [locked, setlocked, onLock]);

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
        id="sf-inner-filter-bar"
        className={[
          s.searchBarInner,
          expanded ? s.multiLineSearchBar : '',
          s[size],
        ].join(' ')}
        style={{
          maxWidth,
        }}
      >
        {allowLocking && (
          <Button
            id="sf-lock-icon"
            onClick={handleLockClick}
            height={buttonHeight}
            width={26}
            style={{ alignSelf: 'flex-start' }}
          >
            {locked ? <AiFillLock /> : <AiFillUnlock />}
          </Button>
        )}
        {showMovePrev && (
          <Button onClick={handleMovePrev} height={buttonHeight} width={26}>
            <FaCaretLeft />
          </Button>
        )}
        <div className={s.pillContainerWrapper}>
          <PillContainer
            maxWidth={maxPillContainerWidth}
            singleLine={!expanded}
          />
        </div>
        {showMoveNext && (
          <Button onClick={handleMoveNext} height={buttonHeight} width={26}>
            <FaCaretRight />
          </Button>
        )}
        <FilterButtons ref={filterButtons} />
        {((!showDropdownOnMouseOver && hasFocus) ||
          hasMouse ||
          keyboardFocus) && <Dropdown />}
      </div>
    </div>
  );
});
