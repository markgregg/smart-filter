import React from 'react';
import { FaCircle } from 'react-icons/fa';
import s from './style.module.less';

interface BooleanToogleProps {
  value: boolean;
  onChange?: (value: boolean) => void;
}

export const BooleanToogle = React.memo(
  ({ value, onChange }: BooleanToogleProps) => {
    const handleClick = React.useCallback(
      (event: React.MouseEvent) => {
        if (onChange) {
          onChange(!value);
        }
        event.stopPropagation();
      },
      [onChange, value],
    );

    return (
      <div
        id="sf-boolean-toggle"
        className={[s.booleanToggle, value ? s.true : s.false].join(' ')}
        onClick={handleClick}
      >
        <div className={s.icon}>{value && <FaCircle />}</div>
        <div className={s.icon}>{!value && <FaCircle />}</div>
      </div>
    );
  },
);
