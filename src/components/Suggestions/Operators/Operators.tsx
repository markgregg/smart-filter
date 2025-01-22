import React from 'react';
import { AiFillLock, AiFillUnlock } from 'react-icons/ai';
import { MdOutlinePhonelinkErase, MdOutlineListAlt } from 'react-icons/md';
import { TbArrowBarBoth } from 'react-icons/tb';
import { IoTextOutline } from 'react-icons/io5';
import { Button } from '@/components/common/Button';
import { TooltipButton } from '@/components/common/TooltipButton';
import { Brackets, LogicalOperator, Matcher } from '@/types';
import { useConfig, useMatcher } from '@/state/useState';
import { FieldSelection } from './FieldSelection';
import { toText } from '@/util/functions';
import { AND, EMPTY, OR } from '@/util/constants';
import s from './style.module.less';

const brackets: Brackets[] = ['(', ')'];
export const Operators = React.memo(() => {
  const {
    fieldMap,
    comparisonsMap,
    enableSort,
    allowLocking,
    size = 'normal',
  } = useConfig((state) => state);
  const { selectedMatcher, matchers, updateMatcher, addBracket, editPosition } =
    useMatcher((state) => state);

  const buttonSize = size === 'normal' ? 22 : size === 'compact' ? 20 : 26;

  const field = React.useMemo(
    () =>
      selectedMatcher && 'field' in selectedMatcher
        ? fieldMap.get(selectedMatcher?.field)
        : null,
    [selectedMatcher, fieldMap],
  );

  const fieldOperators = React.useMemo(
    () =>
      field?.operators.filter(
        (o) =>
          !selectedMatcher ||
          !('comparison' in selectedMatcher) ||
          selectedMatcher.comparison !== o,
      ),
    [field, selectedMatcher],
  );

  const selectedIndex = React.useMemo(
    () =>
      selectedMatcher && matchers.length > 0
        ? matchers.findIndex((m) => m.key === selectedMatcher.key)
        : -1,
    [selectedMatcher, matchers],
  );

  const specialFunctions = React.useMemo(() => {
    if (selectedMatcher && !(selectedMatcher.type === 'b')) {
      return [
        ...(field?.allowBlanks &&
        !(selectedMatcher.type === 'r') &&
        !(selectedMatcher.type === 'a') &&
        selectedMatcher.value !== null
          ? [
              {
                code: 'empty',
                icon: <MdOutlinePhonelinkErase />,
                tooltip: 'Set value as empty',
              },
            ]
          : []),
        ...(field?.allowList && !(selectedMatcher.type === 'r')
          ? [
              {
                code: 'list',
                icon: <MdOutlineListAlt />,
                tooltip: 'Make pill a list',
              },
            ]
          : []),
        ...(field?.allowRange && selectedMatcher.type !== 'a'
          ? [
              {
                code: 'range',
                icon: <TbArrowBarBoth />,
                tooltip: 'Make pill a range',
              },
            ]
          : []),
        ...(field?.allowRange &&
        (selectedMatcher.type === 'r' || selectedMatcher.type === 'a')
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
        } as Matcher);
      }
    },
    [selectedMatcher, updateMatcher],
  );

  const handleSpecialClick = React.useCallback(
    (func: string) => {
      if (selectedMatcher) {
        switch (func) {
          case 'empty': {
            if (selectedMatcher.type === 's') {
              updateMatcher({
                ...selectedMatcher,
                value: null,
                text: EMPTY,
              });
            }
            break;
          }
          case 'list': {
            if (selectedMatcher.type === 's') {
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
                type: 'a',
                key,
                field: mField,
                operator,
                comparison,
                textArray: [text],
                valueArray: [value],
              });
            }
            break;
          }
          case 'range': {
            if (selectedMatcher.type === 's') {
              const {
                key,
                field: mField,
                operator,
                text,
                value,
              } = selectedMatcher;
              updateMatcher({
                type: 'r',
                key,
                field: mField,
                operator,
                text,
                value,
                textTo: '',
                valueTo: null,
              });
            }
            break;
          }
          case 'value': {
            if (selectedMatcher.type === 'r') {
              const {
                key,
                field: mField,
                operator,
                text,
                value,
              } = selectedMatcher;
              updateMatcher({
                type: 's',
                key,
                field: mField,
                operator,
                comparison: '=',
                text,
                value,
              });
            } else if (selectedMatcher.type === 'a') {
              const {
                key,
                field: mField,
                operator,
                comparison,
                textArray,
                valueArray,
              } = selectedMatcher;
              updateMatcher({
                type: 's',
                key,
                field: mField,
                operator,
                comparison,
                text: textArray.length > 0 ? textArray[0] : '',
                value: valueArray.length > 0 ? valueArray[0] : null,
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

  const handleToggleLock = React.useCallback(() => {
    if (selectedMatcher) {
      updateMatcher(
        { ...selectedMatcher, locked: !selectedMatcher.locked },
        true,
      );
    }
  }, [selectedMatcher, updateMatcher]);

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
        {selectedMatcher &&
          !(selectedMatcher.type === 'r') &&
          fieldOperators?.map((o) => (
            <TooltipButton
              id={`sf-${toText(o)}-operator`}
              key={o}
              caption={comparisonsMap.get(o)?.description ?? ''}
              onClick={() => handleComparisonClick(o)}
              height={buttonSize}
              width={buttonSize}
            >
              {o}
            </TooltipButton>
          ))}
        {selectedMatcher && !(selectedMatcher.type === 'r') && (
          <div className={s.seperator} />
        )}
        {specialFunctions &&
          specialFunctions.map((f) => (
            <TooltipButton
              id={`sf-${f.code}-operator`}
              key={f.code}
              caption={f.tooltip}
              onClick={() => handleSpecialClick(f.code)}
              height={buttonSize}
              width={buttonSize}
            >
              {f.icon}
            </TooltipButton>
          ))}
        {brackets.map((b) => (
          <Button
            id={`sf-${b === '(' ? 'open' : 'close'}-operator`}
            key={b}
            onClick={() => handleBracketClick(b)}
            height={buttonSize}
            width={buttonSize}
          >
            {b}
          </Button>
        ))}
        {selectedIndex > 0 && (
          <Button
            id={`sf-${currentOperator}-operator`}
            onClick={() => handleLogicalOperatorClick(currentOperator)}
            height={buttonSize}
            width={buttonSize}
          >
            {currentOperator}
          </Button>
        )}
        {selectedMatcher && allowLocking && (
          <>
            <div className={s.seperator} />
            <Button
              id="sf-lock-operator"
              onClick={handleToggleLock}
              height={buttonSize}
              width={buttonSize}
            >
              {selectedMatcher.locked ? <AiFillUnlock /> : <AiFillLock />}
            </Button>
          </>
        )}
      </div>
    </div>
  );
});
