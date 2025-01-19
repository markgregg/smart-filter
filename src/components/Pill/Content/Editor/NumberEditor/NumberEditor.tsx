import React from 'react';
import { EditorComponentProps } from '../Editor';
import s from './style.module.less';
import { useConfig } from '@/state/useState';

export const NumberEditor = React.memo(
  ({ field, textValue, onChanged }: EditorComponentProps) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const size = useConfig((state) => state.size);

    React.useEffect(() => {
      inputRef?.current?.focus();
    }, []);

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value =
          field.editorType === 'integer'
            ? Number.parseInt(event.currentTarget.value, 10)
            : Number.parseFloat(event.currentTarget.value);
        onChanged({ text: value.toString(), value }, true);
      },
      [field],
    );

    return (
      <input
        id="sf-number-editor"
        ref={inputRef}
        className={[s.textInput, s[`font-${size}`]].join(' ')}
        type={field.editorType === 'integer' ? 'number' : 'number'}
        value={typeof textValue.value === 'number' ? textValue.value : 0}
        onChange={handleChange}
        min={field.min && typeof field.min === 'number' ? field.min : undefined}
        max={field.max && typeof field.max === 'number' ? field.max : undefined}
        step={field.increments ?? (field.editorType === 'float' ? 0.1 : 1)}
      />
    );
  },
);
