import React from 'react';
import { Button } from '@/components/common/Button';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import { ArrayHint, Hint, Matcher, SingleValueHint, Value } from '@/types';
import { useConfig, useMatcher } from '@/state/useState';
import {
  createArrayValue,
  createRangeValue,
  createValue,
  getDefaultComparison,
} from '@/util/functions';
import s from './style.module.less';

interface HintItemsProps {
  field: string;
  hints: Hint[];
  showAll?: boolean;
}

interface HintAndState {
  selected?: boolean;
  hint: Hint;
}

const containsHint = (field: string, hint: Hint, matcher: Matcher): boolean => {
  if (!('field' in matcher) || field !== matcher.field) {
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

    // eslint-disable-next-line no-restricted-syntax
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
};

export const HintItems = React.memo(
  ({ field, hints, showAll }: HintItemsProps) => {
    const {
      hints: { hintsPerColumn = 3, hintWidth: width = 90 } = {},
      fieldMap,
    } = useConfig((state) => state);
    const {
      selectedMatcher,
      addValue,
      deleteMatcher,
      updateMatcher,
      editPosition,
      matchers,
    } = useMatcher((state) => state);
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
            if (
              ('valueArray' in hint.hint || 'value' in hint.hint) &&
              !('valueTo' in hint.hint)
            ) {
              let valueArray: Value[];
              let textArray: string[];
              if ('valueArray' in hint.hint) {
                const arrayHint = hint.hint as ArrayHint;
                valueArray = targetMatcher.valueArray.filter(
                  (v) => !arrayHint.valueArray.includes(v),
                );
                textArray = targetMatcher.textArray.filter(
                  (t) => !arrayHint.textArray.includes(t),
                );
              } else {
                const valueHint = hint.hint as SingleValueHint;
                valueArray = targetMatcher.valueArray.filter(
                  (v) => valueHint.value !== v,
                );
                textArray = targetMatcher.textArray.filter(
                  (t) => valueHint.text !== t,
                );
              }
              if (valueArray.length > 0) {
                updateMatcher({
                  ...targetMatcher,
                  valueArray,
                  textArray,
                });
              } else {
                deleteMatcher(targetMatcher);
              }
            }
          }
        }
      } else {
        const hintField = fieldMap.get(field);
        if (!hintField) {
          throw new Error(`${field} does not exist`);
        }
        const value =
          'valueArray' in hint.hint
            ? createArrayValue({ field, ...hint.hint })
            : 'valueTo' in hint.hint
              ? createRangeValue({ field, ...hint.hint })
              : createValue({ field, ...hint.hint });
        addValue({
          value,
          position: editPosition,
          comparison: getDefaultComparison(hintField),
        });
      }
    });

    const visibleHints: HintAndState[] = React.useMemo(
      () =>
        (showAll ? hints : hints.slice(0, hintsPerColumn)).map((h) =>
          targetMatcher && containsHint(field, h, targetMatcher)
            ? { selected: true, hint: h }
            : { hint: h },
        ),
      [hints, hintsPerColumn, targetMatcher],
    );
    const maxHeight = hintsPerColumn * 28;

    return (
      <div className={s.hintItems} style={{ maxHeight }}>
        {visibleHints.map((h) => (
          // @ts-expect-error key is not exposed to the user and is automatically add in the config
          <div key={h.hint.key}>
            <Button
              onClick={() => handleValueClick(h)}
              style={{ paddingBlock: 0, paddingInline: 0 }}
            >
              <div
                className={s.hint}
                style={{ width, fontWeight: h.selected ? 'bold' : 'normal' }}
              >
                {h.hint.display}
              </div>
            </Button>
          </div>
        ))}
      </div>
    );
  },
);
