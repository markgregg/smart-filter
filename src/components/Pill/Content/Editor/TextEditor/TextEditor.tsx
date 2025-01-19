import React from 'react';
import { EditorComponentProps } from '../Editor';
import s from './style.module.less';
import { useConfig } from '@/state/useState';

export const TextEditor = React.memo(
  ({ textValue, onChanged }: EditorComponentProps) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const size = useConfig((state) => state.size);

    React.useEffect(() => {
      inputRef?.current?.focus();
    }, []);

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const text = event.currentTarget.value;
        onChanged({ text, value: text }, text.length !== 0);
      },
      [onChanged],
    );

    const handleClick = (event: React.MouseEvent) => {
      event.stopPropagation();
    };

    return (
      <input
        id="sf-text-editor"
        ref={inputRef}
        className={[s.textInput, s[`font-${size}`]].join(' ')}
        type="text"
        placeholder="Enter text..."
        value={textValue.text}
        onChange={handleChange}
        onClick={handleClick}
      />
    );
  },
);
