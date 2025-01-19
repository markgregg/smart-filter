import React from 'react';
import { DisplayComponentProps } from './Display';
import s from './style.module.less';
import { useConfig } from '@/state/useState';

export const TextDisplay = React.memo(
  ({ text, html, onClick }: DisplayComponentProps) => {
    const maxWidth = useConfig((state) => state.maxValueWidth);

    return (
      <div
        id="sf-text-display"
        className={s.display}
        onClick={onClick}
        style={{
          maxWidth,
        }}
      >
        {html || text}
      </div>
    );
  },
);
