import React from 'react';
import { Option as OptionType } from '@/types';
import { useConfig, useOptions } from '@/state/useState';
import { splitText } from './functions';
import { DEFAULT_SORT_OPTION_WIDTH } from '@/util/constants';
import s from './style.module.less';

export interface OptionProps {
  option: OptionType;
  active: boolean;
}

export const Option = React.memo(({ option, active }: OptionProps) => {
  const { field: fieldName } = option;
  const { matchText, selectOption } = useOptions((state) => state);

  const text = option.type !== 'f' ? option.text : '';
  const Icon = option.type !== 'f' ? option.Icon : null;

  const { optionWidth: maxWidth = DEFAULT_SORT_OPTION_WIDTH, fieldMap } =
    useConfig((state) => state);
  const field = React.useMemo(
    () => fieldMap.get(fieldName) ?? null,
    [fieldName, fieldMap],
  );

  const [left, match, right] = React.useMemo(
    () =>
      splitText(
        ('displayText' in option ? option.displayText : text) ?? '',
        matchText ?? '',
      ),
    [text, matchText],
  );

  const handleClick = React.useCallback(
    (event: React.MouseEvent) => {
      selectOption(option);
      event.stopPropagation();
    },
    [option, selectOption],
  );

  return (
    <div
      className={[s.option, active ? s.active : ''].join(' ')}
      onClick={handleClick}
    >
      <div className={s.optionText} style={{ maxWidth }}>
        {option.type === 'r' ? (
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
        ) : Icon ? (
          <div className={s.matchTextRange}>
            <div>
              {text} {Icon && <Icon className={s.icon} />}
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
      <div>({field?.title ?? fieldName})</div>
    </div>
  );
});
