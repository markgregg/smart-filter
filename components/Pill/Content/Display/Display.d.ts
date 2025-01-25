import { default as React } from '../../../../../node_modules/react';
import { Field, Value } from '../../../../../../../../../src/types';

export interface DisplayComponentProps {
    field?: Field;
    text: string;
    value?: Value;
    html: JSX.Element | null;
    onClick: () => void;
    onChanged?: (text: string, value: Value) => void;
}
interface DisplayProps {
    field: Field;
    text: string;
    value: Value;
    html: JSX.Element | null;
    onClick: () => void;
    onChanged: (text: string, value: Value) => void;
}
export declare const Display: React.MemoExoticComponent<({ field, text, value, html, onClick, onChanged }: DisplayProps) => import("react/jsx-runtime").JSX.Element>;
export {};
