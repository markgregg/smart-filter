import React from 'react';
import { IoSearch } from 'react-icons/io5';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { MdOutlineClear } from 'react-icons/md';
import { CgUndo } from 'react-icons/cg';
import { Button } from '../../common/Button';
import { useConfig, useFilterBar, useMatcher, useSort } from '@/state/useState';
import s from './style.module.less';
import { COMPACT_HEIGHT, LARGE_HEIGHT, NORMAL_HEIGHT } from '@/util/constants';

export const FilterButtons = React.forwardRef<HTMLDivElement>((_, ref) => {
  const {
    size = 'normal',
    showUndoIcon,
    onClear,
    onExpand,
  } = useConfig((state) => state);
  const { enableExpand, expanded, setExpanded } = useFilterBar(
    (state) => state,
  );
  const { clearMatchers, undo, matchers } = useMatcher((state) => state);
  const { clearSort, sort } = useSort((state) => state);

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
      hide: sort.length === 0 && matchers.length === 0,
    },
    {
      id: 'sf-undo-icon',
      Icon: CgUndo,
      onClick: handleUndoClick,
      hide: !showUndoIcon,
    },
    {
      id: 'sf-expand-icon',
      Icon: !enableExpand ? IoSearch : expanded ? FaCaretUp : FaCaretDown,
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
