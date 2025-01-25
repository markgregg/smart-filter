import { default as React } from '../../../../../node_modules/react';
import { Field, Value } from '../../../../../../../../../src/types';

export interface TextValue {
    text: string;
    value: Value;
}
export interface EditorComponentProps {
    matcherKey: string;
    field: Field;
    textValue: TextValue;
    onChanged: (textValue: TextValue, valid: boolean) => void;
}
interface EditorProps {
    matcherKey: string;
    field: Field;
    textValue: TextValue;
    unset?: boolean;
    onChanged: (text: string, value: Value) => void;
    onCancel: () => void;
}
export declare const Editor: React.MemoExoticComponent<({ matcherKey, field, textValue, unset, onChanged, onCancel, }: EditorProps) => import("react/jsx-runtime").JSX.Element>;
export {};
