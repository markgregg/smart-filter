import React from 'react';
import { Button } from '@/components/common/Button';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import { TooltipButton } from '@/components/common/TooltipButton';
import { Brackets, LogicalOperator } from '@/types';
import { useConfig, useMatcher } from '@/components/StateProvider/useState';
import { FieldSelection } from './FieldSelection';
import { AND, EMPTY, OR } from '@/util/constants';
import { MdOutlinePhonelinkErase, MdOutlineListAlt } from "react-icons/md";
import { TbArrowBarBoth } from "react-icons/tb";
import { IoTextOutline } from "react-icons/io5";
import s from './style.module.less';

const brackets = ['(', ')'];
export const Operators = React.memo(() => {
  const {
    fieldMap,
    comparisonsMap,
  } = useConfig(state => state);
  const {
    selectedMatcher,
    matchers,
    updateMatcher,
    addBracket,
    editPosition,
  } = useMatcher(state => state);

  const field = React.useMemo(() => (selectedMatcher && 'field' in selectedMatcher) ? fieldMap.get(selectedMatcher?.field) : null, [selectedMatcher, fieldMap]);
  const selectedIndex = React.useMemo(() => (selectedMatcher && matchers.length > 0) ? matchers.findIndex(m => m.key === selectedMatcher.key) : -1, [selectedMatcher, matchers]);

  const specialFunctions = React.useMemo(() => {
    if (selectedMatcher && !('bracket' in selectedMatcher)) {
      return [
        ...(field?.allowBlanks && !('valueTo' in selectedMatcher) && !('valueArray' in selectedMatcher) && selectedMatcher.value !== null ? [{ code: 'empty', icon: <MdOutlinePhonelinkErase />, tooltip: 'Set value as empty' }] : []),
        ...(field?.allowList && !('valueTo' in selectedMatcher) ? [{ code: 'list', icon: <MdOutlineListAlt />, tooltip: 'Make pill a list' }] : []),
        ...(field?.allowRange && 'value' in selectedMatcher && !('valueArray' in selectedMatcher) ? [{ code: 'range', icon: <TbArrowBarBoth />, tooltip: 'Make pill a range' }] : []),
        ...(field?.allowRange && ('valueTo' in selectedMatcher || 'valueArray' in selectedMatcher) ? [{ code: 'value', icon: <IoTextOutline />, tooltip: 'Make pill a single value' }] : []),
      ]
    }
    return null;
  }, [field, selectedMatcher]);

  const operator = selectedMatcher?.operator === AND ? OR : AND;

  const handleComparisonClick = useDynamicCallback((comparison: string) => {
    if (selectedMatcher) {
      updateMatcher({
        ...selectedMatcher,
        comparison,
      });
    }
  });

  const handleSpecialClick = useDynamicCallback((func: string) => {
    if (selectedMatcher) {
      switch (func) {
        case 'empty':
          if (!('valueTo' in selectedMatcher) && !('valueArray' in selectedMatcher) && !('bracket' in selectedMatcher)) {
            updateMatcher({
              ...selectedMatcher,
              value: null,
              text: EMPTY,
            });
          }
          break;
        case 'list':
          if ('value' in selectedMatcher) {
            const { key, field, operator, text, value } = selectedMatcher;
            updateMatcher({
              key,
              field,
              operator,
              comparison: '=',
              textArray: [text],
              valueArray: [value],
            });
          }
          break;
        case 'range':
          if ('value' in selectedMatcher && !('valueArray' in selectedMatcher)) {
            const { key, field, operator, text, value } = selectedMatcher;
            const comparison = 'comparison' in selectedMatcher ? selectedMatcher.comparison : '=';
            updateMatcher({
              key,
              field,
              operator,
              comparison,
              text,
              value,
              textTo: '',
              valueTo: null,
            });
          }
          break;
        case 'value':
          if ('valueTo' in selectedMatcher) {
            const { key, field, operator, text, value } = selectedMatcher;
            updateMatcher({
              key,
              field,
              operator,
              comparison: '=',
              text,
              value,
            });
          } else if ('valueArray' in selectedMatcher) {
            const { key, field, operator, comparison, textArray, valueArray } = selectedMatcher;
            updateMatcher({
              key,
              field,
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
    }
  });


  const handleBracketClick = useDynamicCallback((symbol: Brackets) => {
    addBracket(symbol, editPosition);
  });

  const handleLogicalOperatorClick = useDynamicCallback((operator: LogicalOperator) => {
    if (selectedMatcher) {
      updateMatcher({
        ...selectedMatcher,
        operator,
      });
    }
  });

  return (
    <div className={s.operators}>
      <FieldSelection />
      <div className={s.seperator} />
      <div className={s.operatorSelection}>
        {selectedMatcher && field?.operators.map(o => (
          <TooltipButton
            key={o}
            caption={comparisonsMap.get(o)?.description ?? ''}
            onClick={() => handleComparisonClick(o)}
            height={20}
            width={20}>{o}</TooltipButton>))}
        {specialFunctions && specialFunctions.map(f => (
          <TooltipButton
            key={f.code}
            caption={f.tooltip}
            onClick={() => handleSpecialClick(f.code)}
            height={20}
            width={20}>{f.icon}</TooltipButton>))}
        {brackets.map(b => <Button key={b} onClick={() => handleBracketClick(b)} height={20} width={20}>{b}</Button>)}
        {selectedIndex > 0 && <Button onClick={() => handleLogicalOperatorClick(operator)} height={20} width={20}>{operator}</Button>}
      </div>
    </div>)
});