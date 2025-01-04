import React from 'react';
import { Field, Value } from '@/types';
import { TextDisplay } from './TextDisplay';
import { BooleanDisplay } from './BooleanDisplay';

export interface DisplayComponentProps {
  field?: Field;
  text: string;
  value?: Value;
  onClick: () => void;
  onChanged?: (text: string, value: Value) => void;
}

interface DisplayProps {
  field: Field;
  text: string;
  value: Value;
  onClick: () => void;
  onChanged: (text: string, value: Value) => void;
}

export const Display = React.memo(({ field, text, value, onClick, onChanged }: DisplayProps) => {
  const Display = React.useMemo(() => {
    if (field.editorType === 'bool') {
      return BooleanDisplay;
    }
    return TextDisplay;
  }, [field]);

  return (
    <Display field={field} text={text} value={value} onClick={onClick} onChanged={onChanged} />
  )
});