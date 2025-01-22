import React from 'react';
import { Button } from '@/components/common/Button';
import { ArrayHint, Hint, Matcher, SingleValueHint, Value } from '@/types';
import { useConfig, useMatcher } from '@/state/useState';
import {
  createArrayValue,
  createRangeValue,
  createValue,
  getDefaultComparison,
} from '@/util/functions';
import s from './style.module.less';
import { VALUE, VALUE_ARRAY, VALUE_TO } from '@/util/constants';

export interface HintItemsProps {
  field: string;
  hintSource: Hint[] | (() => Hint[]);
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
  if (typeof hint === 'string') {
    if (matcher.type === 'a') {
      return matcher.valueArray.includes(hint);
    }
    if (matcher.type === 's') {
      return matcher.value === hint;
    }
    return false;
  }
  if (VALUE_TO in hint) {
    if (!(matcher.type === 'r')) {
      return false;
    }
    return matcher.value === hint.value && matcher.valueTo === hint.valueTo;
  }
  if (VALUE_ARRAY in hint) {
    if (!(matcher.type === 'a')) {
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
  if (VALUE in hint) {
    if (matcher.type === 'a') {
      return matcher.valueArray.includes(hint.value);
    }
    if (matcher.type === 's') {
      return matcher.value === hint.value;
    }
  }
  return false;
};

export const HintItems = React.memo(
  ({ field, hintSource, showAll }: HintItemsProps) => {
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
    const hints = React.useMemo(
      () => (typeof hintSource === 'function' ? hintSource() : hintSource),
      [hintSource],
    );
    const targetMatcher = React.useMemo(() => {
      if (selectedMatcher) {
        return selectedMatcher;
      }
      if (editPosition && editPosition < matchers.length) {
        return matchers[editPosition];
      }
      return matchers.length > 0 ? matchers[matchers.length - 1] : null;
    }, [matchers, selectedMatcher]);

    const handleValueClick = React.useCallback(
      (hint: HintAndState) => {
        if (hint.selected) {
          if (targetMatcher) {
            if (VALUE in targetMatcher) {
              deleteMatcher(targetMatcher);
              return;
            }
            if (targetMatcher.type === 'a') {
              if (
                typeof hint.hint === 'string' ||
                VALUE_ARRAY in hint.hint ||
                (VALUE in hint.hint && !(VALUE_TO in hint.hint))
              ) {
                let valueArray: Value[];
                let textArray: string[];
                if (typeof hint.hint === 'string') {
                  valueArray = targetMatcher.valueArray.filter(
                    (v) => hint.hint !== v,
                  );
                  textArray = targetMatcher.textArray.filter(
                    (t) => hint.hint !== t,
                  );
                } else if (VALUE_ARRAY in hint.hint) {
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
            typeof hint.hint === 'string'
              ? createValue({ field, text: hint.hint, value: hint.hint })
              : VALUE_ARRAY in hint.hint
                ? createArrayValue({ field, ...hint.hint })
                : VALUE_TO in hint.hint
                  ? createRangeValue({ field, ...hint.hint })
                  : createValue({ field, ...hint.hint });
          const comp =
            typeof hint.hint === 'object' && 'comparison' in hint.hint
              ? hint.hint.comparison
              : null;
          addValue({
            value,
            position: editPosition,
            comparison: comp ?? getDefaultComparison(hintField),
          });
        }
      },
      [targetMatcher, editPosition, fieldMap],
    );

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
        {visibleHints.map((h) => {
          const key =
            typeof h.hint !== 'string' && 'key' in h.hint ? h.hint.key : h.hint;
          return (
            // @ts-expect-error key is not exposed to the user and is automatically add in the config
            <div key={key}>
              <Button
                id={`sf-${field}-item`}
                onClick={() => handleValueClick(h)}
                style={{ paddingBlock: 0, paddingInline: 0 }}
              >
                <div
                  className={s.hint}
                  style={{ width, fontWeight: h.selected ? 'bold' : 'normal' }}
                >
                  {typeof h.hint === 'string'
                    ? h.hint
                    : 'display' in h.hint
                      ? h.hint.display
                      : 'text' in h.hint
                        ? h.hint.text
                        : ''}
                </div>
              </Button>
            </div>
          );
        })}
      </div>
    );
  },
);
