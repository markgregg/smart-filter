import React from 'react';
import { AiFillLock } from 'react-icons/ai';
import { Field, Matcher } from '@/types';
import { getDefaultComparison, hasError, isVisible } from '@/util/functions';
import {
  useBrackets,
  useConfig,
  useFilterBar,
  useMatcher,
  useMatcherDrag,
} from '../../state/useState';
import { ArrayContent, RangeContent, ValueContent } from './Content';
import { BracketContent } from './Content/BracketContent';
import { Or } from './Or';
import {
  BRACKET,
  DEFAULT_PILL_HEIGHT,
  OR,
  VALUE_ARRAY,
  VALUE_TO,
} from '@/util/constants';
import { Colours } from '@/util/colours';
import { CloseButton } from '../CloseButton';
import s from './style.module.less';
import { clonePill, removePillFromDocument } from '@/util/dragDrop';

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
  const clonedPillRef = React.useRef<HTMLElement | null>(null);
  const [mouseOver, setMouseOver] = React.useState<boolean>(false);
  const {
    fieldMap,
    comparisonsMap,
    pillHeight = DEFAULT_PILL_HEIGHT,
  } = useConfig((state) => state);
  const {
    deleteMatcher,
    selectedMatcher,
    focus,
    editMatcher,
    selectMatcher,
    clearEditMatcher,
    moveTo,
    addCopyMatcher,
    copyMatchers,
  } = useMatcher((state) => state);
  const { expanded, enableExpand } = useFilterBar((state) => state);
  const {
    draggedItem,
    dragOverItem,
    setDragItem,
    setDraggedOverItem,
    clearDragOverItem,
    clearItems,
  } = useMatcherDrag((state) => state);
  const { unmatchedBrackets, hoverBracket, matchingHover, setHoverBracket } =
    useBrackets((state) => state);
  const field = React.useMemo(
    () => ('field' in matcher ? (fieldMap.get(matcher.field) ?? null) : null),
    [fieldMap, matcher],
  );
  const backgroundColor = React.useMemo(() => {
    if (hasError(matcher) || unmatchedBrackets.has(matcher.key)) {
      return mouseOver
        ? Colours.backgrounds.errorHover
        : Colours.backgrounds.error;
    }
    if (matcher.locked && !copyMatchers?.includes(matcher.key)) {
      return Colours.backgrounds.locked;
    }
    if (mouseOver || matchingHover === matcher.key) {
      return Colours.backgrounds.hover;
    }
    if (selectedMatcher?.key === matcher.key) {
      return Colours.backgrounds.selected;
    }
    if (copyMatchers?.includes(matcher.key)) {
      return Colours.backgrounds.multiSelect;
    }
    if (VALUE_ARRAY in matcher && comparisonsMap.has('list')) {
      return (
        comparisonsMap.get('list')?.pillBackgroundColour ??
        Colours.backgrounds.standard
      );
    }
    if (VALUE_TO in matcher && comparisonsMap.has('range')) {
      return (
        comparisonsMap.get('range')?.pillBackgroundColour ??
        Colours.backgrounds.standard
      );
    }
    if ('comparison' in matcher && comparisonsMap.has(matcher.comparison)) {
      return (
        comparisonsMap.get(matcher.comparison)?.pillBackgroundColour ??
        Colours.backgrounds.standard
      );
    }
    return Colours.backgrounds.standard;
  }, [
    matcher,
    selectedMatcher,
    comparisonsMap,
    mouseOver,
    matchingHover,
    unmatchedBrackets,
    copyMatchers,
  ]);

  React.useEffect(() => {
    if (
      pillRef.current &&
      !expanded &&
      (editMatcher?.key === matcher.key ||
        (selectedMatcher?.key === matcher.key && focus))
    ) {
      if (enableExpand && !isVisible(pillRef.current)) {
        pillRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
      if (editMatcher?.key !== matcher.key) {
        pillRef.current.focus();
      }
    }
  }, [editMatcher, selectedMatcher, matcher, focus, expanded, enableExpand]);

  const Content = React.useMemo(
    () =>
      BRACKET in matcher
        ? BracketContent
        : VALUE_ARRAY in matcher
          ? ArrayContent
          : VALUE_TO in matcher
            ? RangeContent
            : ValueContent,
    [matcher],
  );

  const handleDeleteMatcher = React.useCallback(() => {
    if (!matcher.locked) {
      deleteMatcher(matcher);
    }
  }, [matcher, deleteMatcher]);

  const handleMatcherClicked = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.ctrlKey) {
        addCopyMatcher(matcher.key);
      } else {
        selectMatcher(matcher.key);
      }
      event.stopPropagation();
    },
    [selectMatcher, matcher],
  );

  const handleMouseEnter = React.useCallback(() => {
    setMouseOver(true);
    if (BRACKET in matcher && hoverBracket !== matcher.key) {
      setHoverBracket(matcher.key);
    }
  }, [setMouseOver, matcher, hoverBracket]);

  const handleMouseLeave = React.useCallback(() => {
    setMouseOver(false);
    if (hoverBracket === matcher.key) {
      setHoverBracket(null);
    }
  }, [setMouseOver, matcher, hoverBracket]);

  const handleDragStart = React.useCallback(
    (event: React.DragEvent) => {
      if (matcher.locked) {
        return;
      }
      if (!draggedItem || draggedItem.item.key !== matcher.key) {
        setDragItem(matcher, index);
        if (editMatcher?.key === matcher.key) {
          clearEditMatcher();
        }
        clonedPillRef.current = clonePill(event.currentTarget as HTMLElement);
        event.dataTransfer.dropEffect = 'move';
        const xLoc = Math.round(clonedPillRef.current.clientWidth / 2);
        event.dataTransfer.setDragImage(clonedPillRef.current, xLoc, 20);
        event.stopPropagation();
      }
    },
    [matcher, editMatcher, draggedItem, setDragItem, clearEditMatcher],
  );

  const handleDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (matcher.locked) {
        return;
      }
      if (draggedItem) {
        const bounds = event.currentTarget.getBoundingClientRect();
        const position =
          bounds.left + bounds.width / 2 > event.clientX ? 'before' : 'after';
        if (
          draggedItem.item.key !== matcher.key &&
          (!dragOverItem ||
            dragOverItem.item.key !== matcher.key ||
            dragOverItem.position !== position)
        ) {
          setDraggedOverItem(matcher, index, position);
          clearDragOverItem();
        }
        event.dataTransfer.dropEffect = 'move';
        event.preventDefault();
      }
    },
    [draggedItem, dragOverItem, matcher, index, setDraggedOverItem],
  );

  const clearClonedPill = React.useCallback(() => {
    if (clonedPillRef.current) {
      removePillFromDocument(clonedPillRef.current);
      clonedPillRef.current = null;
    }
  }, [removePillFromDocument]);

  const handleDrop = React.useCallback(
    (event: React.DragEvent) => {
      if (matcher.locked) {
        return;
      }
      if (dragOverItem && draggedItem) {
        moveTo(
          draggedItem.index,
          dragOverItem.index,
          dragOverItem.position ?? 'before',
        );
      }
      clearItems();
      clearClonedPill();
      event.stopPropagation();
    },
    [draggedItem, dragOverItem, clearClonedPill, clearItems, moveTo],
  );

  const handleDragEnd = React.useCallback(
    (event: React.DragEvent) => {
      clearItems();
      clearClonedPill();
      event.stopPropagation();
    },
    [clearClonedPill, clearItems],
  );

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
      style={{
        height: pillHeight,
      }}
    >
      {dragOverItem?.item?.key === matcher.key &&
        dragOverItem?.position === 'before' && (
          <div className={s.leftInsert} style={{ height: pillHeight * 0.8 }} />
        )}
      {matcher.operator === OR &&
        index > 0 &&
        (!(BRACKET in matcher) || matcher.bracket === '(') && (
          <Or matcher={matcher} />
        )}
      <div
        id="pill-content"
        className={s.pillContent}
        onClick={handleMatcherClicked}
        style={{
          backgroundColor,
          height: pillHeight,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {matcher.locked && (
          <div className={s.locked}>
            <AiFillLock className={s.lockIcon} />
          </div>
        )}
        {'field' in matcher && <span className={s.field}>{field?.title ?? matcher.field}</span>}
        {VALUE_ARRAY in matcher && (
          <span className={s.arrayCount}>({matcher.valueArray.length})</span>
        )}
        {'comparison' in matcher &&
          field &&
          getDefaultComparison(field) !== matcher.comparison && (
            <span className={s.comparison}>{matcher.comparison}</span>
          )}
        <Content matcher={matcher} field={field} />
        {mouseOver && !matcher.locked && (
          <CloseButton onClick={handleDeleteMatcher} />
        )}
      </div>
      {dragOverItem?.item?.key === matcher.key &&
        dragOverItem?.position === 'after' && (
          <div className={s.rightInsert} style={{ height: pillHeight * 0.8 }} />
        )}
    </div>
  );
});
