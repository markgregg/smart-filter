import React from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { MdOutlineClear } from 'react-icons/md';
import { CgUndo } from 'react-icons/cg';
import { AiFillLock, AiFillUnlock } from 'react-icons/ai';
import { Button } from '../../common/Button';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import { DEFAULT_FILTER_BAR_HEIGHT } from '@/util/constants';
import { useConfig, useFilterBar, useMatcher } from '@/state/useState';
import s from './style.module.less';

export const FilterButtons = React.forwardRef<HTMLDivElement>((_, ref) => {
  const {
    filterBarHeight = DEFAULT_FILTER_BAR_HEIGHT,
    allowLocking,
    showUndoIcon,
  } = useConfig((state) => state);
  const { enableExpand, expanded, setExpanded, locked, setlocked } =
    useFilterBar((state) => state);
  const { clearMatchers, lockMatchers, unlockMatchers } = useMatcher(
    (state) => state,
  );

  const handleClearClick = useDynamicCallback(() => {
    clearMatchers();
    if (locked) {
      unlockMatchers();
    }
  });

  const handleUndoClick = useDynamicCallback(() => {});

  const handleLockClick = useDynamicCallback(() => {
    if (locked) {
      unlockMatchers();
    } else {
      lockMatchers();
    }
    setlocked(!locked);
  });

  const handleExpandClick = useDynamicCallback(() => {
    setExpanded(!expanded);
  });

  const buttons = [
    {
      id: 'clear',
      Icon: MdOutlineClear,
      onClick: handleClearClick,
      hide: false,
    },
    {
      id: 'undo',
      Icon: CgUndo,
      onClick: handleUndoClick,
      hide: showUndoIcon,
    },
    {
      id: 'lock',
      Icon: locked ? AiFillLock : AiFillUnlock,
      onClick: handleLockClick,
      hide: !allowLocking,
    },
    {
      id: 'expand',
      Icon: expanded ? FaCaretUp : FaCaretDown,
      onClick: handleExpandClick,
      disabled: !enableExpand,
    },
  ];

  return (
    <div
      className={s.buttons}
      style={{ height: filterBarHeight - 2 }}
      ref={ref}
    >
      {buttons
        .filter((b) => !b.hide)
        .map((b) => (
          <Button
            key={b.id}
            onClick={b.onClick}
            height={filterBarHeight - 2}
            width={26}
            disabled={b.disabled}
          >
            <b.Icon />
          </Button>
        ))}
    </div>
  );
});
