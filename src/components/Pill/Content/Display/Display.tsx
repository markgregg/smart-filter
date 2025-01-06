import React from 'react';
import { Field, Value } from '@/types';
import { TextDisplay } from './TextDisplay';
import { BooleanDisplay } from './BooleanDisplay';

export interface DisplayComponentProps {
  field?: Field;
  text: string;
  value?: Value;
  html: JSX.Element | null;
  onClick: () => void;
  onChanged?: (text: string, value: Value) => void;
}

interface DisplayProps {
  field: Field;
  text: string;
  value: Value;
  html: JSX.Element | null;
  onClick: () => void;
  onChanged: (text: string, value: Value) => void;
}

export const Display = React.memo(
  ({ field, text, value, html, onClick, onChanged }: DisplayProps) => {
    const ContentDisplay = React.useMemo(() => {
      if (field.editorType === 'bool') {
        return BooleanDisplay;
      }
      return TextDisplay;
    }, [field]);

    return (
      <ContentDisplay
        field={field}
        text={text}
        value={value}
        html={html}
        onClick={onClick}
        onChanged={onChanged}
      />
    );
  },
);
