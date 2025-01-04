import React from 'react';
import { Field, Matcher } from '@/types';
import { getDefaultComparison, hasError } from '@/util/functions';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import { useConfig, useFilterBar, useMatcher } from '../StateProvider/useState';
import { IoClose } from "react-icons/io5";
import { Button } from '../common/Button';
import { ArrayContent, RangeContent, ValueContent } from './Content';
import { BracketContent } from './Content/BracketContent';
import s from './style.module.less';
import { Or } from './Or';
import { OR } from '@/util/constants';

interface PillProps {
  matcher: Matcher;
  tabIndex: number;
}

export interface ContentProps {
  matcher: Matcher;
  field: Field | null;
}

export const Pill = React.memo(({ matcher, tabIndex }: PillProps) => {
  const pillRef = React.useRef<HTMLDivElement | null>(null);
  const [mouseOver, setMouseOver] = React.useState<boolean>(false);
  const {
    fieldMap,
    comparisonsMap,
    pillHeight,
  } = useConfig(state => state);
  const {
    deleteMatcher,
    selectedMatcher,
    editMatcher,
    selectMatcher,
  } = useMatcher(state => state);
  const expanded = useFilterBar(state => state.expanded);
  const field = React.useMemo(() => 'field' in matcher ? fieldMap.get(matcher.field) ?? null : null, [fieldMap, matcher]);
  const backgroundColor = React.useMemo(() => {
    if (hasError(matcher)) {
      return mouseOver ? 'rgb(195 81 74)' : '#9a3d37';
    }
    if (selectedMatcher?.key === matcher.key) {
      return mouseOver ? '#3C3C3C' : '#1C1C1C';
    }
    if (mouseOver) {
      return '#444444';
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
  }, [matcher, selectedMatcher, comparisonsMap, mouseOver]);

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
    deleteMatcher(matcher);
  });

  const handleMatcherClicked = useDynamicCallback(() => {
    selectMatcher(matcher.key);
  });

  const handleMouseEnter = useDynamicCallback(() => {
    setMouseOver(true);
    setTimeout(() => {
      if (mouseOver) {
        setMouseOver(false);
      }
    }, 2000);
  });

  const handleMouseLeave = useDynamicCallback(() => {
    setMouseOver(false);
  });

  return (
    <div
      className={s.pill}
      ref={pillRef}
      tabIndex={tabIndex}
    >
      {matcher.operator === OR && <Or matcher={matcher} />}
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
        {'field' in matcher && <span className={s.field}>{matcher.field}</span>}
        {'valueArray' in matcher && <span className={s.arrayCount}>({matcher.valueArray.length})</span>}
        {(('comparison' in matcher) && field && getDefaultComparison(field) !== matcher.comparison)
          && <span className={s.comparison}>{matcher.comparison}</span>}
        <Content matcher={matcher} field={field} />
        {mouseOver && <div className={s.closeButton}>
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
    </div>
  )
});
