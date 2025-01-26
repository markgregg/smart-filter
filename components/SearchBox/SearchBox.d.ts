import { default as React } from '../../../node_modules/react';
import { Brackets, Field, Option } from '../../../../../../../src/types';

interface SearchBoxProps {
    matcherKey?: string;
    field?: Field;
    text: string[];
    onSelect: (option: Option) => void;
    onCreateBracket?: (bracket: Brackets) => void;
    position?: number;
}
export declare const SearchBox: React.MemoExoticComponent<({ matcherKey, field, text, onSelect, onCreateBracket, position, }: SearchBoxProps) => import("react/jsx-runtime").JSX.Element>;
export {};
