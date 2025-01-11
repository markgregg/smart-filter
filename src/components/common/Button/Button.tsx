import React from 'react';
import { Colours } from '@/util/colours';
import s from './style.module.less';

interface ButtonProps {
  children: JSX.Element | string;
  onClick: () => void;
  height?: string | number;
  width?: string | number;
  style?: React.CSSProperties;
  color?: string;
  hoverColor?: string;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  disabled?: boolean;
}

export const Button = React.memo(
  ({
    children,
    onClick,
    height,
    width,
    style,
    color = Colours.buttons.buttonDefault,
    hoverColor = Colours.buttons.buttonDefaultHover,
    backgroundColor = Colours.buttons.buttonDefaultBackground,
    hoverBackgroundColor = Colours.buttons.buttonDefaultHoverBackground,
    disabled,
  }: ButtonProps) => {
    const [mouseOver, setMouseOver] = React.useState<boolean>(false);
    const foreColor = mouseOver ? hoverColor : color;
    const backColor = mouseOver ? hoverBackgroundColor : backgroundColor;

    const handleMouseEnter = React.useCallback(() => {
      setMouseOver(true);
    }, [setMouseOver]);

    const handleMouseLeave = React.useCallback(() => {
      setMouseOver(false);
    }, [setMouseOver]);

    const handleClick = React.useCallback((event: React.MouseEvent) => {
      onClick();
      event.stopPropagation();
    }, [onClick]);

    return (
      <button
        type="button"
        className={s.button}
        onClick={handleClick}
        style={{
          ...style,
          height,
          width,
          color: foreColor,
          backgroundColor: backColor,
        }}
        disabled={disabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </button>
    );
  },
);
