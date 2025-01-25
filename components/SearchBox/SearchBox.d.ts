import { default as React } from '../../../node_modules/react';
import { Field, Option } from '../../../../../../../src/types';

interface SearchBoxProps {
    matcherKey?: string;
    field?: Field;
    text: string[];
    onSelect: (option: Option) => void;
    position?: number;
}
export declare const SearchBox: React.MemoExoticComponent<({ matcherKey, field, text, onSelect, position }: SearchBoxProps) => import("react/jsx-runtime").JSX.Element>;
export {};
