import { default as React } from '../../../../node_modules/react';

interface ButtonProps {
    children: JSX.Element | string;
    id?: string;
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
export declare const Button: React.MemoExoticComponent<({ children, id, onClick, height, width, style, color, hoverColor, backgroundColor, hoverBackgroundColor, disabled, }: ButtonProps) => import("react/jsx-runtime").JSX.Element>;
export {};
