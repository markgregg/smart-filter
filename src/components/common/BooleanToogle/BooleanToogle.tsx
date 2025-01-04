import React from 'react';
import { FaCircle } from "react-icons/fa";
import s from './style.module.less';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';

interface BooleanToogleProps {
  value: boolean;
  onChange?: (value: boolean) => void;
}

export const BooleanToogle = React.memo(({
  value,
  onChange,
}: BooleanToogleProps) => {

  const handleClick = useDynamicCallback(() => {
    if (onChange) {
      onChange(!value);
    }
  });

  return (
    <div className={[s.booleanToggle, value ? s.true : s.false,].join(' ')} onClick={handleClick}>
      <div className={s.icon}>
        {value && <FaCircle />}
      </div>
      <div className={s.icon}>
        {!value && <FaCircle />}
      </div>
    </div>
  )
});