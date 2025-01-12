import React from 'react';
import { Field } from '@/types';
import s from './style.module.less';

interface FieldOptionProps {
  field: Field;
  onSelect: (field: Field) => void;
}

export const FieldOption = React.memo(
  ({
    field,
    onSelect
  }: FieldOptionProps) => {

    const handleClick = React.useCallback((event: React.MouseEvent) => {
      onSelect(field);
      event.stopPropagation();
    }, [onSelect, field]);

    return (
      (<div
        className={s.fieldOption}
        onClick={handleClick}
      >
        {field.title}
      </div>)
    );
  },
);
