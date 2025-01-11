import React from 'react';
import { EditorComponentProps } from '../Editor';
import s from './style.module.less';

export const TextEditor = React.memo(
  ({ textValue, onChanged }: EditorComponentProps) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      inputRef?.current?.focus();
    }, []);

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const text = event.currentTarget.value;
        onChanged({ text, value: text }, text.length !== 0);
      },
      [onChanged]);

    const handleClick = (event: React.MouseEvent) => {
      event.stopPropagation();
    };

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
