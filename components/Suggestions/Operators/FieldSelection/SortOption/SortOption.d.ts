import { default as React } from '../../../../../../node_modules/react';
import { Field } from '../../../../../../../../../../src/types';
import { SortDirection } from '../../../../../../../../../../src/types/sort';

interface SortOptionProps {
    field: Field;
    onSelect: (field: string, sortDirection: SortDirection) => void;
}
export declare const SortOption: React.MemoExoticComponent<({ field, onSelect }: SortOptionProps) => import("react/jsx-runtime").JSX.Element>;
export {};
