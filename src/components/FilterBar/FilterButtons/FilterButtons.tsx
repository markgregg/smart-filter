import React from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { MdOutlineClear } from 'react-icons/md';
import { CgUndo } from 'react-icons/cg';
import { AiFillLock, AiFillUnlock } from 'react-icons/ai';
import { Button } from '../../common/Button';
import { useConfig, useFilterBar, useMatcher, useSort } from '@/state/useState';
import s from './style.module.less';
import { COMPACT_HEIGHT, LARGE_HEIGHT, NORMAL_HEIGHT } from '@/util/constants';

export const FilterButtons = React.forwardRef<HTMLDivElement>((_, ref) => {
  const {
    size = 'normal',
    allowLocking,
    showUndoIcon,
    onClear,
    onLock,
    onExpand,
  } = useConfig((state) => state);
  const { enableExpand, expanded, setExpanded, locked, setlocked } =
    useFilterBar((state) => state);
  const { clearMatchers, lockMatchers, unlockMatchers, undo } = useMatcher(
    (state) => state,
  );
  const clearSort = useSort((state) => state.clearSort);

  const buttonHeight =
    size === 'normal'
      ? NORMAL_HEIGHT - 2
      : size === 'compact'
        ? COMPACT_HEIGHT - 2
        : LARGE_HEIGHT - 2;

  const handleClearClick = React.useCallback(() => {
    clearMatchers();
    clearSort();
    if (onClear) {
      onClear();
    }
  }, [clearMatchers, onClear]);

  const handleUndoClick = React.useCallback(() => {
    undo();
  }, [undo]);

  const handleLockClick = React.useCallback(() => {
    if (locked) {
      unlockMatchers();
    } else {
      lockMatchers();
    }
    const newLocked = !locked;
    setlocked(newLocked);
    if (onLock) {
      onLock(newLocked);
    }
  }, [locked, setlocked, unlockMatchers, lockMatchers, onLock]);

  const handleExpandClick = React.useCallback(() => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (onExpand) {
      onExpand(newExpanded);
    }
  }, [expanded, setExpanded, onExpand]);

  const buttons = [
    {
      id: 'sf-clear-icon',
      Icon: MdOutlineClear,
      onClick: handleClearClick,
      hide: false,
    },
    {
      id: 'sf-undo-icon',
      Icon: CgUndo,
      onClick: handleUndoClick,
      hide: !showUndoIcon,
    },
    {
      id: 'sf-lock-icon',
      Icon: locked ? AiFillLock : AiFillUnlock,
      onClick: handleLockClick,
      hide: !allowLocking,
    },
    {
      id: 'sf-expand-icon',
      Icon: expanded ? FaCaretUp : FaCaretDown,
      onClick: handleExpandClick,
      disabled: !enableExpand,
    },
  ];

  return (
    <div className={[s.buttons, s[size]].join(' ')} ref={ref}>
      {buttons
        .filter((b) => !b.hide)
        .map((b) => (
          <Button
            id={b.id}
            key={b.id}
            onClick={b.onClick}
            height={buttonHeight}
            width={26}
            disabled={b.disabled}
          >
            <b.Icon />
          </Button>
        ))}
    </div>
  );
});
