import React from 'react';
import s from './style.module.less';
import { useConfig } from '@/state/useState';

interface TooltipProps {
  caption: string;
  children: JSX.Element;
}

export const Tooltip = React.memo(({ caption, children }: TooltipProps) => {
  const [showTooltip, setShowTooltip] = React.useState<boolean>(false);
  const [marginLeft, setMarginLeft] = React.useState<number>(0);
  const size = useConfig((state) => state.size);

  const handleSetSize = React.useCallback(
    (element: HTMLDivElement | null) => {
      if (element) {
        setMarginLeft((element.offsetWidth / 2) * -1);
      }
    },
    [setMarginLeft],
  );

  const handleMouseEnter = React.useCallback(() => {
    setShowTooltip(true);
  }, [setShowTooltip]);

  const handleMouseLeave = React.useCallback(() => {
    setShowTooltip(false);
  }, [setShowTooltip]);

  return (
    <div
      className={s.tooltipContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showTooltip && (
        <div
          className={[s.tooltip, s[`font-${size}`]].join(' ')}
          style={{ marginLeft }}
          ref={handleSetSize}
        >
          {caption}
        </div>
      )}
    </div>
  );
});
