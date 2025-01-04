import React from 'react';
import { DisplayComponentProps } from './Display';
import s from './style.module.less';

export const TextDisplay = React.memo(({ text, onClick }: DisplayComponentProps) => {
  return (
    <div className={s.display} onClick={onClick}>{text}</div>
  )
});