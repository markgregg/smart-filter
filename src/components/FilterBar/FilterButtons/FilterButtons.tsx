import React from 'react';
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { MdOutlineClear } from "react-icons/md";
import { CgUndo } from "react-icons/cg";
import { CiLock, CiUnlock } from "react-icons/ci";
import { Button } from '../../common/Button';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import { DEFAULT_FILTER_BAR_HEIGHT } from '@/util/constants';
import { useConfig, useFilterBar, useMatcher } from '@/components/StateProvider/useState';
import s from './style.module.less';

export const FilterButtons = React.forwardRef<HTMLDivElement>((_, ref) => {
  const {
    filterBarHeight = DEFAULT_FILTER_BAR_HEIGHT,
    allowLocking,
    showUndoIcon,
  } = useConfig(state => state);
  const {
    enableExpand,
    expanded,
    setExpanded,
  } = useFilterBar(state => state);
  const clearMatchers = useMatcher(state => state.clearMatchers);

  const handleClearClick = useDynamicCallback(() => {
    clearMatchers();
  });

  const handleUndoClick = useDynamicCallback(() => {
  });

  const handleLockClick = useDynamicCallback(() => {
  });

  const handleExpandClick = useDynamicCallback(() => {
    setExpanded(!expanded);
  });

  const buttons = [
    {
      id: 'clear',
      Icon: MdOutlineClear,
      onClick: handleClearClick,
      hide: false
    },
    {
      id: 'undo',
      Icon: CgUndo,
      onClick: handleUndoClick,
      hide: showUndoIcon
    },
    {
      id: 'lock',
      Icon: expanded ? CiUnlock : CiLock,
      onClick: handleLockClick,
      hide: !allowLocking
    },
    {
      id: 'expand',
      Icon: expanded ? FaCaretUp : FaCaretDown,
      onClick: handleExpandClick,
      disabled: !enableExpand
    }
  ];

  return (
    <div
      className={s.buttons}
      style={{ height: filterBarHeight - 2 }}
      ref={ref}
    >
      {buttons.filter(b => !b.hide).map(b => (<Button
        key={b.id}
        onClick={b.onClick}
        height={filterBarHeight - 2}
        width={26}
        disabled={b.disabled}
      ><b.Icon /></Button>))}
    </div>)
});