import React from 'react';
import { Tooltip } from '../Tooltip/Tooltip';
import { Button } from '../Button';

interface TooltipButtonProps {
  children: JSX.Element | string;
  onClick: () => void;
  id?: string;
  caption: string;
  height?: string | number;
  width?: string | number;
  style?: React.CSSProperties;
}

export const TooltipButton = React.memo((props: TooltipButtonProps) => {
  const { caption, children, ...buttonProps } = props;

  return (
    <Tooltip caption={caption}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Button {...buttonProps}>{children}</Button>
    </Tooltip>
  );
});
