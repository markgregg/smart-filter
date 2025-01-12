import React from 'react';
import { Option as OptionType } from '@/types';
import { useOptions } from '@/state/useState';
import { splitText } from './functions';
import s from './style.module.less';
import { TEXT_TO } from '@/util/constants';

export interface OptionProps {
  option: OptionType;
  active: boolean;
}

export const Option = React.memo(({ option, active }: OptionProps) => {
  const { text, field: fieldName } = option;
  const { matchText, selectOption } = useOptions((state) => state);

  const [left, match, right] = React.useMemo(
    () =>
      splitText('displayText' in option ? option.displayText : text, matchText),
    [text, matchText],
  );

  const handleClick = React.useCallback((event: React.MouseEvent) => {
    selectOption(option);
    event.stopPropagation();
  }, [option, selectOption]);

  return (
    <div
      className={[s.option, active ? s.active : ''].join(' ')}
      onClick={handleClick}
    >
      <div className={s.optionText}>
        {TEXT_TO in option ? (
          <div className={s.matchTextRange}>
            <span>
              {option.text} {option.Icon && <option.Icon className={s.icon} />}
            </span>
            to
            <span>
              {option.textTo}{' '}
              {option.IconTo && <option.IconTo className={s.icon} />}
            </span>
          </div>
        ) : option.Icon ? (
          <div className={s.matchTextRange}>
            <div>
              {option.text} {option.Icon && <option.Icon className={s.icon} />}
            </div>
          </div>
        ) : (
          <div>
            {left}
            <span className={s.matchText}>{match}</span>
            {right}
          </div>
        )}
      </div>
      <div>({fieldName})</div>
    </div>
  );
});
