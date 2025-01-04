import React from 'react';
import { Option as OptionType } from '@/types';
import { useOptions } from '@/components/StateProvider/useState';
import { splitText } from './functions';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import s from './style.module.less';

interface OptionProps {
  option: OptionType;
  active: boolean;
}

export const Option = React.memo(({ option, active }: OptionProps) => {
  const { text, field: fieldName } = option;
  const { matchText, selectOption } = useOptions(state => state);

  const [left, match, right] = React.useMemo(() => splitText('displayText' in option ? option.displayText : text, matchText), [text, matchText]);

  const handleClick = useDynamicCallback(() => {
    selectOption(option)
  });

  return (
    <div
      className={[s.option, active ? s.active : ''].join(' ')}
      onClick={handleClick}
    >
      <div className={s.optionText}>
        {left}
        <span className={s.matchText}>{match}</span>
        {right}
      </div>
      <div className={s.optionField}>
        ({fieldName})
      </div>
    </div>)
});