import React from 'react';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import s from './style.module.less';

interface TooltipProps {
  caption: string;
  children: JSX.Element;
}

export const Tooltip = React.memo(({
  caption,
  children,
}: TooltipProps) => {
  const [showTooltip, setShowTooltip] = React.useState<boolean>(false);
  const [marginLeft, setMarginLeft] = React.useState<number>(0);

  const handleSetSize = useDynamicCallback((element: HTMLDivElement | null) => {
    if (element) {
      setMarginLeft((element.offsetWidth / 2) * -1);
    }
  });

  const handleMouseEnter = useDynamicCallback(() => {
    setShowTooltip(true);
  });

  const handleMouseLeave = useDynamicCallback(() => {
    setShowTooltip(false);
  });

  return (
    <div
      className={s.tooltipContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showTooltip && <div className={s.tooltip} style={{ marginLeft }} ref={handleSetSize}>{caption}</div>}
    </div>
  )
});