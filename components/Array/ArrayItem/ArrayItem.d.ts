import { default as React } from '../../../../node_modules/react';

interface ArrayItemProps {
    index: number;
    text: string;
    active: boolean;
    selected: boolean;
}
export declare const ArrayItem: React.MemoExoticComponent<({ index, text, active, selected }: ArrayItemProps) => import("react/jsx-runtime").JSX.Element>;
export {};
