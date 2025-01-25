import { default as React } from '../../../../../../node_modules/react';
import { Field } from '../../../../../../../../../../src/types';

interface FieldOptionProps {
    field: Field;
    onSelect: (field: Field) => void;
}
export declare const FieldOption: React.MemoExoticComponent<({ field, onSelect }: FieldOptionProps) => import("react/jsx-runtime").JSX.Element>;
export {};
