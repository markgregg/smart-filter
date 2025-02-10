import { Field, Matcher, PasteOptions } from '../../../../../../../src/types';

export declare const getMatchersFromCustomParser: (text: string, pasteOptions?: PasteOptions) => Matcher | Matcher[] | null;
export declare const getFieldNameFromDelimitedList: (text: string, fieldMap: Map<string, Field>, pasteOptions?: PasteOptions) => {
    field: Field;
    textArray: string[];
} | null;
export declare const checkAndPasteElements: ({ field, textArray }: {
    field: Field;
    textArray: string[];
}, insertPosition: number | null, insertMatchers: (matchers: Matcher | Matcher[], position: number | null) => void) => Promise<void>;
