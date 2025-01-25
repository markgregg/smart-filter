import { Field, Matcher, Operator, SourceItem, Value, ValueMatch } from '..';
import { ArrayValue, RangeValue, SingleValue } from '../../../../../../src/types/values';

export declare const ignoreCaseCompare: (text1: string, text2: string) => boolean;
export declare const getDefaultComparison: (field?: Field) => string;
export declare const getDefaultTextValue: (field?: Field) => {
    text: string;
    value: boolean;
} | {
    text: string;
    value: Date | undefined;
} | {
    text: string;
    value: number;
} | {
    text: string;
    value: null;
};
export declare const createArrayValue: ({ field, valueArray, textArray, }: {
    field: string;
    valueArray: Value[];
    textArray: string[];
}) => ArrayValue;
export declare const createField: (field?: Field) => SingleValue | null;
export declare const createRangeValue: ({ field, value, text, valueTo, textTo, }: {
    field: string;
    value: Value;
    text: string;
    valueTo: Value;
    textTo: string;
}) => RangeValue;
export declare const createValue: ({ field, value, text, }: {
    field: string;
    value: Value;
    text: string;
}) => SingleValue;
export declare const hasError: (matcher: Matcher) => boolean;
export declare const valueMatches: (match: ValueMatch, text: string) => boolean | RegExpMatchArray | null;
export declare const trimIfNotSpaces: (text: string) => string;
export declare const ignoreCaseEquals: (str1: string, str2: string) => boolean;
export declare const getValue: (item: SourceItem, field: Field) => Value;
export declare const getText: (item: SourceItem, field: Field) => string;
export declare const matchItem: (sourceItem: SourceItem, field: Field, text: string, ignoreCase?: boolean) => boolean;
export declare const matchExact: (sourceItem: SourceItem, field: Field, searchText: string, ignoreCase?: boolean) => boolean;
export declare const isVisible: (element: HTMLElement) => boolean;
export declare const isUnique: (value: string, index: number, array: string[]) => boolean;
export declare const uniqueComparions: (fields: Field[], operators: Operator[]) => Operator[];
export declare const toText: (symbol: string) => "" | "eq" | "ne" | "lk" | "nl" | "st" | "en" | "lt" | "gt" | "le" | "ge";
