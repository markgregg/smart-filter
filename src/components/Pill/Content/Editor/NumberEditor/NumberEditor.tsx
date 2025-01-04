import React from 'react';
import { EditorComponentProps } from '../Editor';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import s from './style.module.less';

export const NumberEditor = React.memo(({ field, textValue, onChanged }: EditorComponentProps) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  const handleChange = useDynamicCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = field.editorType === 'integer' ? Number.parseInt(event.currentTarget.value) : Number.parseFloat(event.currentTarget.value);
    onChanged({ text: value.toString(), value }, true);
  });

  return (
    <input
      ref={inputRef}
      className={s.textInput}
      type={field.editorType === 'integer' ? 'number' : 'number'}
      value={typeof textValue.value === 'number' ? textValue.value : 0}
      onChange={handleChange}
      min={field.min && typeof field.min === 'number' ? field.min : undefined}
      max={field.max && typeof field.max === 'number' ? field.max : undefined}
      step={field.increments ?? (field.editorType === 'float' ? 0.1 : 1)}
    />
  )
});