import React from 'react';
import { Field, Matcher } from '@/types';
import { getDefaultComparison, hasError } from '@/util/functions';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import { useBrackets, useConfig, useFilterBar, useMatcher, useMatcherDrag } from '../StateProvider/useState';
import { IoClose } from "react-icons/io5";
import { AiFillLock } from "react-icons/ai";
import { Button } from '../common/Button';
import { ArrayContent, RangeContent, ValueContent } from './Content';
import { BracketContent } from './Content/BracketContent';
import { Or } from './Or';
import { DEFAULT_PILL_HEIGHT, OR } from '@/util/constants';
import s from './style.module.less';

interface PillProps {
  matcher: Matcher;
  index: number;
}

export interface ContentProps {
  matcher: Matcher;
  field: Field | null;
}

export const Pill = React.memo(({ matcher, index }: PillProps) => {
  const pillRef = React.useRef<HTMLDivElement | null>(null);
  const [mouseOver, setMouseOver] = React.useState<boolean>(false);
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  const {
    fieldMap,
    comparisonsMap,
    pillHeight = DEFAULT_PILL_HEIGHT,
  } = useConfig(state => state);
  const {
    deleteMatcher,
    selectedMatcher,
    editMatcher,
    selectMatcher,
    clearEditMatcher,
    moveTo,
  } = useMatcher(state => state);
  const expanded = useFilterBar(state => state.expanded);
  const {
    draggedItem,
    dragOverItem,
    setDragItem,
    setDraggedOverItem,
    clearItems,
  } = useMatcherDrag(state => state);
  const { unmatchedBrackets, hoverBracket, matchingHover, setHoverBracket } = useBrackets(state => state);
  const field = React.useMemo(() => 'field' in matcher ? fieldMap.get(matcher.field) ?? null : null, [fieldMap, matcher]);
  const backgroundColor = React.useMemo(() => {
    if (hasError(matcher) || unmatchedBrackets.has(matcher.key)) {
      return mouseOver ? 'rgb(195 81 74)' : '#9a3d37';
    }
    if (selectedMatcher?.key === matcher.key) {
      return mouseOver ? '#3C3C3C' : '#1C1C1C';
    }
    if (mouseOver || matchingHover === matcher.key) {
      return '#189bcd';
    }
    if ('valueArray' in matcher && comparisonsMap.has('list')) {
      return comparisonsMap.get('list')?.pillBackgroundColour ?? 'rgb(98,98,98)';
    }
    if ('valueTo' in matcher && comparisonsMap.has('range')) {
      return comparisonsMap.get('range')?.pillBackgroundColour ?? 'rgb(98,98,98)';
    }
    if ('comparison' in matcher && comparisonsMap.has(matcher.comparison)) {
      return comparisonsMap.get(matcher.comparison)?.pillBackgroundColour ?? 'rgb(98,98,98)';
    }
    return 'rgb(98,98,98)';
  }, [matcher, selectedMatcher, comparisonsMap, mouseOver, matchingHover, unmatchedBrackets]);

  React.useEffect(() => {
    if (pillRef.current && !expanded && (editMatcher?.key === matcher.key || selectedMatcher?.key === matcher.key)) {
      pillRef.current.scrollIntoView({ behavior: 'smooth' });
      pillRef.current.focus();
    };
  }, [editMatcher, selectedMatcher, matcher]);

  const Content = React.useMemo(() => 'bracket' in matcher
    ? BracketContent
    : 'valueArray' in matcher
      ? ArrayContent
      : 'valueTo' in matcher
        ? RangeContent
        : ValueContent, [matcher]);

  const handleDeleteMatcher = useDynamicCallback(() => {
    if (!matcher.locked) {
      deleteMatcher(matcher);
    }
  });

  const handleMatcherClicked = useDynamicCallback(() => {
    selectMatcher(matcher.key);
  });

  const handleMouseEnter = useDynamicCallback(() => {
    setMouseOver(true);
    if ('bracket' in matcher && hoverBracket !== matcher.key) {
      setHoverBracket(matcher.key);
    }
    setShowDelete(true);
    setTimeout(() => {
      if (showDelete) {
        setShowDelete(false);
      }
    }, 1000);
  });

  const handleMouseLeave = useDynamicCallback(() => {
    setMouseOver(false);
    setShowDelete(false);
    if (hoverBracket === matcher.key) {
      setHoverBracket(null);
    }
  });

  const handleDragStart = useDynamicCallback((event: React.DragEvent) => {
    if (matcher.locked) {
      return;
    }
    if (!draggedItem || draggedItem.item.key !== matcher.key) {
      setDragItem(matcher, index);
      if (editMatcher?.key === matcher.key) {
        clearEditMatcher();
      }
      event.dataTransfer.dropEffect = 'move';
      event.stopPropagation();
    }
  });

  const handleDragOver = useDynamicCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (matcher.locked) {
      return;
    }
    if (draggedItem) {
      var bounds = event.currentTarget.getBoundingClientRect();
      const position = bounds.left + (bounds.width / 2) > event.clientX
        ? 'before'
        : 'after';
      if (draggedItem.item.key !== matcher.key && (!dragOverItem || dragOverItem.item.key !== matcher.key || dragOverItem.position !== position)) {
        setDraggedOverItem(matcher, index, position);
      }
      event.dataTransfer.dropEffect = 'move';
      event.preventDefault();
    }
  });

  const handleDrop = useDynamicCallback((event: React.DragEvent) => {
    if (matcher.locked) {
      return;
    }
    if (dragOverItem && draggedItem) {
      moveTo(draggedItem.index, dragOverItem.index, dragOverItem.position ?? 'before');
    }
    clearItems();
    event.stopPropagation();
  });

  const handleDragEnd = useDynamicCallback((event: React.DragEvent) => {
    clearItems();
    event.stopPropagation();
  });


  return (
    <div
      className={s.pill}
      ref={pillRef}
      tabIndex={index}
      draggable={!matcher.locked}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
    >
      {dragOverItem?.item?.key === matcher.key && dragOverItem?.position === 'before' && <div className={s.leftInsert} style={{ height: pillHeight * .8 }} />}
      {matcher.operator === OR && index > 0 && <Or matcher={matcher} />}
      <div
        className={s.pillContent}
        onClick={handleMatcherClicked}
        style={{
          backgroundColor,
          height: pillHeight,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {matcher.locked && <div className={s.locked}><AiFillLock /></div>}
        {'field' in matcher && <span className={s.field}>{matcher.field}</span>}
        {'valueArray' in matcher && <span className={s.arrayCount}>({matcher.valueArray.length})</span>}
        {(('comparison' in matcher) && field && getDefaultComparison(field) !== matcher.comparison)
          && <span className={s.comparison}>{matcher.comparison}</span>}
        <Content matcher={matcher} field={field} />
        {showDelete && !matcher.locked && <div className={s.closeButton}>
          <Button
            onClick={handleDeleteMatcher}
            height={12}
            width={12}
            color='white'
            hoverColor='black'
            backgroundColor='red'
            hoverBackgroundColor='white'
            style={{
              alignSelf: 'center',
              marginLeft: '3px',
              paddingBlock: 0,
              paddingInline: 0,
              borderRadius: '3px',
            }}
          ><IoClose /></Button>
        </div>}
      </div>
      {dragOverItem?.item?.key === matcher.key && dragOverItem?.position === 'after' && <div className={s.rightInsert} style={{ height: pillHeight * .8 }} />}
    </div>
  )
});
