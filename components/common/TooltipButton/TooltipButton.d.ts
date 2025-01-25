import { default as React } from '../../../../node_modules/react';

interface TooltipButtonProps {
    children: JSX.Element | string;
    onClick: () => void;
    id?: string;
    caption: string;
    height?: string | number;
    width?: string | number;
    style?: React.CSSProperties;
}
export declare const TooltipButton: React.MemoExoticComponent<(props: TooltipButtonProps) => import("react/jsx-runtime").JSX.Element>;
export {};
