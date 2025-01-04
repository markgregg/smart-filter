import React from 'react';
import { Button } from '@/components/common/Button';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import { ArrayHint, Hint, Matcher, SingleValueHint, Value } from '@/types';
import { useConfig, useMatcher } from '@/components/StateProvider/useState';
import { createArrayValue, createRangeValue, createValue, getDefaultComparison } from '@/util/functions';
import s from './style.module.less';
import { AND } from '@/util/constants';

interface HintItemsProps {
  hints: Hint[];
  showAll?: boolean;
}

interface HintAndState {
  selected?: boolean;
  hint: Hint;
}

const containsHint = (hint: Hint, matcher: Matcher): boolean => {
  if (!('field' in matcher) || hint.field !== matcher.field) {
    return false;
  }
  if ('valueTo' in hint) {
    if (!('valueTo' in matcher)) {
      return false;
    }
    return matcher.value === hint.value && matcher.valueTo === hint.valueTo;
  }
  if ('valueArray' in hint) {
    if (!('valueArray' in matcher)) {
      return false;
    }
    for (const item in hint.valueArray) {
      if (!matcher.valueArray.includes(item)) {
        return false;
      }
    }
    return true;
  }
  if ('value' in hint) {
    if ('valueArray' in matcher) {
      return matcher.valueArray.includes(hint.value);
    }
    if ('value' in matcher && !('valueTo' in matcher)) {
      return matcher.value === hint.value;
    }
  }
  return false;
}

export const HintItems = React.memo(({ hints, showAll }: HintItemsProps) => {
  const {
    hints: {
      hintsPerColumn = 3,
      hintWidth: width = 90,
    } = {},
    fieldMap,
  } = useConfig(state => state);
  const { selectedMatcher, addValue, deleteMatcher, updateMatcher, editPosition, matchers } = useMatcher(state => state);
  const targetMatcher = React.useMemo(() => {
    if (selectedMatcher) {
      return selectedMatcher;
    }
    if (editPosition && editPosition < matchers.length) {
      return matchers[editPosition];
    }
    return matchers.length > 0 ? matchers[matchers.length - 1] : null;
  }, [matchers, selectedMatcher]);

  const handleValueClick = useDynamicCallback((hint: HintAndState) => {
    if (hint.selected) {
      if (targetMatcher) {
        if ('value' in targetMatcher) {
          deleteMatcher(targetMatcher);
          return;
        }
        if ('valueArray' in targetMatcher) {
          if (('valueArray' in hint.hint || 'value' in hint.hint) && !('valueTo' in hint.hint)) {
            let valueArray: Value[];
            let textArray: string[];
            if ('valueArray' in hint.hint) {
              const arrayHint = hint.hint as ArrayHint;
              valueArray = targetMatcher.valueArray.filter(v => !arrayHint.valueArray.includes(v));
              textArray = targetMatcher.textArray.filter(t => !arrayHint.textArray.includes(t));
            } else {
              const valueHint = hint.hint as SingleValueHint;
              valueArray = targetMatcher.valueArray.filter(v => valueHint.value !== v);
              textArray = targetMatcher.textArray.filter(t => valueHint.text !== t);
            }
            if (valueArray.length > 0) {
              updateMatcher({
                ...targetMatcher,
                valueArray,
                textArray
              });
            } else {
              deleteMatcher(targetMatcher);
            }
            return;
          }
        }
      }
    } else {
      const field = fieldMap.get(hint.hint.field);
      if (!field) {
        throw new Error(`${hint.hint.field} does not exist`)
      }
      const value = 'valueArray' in hint.hint
        ? createArrayValue(hint.hint)
        : 'valueTo' in hint.hint
          ? createRangeValue(hint.hint)
          : createValue(hint.hint);
      addValue(value, editPosition, AND, getDefaultComparison(field));
    }
  });


  const visibleHints: HintAndState[] = React.useMemo(() => (showAll ? hints : hints.slice(0, hintsPerColumn)).map(h => targetMatcher && containsHint(h, targetMatcher) ? { selected: true, hint: h } : { hint: h }), [hints, hintsPerColumn, targetMatcher]);
  const maxHeight = hintsPerColumn * 24;

  return (<div className={s.hintItems} style={{ maxHeight }}>
    {visibleHints.map(h => <div key={h.hint.dislayText}><Button onClick={() => handleValueClick(h)} style={{ paddingBlock: 0, paddingInline: 0 }}><div className={s.hint} style={{ width, fontWeight: h.selected ? 'bold' : 'normal' }}>{h.hint.dislayText}</div></Button></div>)}
  </div>
  )
});