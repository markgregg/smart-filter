import React from 'react';
import { MdOutlinePhonelinkErase, MdOutlineListAlt } from 'react-icons/md';
import { TbArrowBarBoth } from 'react-icons/tb';
import { IoTextOutline } from 'react-icons/io5';
import { Button } from '@/components/common/Button';
import { TooltipButton } from '@/components/common/TooltipButton';
import { Brackets, LogicalOperator } from '@/types';
import { useConfig, useMatcher } from '@/state/useState';
import { FieldSelection } from './FieldSelection';
import {
  AND,
  BRACKET,
  EMPTY,
  OR,
  VALUE,
  VALUE_ARRAY,
  VALUE_TO,
} from '@/util/constants';
import s from './style.module.less';

const brackets: Brackets[] = ['(', ')'];
export const Operators = React.memo(() => {
  const {
    fieldMap,
    comparisonsMap,
    enableSort,
  } = useConfig((state) => state);
  const { selectedMatcher, matchers, updateMatcher, addBracket, editPosition } =
    useMatcher((state) => state);

  const field = React.useMemo(
    () =>
      selectedMatcher && 'field' in selectedMatcher
        ? fieldMap.get(selectedMatcher?.field)
        : null,
    [selectedMatcher, fieldMap],
  );

  const selectedIndex = React.useMemo(
    () =>
      selectedMatcher && matchers.length > 0
        ? matchers.findIndex((m) => m.key === selectedMatcher.key)
        : -1,
    [selectedMatcher, matchers],
  );

  const specialFunctions = React.useMemo(() => {
    if (selectedMatcher && !(BRACKET in selectedMatcher)) {
      return [
        ...(field?.allowBlanks &&
          !(VALUE_TO in selectedMatcher) &&
          !(VALUE_ARRAY in selectedMatcher) &&
          selectedMatcher.value !== null
          ? [
            {
              code: 'empty',
              icon: <MdOutlinePhonelinkErase />,
              tooltip: 'Set value as empty',
            },
          ]
          : []),
        ...(field?.allowList && !(VALUE_TO in selectedMatcher)
          ? [
            {
              code: 'list',
              icon: <MdOutlineListAlt />,
              tooltip: 'Make pill a list',
            },
          ]
          : []),
        ...(field?.allowRange &&
          VALUE in selectedMatcher &&
          !(VALUE_ARRAY in selectedMatcher)
          ? [
            {
              code: 'range',
              icon: <TbArrowBarBoth />,
              tooltip: 'Make pill a range',
            },
          ]
          : []),
        ...(field?.allowRange &&
          (VALUE_TO in selectedMatcher || VALUE_ARRAY in selectedMatcher)
          ? [
            {
              code: 'value',
              icon: <IoTextOutline />,
              tooltip: 'Make pill a single value',
            },
          ]
          : []),
      ];
    }
    return null;
  }, [field, selectedMatcher]);

  const currentOperator = selectedMatcher?.operator === AND ? OR : AND;

  const handleComparisonClick = React.useCallback(
    (comparison: string) => {
      if (selectedMatcher) {
        updateMatcher({
          ...selectedMatcher,
          comparison,
        });
      }
    },
    [selectedMatcher, updateMatcher],
  );

  const handleSpecialClick = React.useCallback(
    (func: string) => {
      if (selectedMatcher) {
        switch (func) {
          case 'empty': {
            if (
              !(VALUE_TO in selectedMatcher) &&
              !(VALUE_ARRAY in selectedMatcher) &&
              !(BRACKET in selectedMatcher)
            ) {
              updateMatcher({
                ...selectedMatcher,
                value: null,
                text: EMPTY,
              });
            }
            break;
          }
          case 'list': {
            if (VALUE in selectedMatcher) {
              const {
                key,
                field: mField,
                operator,
                text,
                value,
              } = selectedMatcher;
              updateMatcher({
                key,
                field: mField,
                operator,
                comparison: '=',
                textArray: [text],
                valueArray: [value],
              });
            }
            break;
          }
          case 'range': {
            if (VALUE in selectedMatcher && !(VALUE_ARRAY in selectedMatcher)) {
              const {
                key,
                field: mField,
                operator,
                text,
                value,
              } = selectedMatcher;
              const comparison =
                'comparison' in selectedMatcher
                  ? selectedMatcher.comparison
                  : '=';
              updateMatcher({
                key,
                field: mField,
                operator,
                comparison,
                text,
                value,
                textTo: '',
                valueTo: null,
              });
            }
            break;
          }
          case 'value': {
            if (VALUE_TO in selectedMatcher) {
              const {
                key,
                field: mField,
                operator,
                text,
                value,
              } = selectedMatcher;
              updateMatcher({
                key,
                field: mField,
                operator,
                comparison: '=',
                text,
                value,
              });
            } else if (VALUE_ARRAY in selectedMatcher) {
              const {
                key,
                field: mField,
                operator,
                comparison,
                textArray,
                valueArray,
              } = selectedMatcher;
              updateMatcher({
                key,
                field: mField,
                operator,
                comparison,
                text: textArray.length > 0 ? textArray[0] : '',
                value: valueArray.length > 0 ? valueArray[0] : null,
                textTo: '',
                valueTo: null,
              });
            }
            break;
          }
          default: {
            // unexpected
          }
        }
      }
    },
    [selectedMatcher, updateMatcher],
  );

  const handleBracketClick = React.useCallback(
    (symbol: Brackets) => {
      addBracket(symbol, editPosition);
    },
    [addBracket, editPosition],
  );

  const handleLogicalOperatorClick = React.useCallback(
    (operator: LogicalOperator) => {
      if (selectedMatcher) {
        updateMatcher({
          ...selectedMatcher,
          operator,
        });
      }
    },
    [selectedMatcher, updateMatcher],
  );

  return (
    <div className={s.operators}>
      <FieldSelection />
      <div className={s.seperator} />
      {enableSort && (
        <>
          <FieldSelection showSort />
          <div className={s.seperator} />
        </>
      )}
      <div className={s.operatorSelection}>
        {selectedMatcher && !(VALUE_TO in selectedMatcher) &&
          field?.operators.map((o) => (
            <TooltipButton
              key={o}
              caption={comparisonsMap.get(o)?.description ?? ''}
              onClick={() => handleComparisonClick(o)}
              height={20}
              width={20}
            >
              {o}
            </TooltipButton>
          ))}
        {specialFunctions &&
          specialFunctions.map((f) => (
            <TooltipButton
              key={f.code}
              caption={f.tooltip}
              onClick={() => handleSpecialClick(f.code)}
              height={20}
              width={20}
            >
              {f.icon}
            </TooltipButton>
          ))}
        {brackets.map((b) => (
          <Button
            key={b}
            onClick={() => handleBracketClick(b)}
            height={20}
            width={20}
          >
            {b}
          </Button>
        ))}
        {selectedIndex > 0 && (
          <Button
            onClick={() => handleLogicalOperatorClick(currentOperator)}
            height={20}
            width={20}
          >
            {currentOperator}
          </Button>
        )}
      </div>
    </div>
  );
});
