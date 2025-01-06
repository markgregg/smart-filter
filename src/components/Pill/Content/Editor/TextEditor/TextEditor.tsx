import React from 'react';
import { EditorComponentProps } from '../Editor';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import s from './style.module.less';

export const TextEditor = React.memo(
  ({ textValue, onChanged }: EditorComponentProps) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      inputRef?.current?.focus();
    }, []);

    const handleChange = useDynamicCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const text = event.currentTarget.value;
        onChanged({ text, value: text }, text.length !== 0);
      },
    );

    const handleClick = useDynamicCallback((event: MouseEvent) => {
      event.stopPropagation();
    });

    return (
      <input
        ref={inputRef}
        className={s.textInput}
        type="text"
        placeholder="Enter text..."
        value={textValue.text}
        onChange={handleChange}
        onClick={handleClick}
      />
    );
  },
);
