import { default as React } from '../../../node_modules/react';
import { Brackets, Field, LogicalOperator, Option } from '../../../../../../../src/types';

interface SearchBoxProps {
    matcherKey?: string;
    field?: Field;
    text: string[];
    onSelect: (option: Option) => void;
    onCopy?: (event: React.ClipboardEvent) => void;
    onCut?: (event: React.ClipboardEvent) => void;
    onPaste?: (event: React.ClipboardEvent) => void;
    onCreateBracket?: (bracket: Brackets, operator: LogicalOperator | null) => void;
    position?: number;
}
export declare const SearchBox: React.MemoExoticComponent<({ matcherKey, field, text, onSelect, onCopy, onCut, onPaste, onCreateBracket, position, }: SearchBoxProps) => import("react/jsx-runtime").JSX.Element>;
export {};
