import { default as React } from '../../../../node_modules/react';
import { Value } from '../../../../../../../../src/types';

interface ArrayItemProps {
    index: number;
    text: string;
    value: Value;
    active: boolean;
    selected: boolean;
}
export declare const ArrayItem: React.MemoExoticComponent<({ index, text, value, active, selected }: ArrayItemProps) => import("react/jsx-runtime").JSX.Element>;
export {};
